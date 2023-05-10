import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/clientapp";
import debounce from "lodash/debounce";
import { v4 as uuidv4 } from "uuid";

export const useLexicalNodeParse = () => {
  const params = useParams();

  const [fetchedNotes, setFetchedNotes] = useState(false);

  const nodeTypes = useMemo(
    () => [
      {
        mentionName: "Next Step:",
        stateName: "nextSingleStepContent",
        noteIdStateName: "nextSingleStepNoteId",
      },
      {
        mentionName: "Goal",
        stateName: "goalContent",
        noteIdStateName: "goalNoteId",
      },
      {
        mentionName: "Challenge",
        stateName: "challengeContent",
        noteIdStateName: "challengeNoteId",
      },
      {
        mentionName: "Todo",
        stateName: "toDoContent",
        noteIdStateName: "toDoNoteId",
      },
      // Add more node types here if needed
    ],
    []
  );

  const initialState = useMemo(
    () =>
      nodeTypes.reduce((acc, type) => {
        acc[type.stateName] = {};
        acc[type.noteIdStateName] = null;
        return acc;
      }, {}),
    [nodeTypes]
  );

  const [state, setState] = useState(initialState);

  const fetchNotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("collab_users_notes")
        .select("*")
        .eq("workspace_id", params.workspace_id);

      if (error) {
        throw error;
      }

      const newContentState = { ...initialState };

      for (const note of data) {
        const parsedData = JSON.parse(note.note_content);

        // Breadth First Search traversal
        const queue = [parsedData.root];
        const nodesByType = nodeTypes.reduce((acc, type) => {
          acc[type.mentionName] = [];
          return acc;
        }, {});

        while (queue.length > 0) {
          const currentNode = queue.shift();
          if (currentNode.children) {
            for (const child of currentNode.children) {
              queue.push(child);
              const nodeType = nodeTypes.find(
                (type) =>
                  child.type === "mention" &&
                  child.mentionName === type.mentionName
              );
              if (nodeType) {
                nodesByType[nodeType.mentionName].push(currentNode);
              }
            }
          }
        }

        const processNode = (node, nodeType, contentsArray) => {
          let content = "";
          let uuid = "";

          if (node) {
            const contentNode = node.children.find(
              (sibling) => sibling.type === "text"
            );
            const uuidNode = node.children.find(
              (sibling) =>
                sibling.type === "mention" && sibling.mentionName === nodeType
            );
            if (contentNode) {
              content = contentNode.text.trim();
            }
            if (uuidNode) {
              uuid = uuidNode.uuid;
            }
          }

          contentsArray.push({ content, uuid });
        };

        nodeTypes.forEach((type) => {
          const contentsForNote = [];
          nodesByType[type.mentionName].forEach((node) => {
            processNode(node, type.mentionName, contentsForNote);
          });
          newContentState[type.stateName][note.collab_user_note_id] =
            contentsForNote;
        });
      }

      setState(newContentState);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
    setFetchedNotes(true);
  }, [params.workspace_id, initialState, nodeTypes]);

  // Run this algo every five seconds while the user is active. If the user becomes inactive for 60 secs, pause until active
  useEffect(() => {
    let timeoutId;
    let inactivityTimeoutId;
    const debouncedFetchNotes = debounce(fetchNotes, 5000);

    const handleUserActivity = () => {
      clearTimeout(inactivityTimeoutId);
      inactivityTimeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        debouncedFetchNotes.cancel();
      }, 60000);

      debouncedFetchNotes();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        debouncedFetchNotes();
      }, 5000);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
      clearTimeout(timeoutId);
      clearTimeout(inactivityTimeoutId);
      debouncedFetchNotes.cancel();
    };
  }, [fetchNotes]);

  // console.log("nextSingleStepContent", nextSingleStepContent);

  const saveMentionContent = useCallback(
    async (mentionName, contentWithUUID) => {
      console.log(`${mentionName}ContentWithUUID`, contentWithUUID);

      // Check if the UUID already exists for the given workspace_id
      const { data: existingData, error: existingError } = await supabase
        .from(`collab_users_${mentionName.toLowerCase()}s`)
        .select("*")
        .eq("workspace_id", params.workspace_id)
        .eq(`${mentionName.toLowerCase()}_uuid`, contentWithUUID.uuid);

      if (existingError) {
        console.error(
          `Error checking existing ${mentionName}_content:`,
          existingError
        );
      } else if (existingData.length === 0) {
        // If the UUID does not exist, create a new UUID for collab_user_next_steps_id
        const newId = uuidv4();

        // Upsert the content using nextstep_uuid as a constraint
        const { data, error } = await supabase
          .from(`collab_users_${mentionName.toLowerCase()}s`)
          .upsert(
            [
              {
                [`collab_user_${mentionName.toLowerCase()}_id`]: newId,
                workspace_id: params.workspace_id,
                [`${mentionName.toLowerCase()}_content`]:
                  contentWithUUID.content,
                [`${mentionName.toLowerCase()}_uuid`]: contentWithUUID.uuid,
              },
            ],
            {
              onConflict: `${mentionName.toLowerCase()}_uuid`,
              returning: "minimal",
            }
          );

        if (error) {
          console.error(`Error upserting ${mentionName}_content:`, error);
        } else {
          console.log(`Successfully upserted ${mentionName}_content:`, data);
        }
      } else {
        console.log(
          `UUID already exists in the ${mentionName.toLowerCase()}_uuid column`
        );
      }
    },
    [params.workspace_id]
  );

  useEffect(() => {
    if (fetchedNotes) {
      nodeTypes.forEach((type) => {
        for (const noteId in state[type.stateName]) {
          for (const content of state[type.stateName][noteId]) {
            saveMentionContent(type.mentionName, content);
          }
        }
      });
    }
  }, [fetchedNotes, state, nodeTypes, saveMentionContent]);

  return {
    ...state,
    fetchedNotes,
    fetchNotes,
  };
};
