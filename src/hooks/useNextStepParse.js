import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/clientapp";
import debounce from "lodash/debounce";
import { v4 as uuidv4 } from "uuid";

// Parse the Collab_Users_Notes table and run BFS algo to find all the Next Step: nodes, store those in state

export const useNextStepParse = () => {
  const params = useParams();
  const [nextSingleStepContent, setNextSingleStepContent] = useState({});
  const [nextSingleStepNoteId, setNextSingleStepNoteId] = useState(null);
  const [fetchedNotes, setFetchedNotes] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("collab_users_notes")
        .select("*")
        .eq("workspace_id", params.workspace_id);

      // console.log("data", data);
      if (error) {
        throw error;
      }

      const nextStepContents = {};

      for (const note of data) {
        const parsedData = JSON.parse(note.note_content);

        // Breadth First Search traversal
        const queue = [parsedData.root];
        let nextStepNodes = [];

        while (queue.length > 0) {
          const currentNode = queue.shift();
          if (currentNode.children) {
            for (const child of currentNode.children) {
              queue.push(child);
              if (
                child.type === "mention" &&
                child.mentionName === "Next Step:"
              ) {
                nextStepNodes.push(currentNode);
              }
            }
          }
        }

        // console.log("nextStepNodes", nextStepNodes);

        let nextStepContentsForNote = [];

        for (const nextStepNode of nextStepNodes) {
          let nextStepContent = "";
          let uuid = "";

          if (nextStepNode) {
            const contentNode = nextStepNode.children.find(
              (sibling) => sibling.type === "text"
            );
            const uuidNode = nextStepNode.children.find(
              (sibling) =>
                sibling.type === "mention" &&
                sibling.mentionName === "Next Step:"
            );
            if (contentNode) {
              const content = contentNode.text.trim();
              const endIndex =
                contentNode.type === "paragraph"
                  ? content.length
                  : content.length;
              nextStepContent = content.substring(0, endIndex);
            }
            if (uuidNode) {
              uuid = uuidNode.uuid;
            }
          }

          // console.log("uuid:", uuid);
          nextStepContentsForNote.push({ content: nextStepContent, uuid });
        }
        // console.log("nextStepContentsForNote", nextStepContentsForNote);
        nextStepContents[note.collab_user_note_id] = nextStepContentsForNote;
      }

      setNextSingleStepContent(nextStepContents);
      Object.entries(nextStepContents).forEach(
        ([collabUserNoteId, contentsArray]) => {
          contentsArray.forEach((contentObj) => {
            const { content, uuid } = contentObj;
            console.log(
              `collabUserNoteId: ${collabUserNoteId}, content: ${content}, uuid: ${uuid}`
            );
          });
        }
      );
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
    setFetchedNotes(true);
  }, [params.workspace_id]);

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

  const saveNextStepContent = useCallback(
    async (nextStepContentWithUUID) => {
      console.log("nextStepContentWithUUID", nextStepContentWithUUID.uuid);

      // Check if the UUID already exists for the given workspace_id
      const { data: existingData, error: existingError } = await supabase
        .from("collab_users_next_steps")
        .select("*")
        .eq("workspace_id", params.workspace_id)
        .eq("nextstep_uuid", nextStepContentWithUUID.uuid);

      if (existingError) {
        console.error(
          "Error checking existing next_step_content:",
          existingError
        );
      } else if (existingData.length === 0) {
        // If the UUID does not exist, create a new UUID for collab_user_next_steps_id
        const newId = uuidv4();

        // Upsert the content using nextstep_uuid as a constraint
        const { data, error } = await supabase
          .from("collab_users_next_steps")
          .upsert(
            [
              {
                collab_user_next_steps_id: newId,
                workspace_id: params.workspace_id,
                nextstep_content: nextStepContentWithUUID.content,
                nextstep_uuid: nextStepContentWithUUID.uuid,
              },
            ],
            {
              onConflict: "nextstep_uuid",
              returning: "minimal",
            }
          );

        if (error) {
          console.error("Error upserting next_step_content:", error);
        } else {
          console.log("Successfully upserted next_step_content:", data);
          setNextSingleStepNoteId(newId);
        }
      } else {
        console.log("UUID already exists in the nextstep_uuid column");
      }
    },
    [params.workspace_id]
  );

  useEffect(() => {
    if (fetchedNotes) {
      for (const noteId in nextSingleStepContent) {
        for (const content of nextSingleStepContent[noteId]) {
          saveNextStepContent(content);
        }
      }
    }
  }, [fetchedNotes, nextSingleStepContent, saveNextStepContent]);

  return {
    nextSingleStepContent,
    nextSingleStepNoteId,
    fetchedNotes,
  };
};
