import { useState, useEffect } from "react";
import { supabase } from "../supabase/clientapp";
// import { updateLexicalWithMeetingData } from "./useLexicalMeetingInsert";
import { v4 as uuidv4 } from "uuid";
import { defaultState } from "./useLexicalDefaultState";

//   const fetchSavedNote = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("collab_users_notes")
//         .select("note_content, collab_user_note_id")
//         .eq("workspace_id", params.workspace_id);

//       if (error) {
//         throw error;
//       }

//       if (data && data.length > 0) {
//         setInitialNoteJson(data[0].note_content);
//         setCollabUserNoteId(data[0].collab_user_note_id); // Store the collab_user_note_id
//         console.log("data.note_content", data[0].note_content);
//         setLoadingState("loaded");
//       } else {
//         const newUuid = uuidv4();
//         const { data: newData, error: newError } = await supabase
//           .from("collab_users_notes")
//           .insert([
//             {
//               collab_user_note_id: newUuid,
//               workspace_id: params.workspace_id,
//               note_content: defaultState,
//             },
//           ]);

//         if (newError) {
//           throw newError;
//         }

//         setInitialNoteJson(defaultState);
//         setCollabUserNoteId(newUuid); // Store the new collab_user_note_id
//         setLoadingState("loaded");
//       }
//     } catch (error) {
//       console.error("Error fetching or creating saved note:", error.message);
//       setInitialNoteJson(defaultState);
//       setLoadingState("error");
//     }
//   };

export const useFetchSavedNotes = (workspaceId) => {
  const [initialNoteJson, setInitialNoteJson] = useState();
  const [loadingState, setLoadingState] = useState("loading");
  const [collabUserNoteId, setCollabUserNoteId] = useState(null);

  useEffect(() => {
    const fetchSavedNote = async () => {
      try {
        const { data, error } = await supabase
          .from("collab_users_notes")
          .select("note_content, collab_user_note_id")
          .eq("workspace_id", workspaceId);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setInitialNoteJson(data[0].note_content);
          setCollabUserNoteId(data[0].collab_user_note_id); // Store the collab_user_note_id
          console.log("data.note_content", data[0].note_content);
          setLoadingState("loaded");
        } else {
          const newUuid = uuidv4();
          const { data: newData, error: newError } = await supabase
            .from("collab_users_notes")
            .insert([
              {
                collab_user_note_id: newUuid,
                workspace_id: workspaceId,
                note_content: defaultState,
              },
            ]);

          if (newError) {
            throw newError;
          }

          //   let updatedNoteContent = await updateLexicalWithMeetingData(
          //     workspaceId,
          //     defaultState
          //   );
          setInitialNoteJson(defaultState);
          setCollabUserNoteId(newUuid); // Store the new collab_user_note_id
          setLoadingState("loaded");
        }
      } catch (error) {
        console.error("Error fetching or creating saved note:", error.message);
        setInitialNoteJson(defaultState);
        setLoadingState("error");
      }
    };

    fetchSavedNote();
  }, [workspaceId]);

  return { initialNoteJson, loadingState, collabUserNoteId };
};

// export const useFetchSavedNotes = (workspaceId, defaultState) => {
//   const [initialNoteJson, setInitialNoteJson] = useState();
//   const [loadingState, setLoadingState] = useState("loading");
//   const [collabUserNoteId, setCollabUserNoteId] = useState(null);

//   useEffect(() => {
//     const fetchSavedNote = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("collab_users_notes")
//           .select("note_content, collab_user_note_id")
//           .eq("workspace_id", workspaceId);

//         if (error) {
//           throw error;
//         }

//         if (data && data.length > 0) {
//           let updatedNoteContent = await updateLexicalWithMeetingData(
//             workspaceId,
//             data[0].note_content
//           );
//           setInitialNoteJson(updatedNoteContent);
//           setCollabUserNoteId(data[0].collab_user_note_id); // Store the collab_user_note_id
//           console.log("data.note_content", data[0].note_content);
//           setLoadingState("loaded");
//         } else {
//           const newUuid = uuidv4();
//           const { data: newData, error: newError } = await supabase
//             .from("collab_users_notes")
//             .insert([
//               {
//                 collab_user_note_id: newUuid,
//                 workspace_id: workspaceId,
//                 note_content: defaultState,
//               },
//             ]);

//           if (newError) {
//             throw newError;
//           }

//           let updatedNoteContent = await updateLexicalWithMeetingData(
//             workspaceId,
//             defaultState
//           );
//           setInitialNoteJson(updatedNoteContent);
//           setCollabUserNoteId(newUuid); // Store the new collab_user_note_id
//           setLoadingState("loaded");
//         }
//       } catch (error) {
//         console.error("Error fetching or creating saved note:", error.message);
//         setInitialNoteJson(defaultState);
//         setLoadingState("error");
//       }
//     };

//     fetchSavedNote();
//   }, [workspaceId, defaultState]);

//   return { initialNoteJson, loadingState, collabUserNoteId };
// };
