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
        .select("note_content")
        .eq("workspace_id", params.workspace_id);

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

        let nextStepContentsForNote = [];

        for (const nextStepNode of nextStepNodes) {
          let nextStepContent = "";

          if (nextStepNode) {
            const contentNode = nextStepNode.children.find(
              (sibling) => sibling.type === "text"
            );
            if (contentNode) {
              const content = contentNode.text.trim();
              const endIndex =
                contentNode.type === "paragraph"
                  ? content.length
                  : content.length;
              nextStepContent = content.substring(0, endIndex);
            }
          }

          console.log("Next step content:", nextStepContent);
          nextStepContentsForNote.push(nextStepContent);
        }

        nextStepContents[note.id] = nextStepContentsForNote;
      }

      setNextSingleStepContent(nextStepContents);
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

  const saveNextStepContent = useCallback(
    async (nextSingleStepContent) => {
      console.log("Check for existing content in db initiated");
      // Check if the content already exists for the given workspace_id
      const { data: existingData, error: existingError } = await supabase
        .from("collab_users_next_steps")
        .select("*")
        .eq("workspace_id", params.workspace_id)
        .eq("nextstep_content", nextSingleStepContent);

      if (existingError) {
        console.error(
          "Error checking existing next_step_content:",
          existingError
        );
      } else if (existingData.length === 0) {
        // If the content does not exist, create a new UUID and insert the content
        const newId = uuidv4();

        // Upsert the content using workspace_id and nextstep_content as constraints
        const { data, error } = await supabase
          .from("collab_users_next_steps")
          .upsert(
            [
              {
                collab_user_next_steps_id: newId,
                workspace_id: params.workspace_id,
                nextstep_content: nextSingleStepContent,
              },
            ],
            {
              onConflict: "workspace_id, nextstep_content",
              returning: "minimal",
            }
          );

        if (error) {
          console.error("Error upserting next_step_content:", error);
        } else {
          console.log("Successfully upserted next_step_content:", data);
          setNextSingleStepNoteId(newId);
        }
      }
    },
    [params.workspace_id]
  ); // Corrected placement of the closing parenthesis

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
