import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/clientapp";
import debounce from "lodash/debounce";
import { v4 as uuidv4 } from "uuid";

// // Parse the Collab_Users_Notes table and run BFS algo to find all the Next Step: nodes, store those in state

// PREVIOUS LATEST VERSION OF ABOVE:

export const useLexicalNodeParse = () => {
  const params = useParams();
  const [nextSingleStepContent, setNextSingleStepContent] = useState({});
  const [nextSingleStepNoteId, setNextSingleStepNoteId] = useState(null);
  const [goalContent, setGoalContent] = useState({});
  const [goalNoteId, setGoalNoteId] = useState(null);
  const [challengeContent, setChallengeContent] = useState({});
  const [challengeNoteId, setChallengeNoteId] = useState(null);
  const [toDoContent, setToDoContent] = useState({});
  const [toDoNoteId, setToDoNoteId] = useState(null);

  const [fetchedNotes, setFetchedNotes] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("collab_users_notes")
        .select("*")
        .eq("workspace_id", params.workspace_id);

      if (error) {
        throw error;
      }

      const nextStepContents = {};
      const goalContents = {};
      const challengeContents = {};
      const toDoContents = {};

      for (const note of data) {
        const parsedData = JSON.parse(note.note_content);

        // Breadth First Search traversal
        const queue = [parsedData.root];
        let nextStepNodes = [];
        let goalNodes = [];
        let challengeNodes = [];
        let toDoNodes = [];

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
              } else if (
                child.type === "mention" &&
                child.mentionName === "Goal"
              ) {
                goalNodes.push(currentNode);
              } else if (
                child.type === "mention" &&
                child.mentionName === "Challenge"
              ) {
                challengeNodes.push(currentNode);
              } else if (
                child.type === "mention" &&
                child.mentionName === "Todo"
              ) {
                toDoNodes.push(currentNode);
              }
            }
          }
        }

        let nextStepContentsForNote = [];
        let toDoContentsForNote = [];
        let goalContentsForNote = [];
        let challengeContentsForNote = [];

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
              const text = contentNode.text.trim();
              const endIndex =
                contentNode.type === "paragraph" ? text.length : text.length;
              content = text.substring(0, endIndex);
            }
            if (uuidNode) {
              uuid = uuidNode.uuid;
            }
          }

          contentsArray.push({ content, uuid });
        };

        for (const nextStepNode of nextStepNodes) {
          processNode(nextStepNode, "Next Step:", nextStepContentsForNote);
        }

        for (const toDoNode of toDoNodes) {
          processNode(toDoNode, "Todo", toDoContentsForNote);
        }

        for (const goalNode of goalNodes) {
          processNode(goalNode, "Goal", goalContentsForNote);
        }

        for (const challengeNode of challengeNodes) {
          processNode(challengeNode, "Challenge", challengeContentsForNote);
        }

        nextStepContents[note.collab_user_note_id] = nextStepContentsForNote;
        toDoContents[note.collab_user_note_id] = toDoContentsForNote;
        goalContents[note.collab_user_note_id] = goalContentsForNote;
        challengeContents[note.collab_user_note_id] = challengeContentsForNote;
      }

      setNextSingleStepContent(nextStepContents);
      setGoalContent(goalContents);
      setChallengeContent(challengeContents);
      setToDoContent(toDoContents);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
    setFetchedNotes(true);
  }, [params.workspace_id]);

  // Run this algo every five seconds while the user is active. If the user becomes inactive for 60 secs, pause until active
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        fetchNotes();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fetchNotes]);

  // useEffect(() => {
  //   let timeoutId;
  //   let inactivityTimeoutId;
  //   const debouncedFetchNotes = debounce(fetchNotes, 5000);

  //   const handleUserActivity = () => {
  //     clearTimeout(inactivityTimeoutId);
  //     inactivityTimeoutId = setTimeout(() => {
  //       clearTimeout(timeoutId);
  //       debouncedFetchNotes.cancel();
  //     }, 60000);

  //     debouncedFetchNotes();
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => {
  //       debouncedFetchNotes();
  //     }, 5000);
  //   };

  //   const events = [
  //     "mousemove",
  //     "mousedown",
  //     "keydown",
  //     "scroll",
  //     "touchstart",
  //   ];

  //   events.forEach((event) =>
  //     window.addEventListener(event, handleUserActivity)
  //   );

  //   return () => {
  //     events.forEach((event) =>
  //       window.removeEventListener(event, handleUserActivity)
  //     );
  //     clearTimeout(timeoutId);
  //     clearTimeout(inactivityTimeoutId);
  //     debouncedFetchNotes.cancel();
  //   };
  // }, [fetchNotes]);

  // console.log("nextSingleStepContent", nextSingleStepContent);

  const saveNextStepContent = useCallback(
    async (nextStepContentWithUUID) => {
      console.log("nextStepContentWithUUID", nextStepContentWithUUID);

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

        // Upsert the content using nextstep_uuid as a constraint
        const { data, error } = await supabase
          .from("collab_users_next_steps")
          .upsert(
            [
              {
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
          setNextSingleStepNoteId(nextStepContentWithUUID.uuid);
        }
      } else {
        console.log("UUID already exists in the nextstep_uuid column");
      }
    },
    [params.workspace_id]
  );

  const saveToDoContent = useCallback(
    async (toDoContentWithUUID) => {
      console.log("toDoContentWithUUID", toDoContentWithUUID);

      // Check if the UUID already exists for the given workspace_id
      const { data: existingData, error: existingError } = await supabase
        .from("collab_users_todos")
        .select("*")
        .eq("workspace_id", params.workspace_id)
        .eq("todo_uuid", toDoContentWithUUID.uuid);

      if (existingError) {
        console.error("Error checking existing todo_content:", existingError);
      } else if (existingData.length === 0) {
        // If the UUID does not exist, create a new UUID for collab_user_todo_id
        const newId = uuidv4();

        // Upsert the content using todo_uuid as a constraint
        const { data, error } = await supabase
          .from("collab_users_todos")
          .upsert(
            [
              {
                collab_user_todo_id: newId,
                workspace_id: params.workspace_id,
                todo_content: toDoContentWithUUID.content,
                todo_uuid: toDoContentWithUUID.uuid,
              },
            ],
            {
              onConflict: "todo_uuid",
              returning: "minimal",
            }
          );

        if (error) {
          console.error("Error upserting todo_content:", error);
        } else {
          console.log("Successfully upserted todo_content:", data);
          setToDoNoteId(newId);
        }
      } else {
        console.log("UUID already exists in the todo_uuid column");
      }
    },
    [params.workspace_id]
  );

  const saveGoalContent = useCallback(
    async (goalContentWithUUID) => {
      console.log("goalContentWithUUID", goalContentWithUUID);

      // Check if the UUID already exists for the given workspace_id
      const { data: existingData, error: existingError } = await supabase
        .from("collab_users_goals")
        .select("*")
        .eq("workspace_id", params.workspace_id)
        .eq("goal_uuid", goalContentWithUUID.uuid);

      if (existingError) {
        console.error("Error checking existing goal_content:", existingError);
      } else if (existingData.length === 0) {
        // If the UUID does not exist, create a new UUID for collab_user_todo_id
        const newId = uuidv4();

        // Upsert the content using todo_uuid as a constraint
        const { data, error } = await supabase
          .from("collab_users_goals")
          .upsert(
            [
              {
                collab_user_goal_id: newId,
                workspace_id: params.workspace_id,
                goal_content: goalContentWithUUID.content,
                goal_uuid: goalContentWithUUID.uuid,
              },
            ],
            {
              onConflict: "goal_uuid",
              returning: "minimal",
            }
          );

        if (error) {
          console.error("Error upserting goal_content:", error);
        } else {
          console.log("Successfully upserted goal_content:", data);
          setGoalNoteId(newId);
        }
      } else {
        console.log("UUID already exists in the goal_uuid column");
      }
    },
    [params.workspace_id]
  );

  const saveChallengeContent = useCallback(
    async (challengeContentWithUUID) => {
      console.log("challengeContentWithUUID", challengeContentWithUUID);

      // Check if the UUID already exists for the given workspace_id
      const { data: existingData, error: existingError } = await supabase
        .from("collab_users_challenges")
        .select("*")
        .eq("workspace_id", params.workspace_id)
        .eq("challenge_uuid", challengeContentWithUUID.uuid);

      if (existingError) {
        console.error(
          "Error checking existing challenge_content:",
          existingError
        );
      } else if (existingData.length === 0) {
        // If the UUID does not exist, create a new UUID for collab_user_challenge_id
        const newId = uuidv4();

        // Upsert the content using challenge_uuid as a constraint
        const { data, error } = await supabase
          .from("collab_users_challenges")
          .upsert(
            [
              {
                collab_user_challenge_id: newId,
                workspace_id: params.workspace_id,
                challenge_content: challengeContentWithUUID.content,
                challenge_uuid: challengeContentWithUUID.uuid,
              },
            ],
            {
              onConflict: "challenge_uuid",
              returning: "minimal",
            }
          );

        if (error) {
          console.error("Error upserting challenge_content:", error);
        } else {
          console.log("Successfully upserted challenge_content:", data);
          setChallengeNoteId(newId);
        }
      } else {
        console.log("UUID already exists in the challenge_uuid column");
      }
    },
    [params.workspace_id]
  );

  useEffect(() => {
    if (fetchedNotes) {
      // Call saveNextStepContent for nextSingleStepContent
      for (const noteId in nextSingleStepContent) {
        for (const content of nextSingleStepContent[noteId]) {
          saveNextStepContent(content);
        }
      }

      // Call saveToDoContent for toDoContent
      for (const noteId in toDoContent) {
        for (const content of toDoContent[noteId]) {
          saveToDoContent(content);
        }
      }

      // Call saveGoalContent for goalContent
      for (const noteId in goalContent) {
        for (const content of goalContent[noteId]) {
          saveGoalContent(content);
        }
      }

      // Call saveChallengeContent for challengeContent
      for (const noteId in challengeContent) {
        for (const content of challengeContent[noteId]) {
          saveChallengeContent(content);
        }
      }
    }
  }, [
    fetchedNotes,
    nextSingleStepContent,
    toDoContent,
    goalContent,
    challengeContent,
    saveNextStepContent,
    saveToDoContent,
    saveGoalContent,
    saveChallengeContent,
  ]);

  return {
    nextSingleStepContent,
    nextSingleStepNoteId,
    goalContent,
    goalNoteId,
    challengeContent,
    challengeNoteId,
    toDoContent,
    toDoNoteId,
    fetchedNotes,
  };
};
