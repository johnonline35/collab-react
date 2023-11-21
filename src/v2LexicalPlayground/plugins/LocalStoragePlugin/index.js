import { useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import debounce from "lodash.debounce";
import { supabase } from "../../../supabase/clientapp";

export function LocalStoragePlugin({ collab_user_note_id }) {
  const [editor] = useLexicalComposerContext();

  const saveContent = useCallback(
    function (content) {
      localStorage.setItem(collab_user_note_id, content);
    },
    [collab_user_note_id]
  );

  const saveContentToDatabase = useCallback(
    async function (content) {
      try {
        const { data, error } = await supabase
          .from("collab_users_notes")
          .upsert(
            { collab_user_note_id: collab_user_note_id, note_content: content },
            { onConflict: "collab_user_note_id" }
          );

        if (error) throw error;
      } catch (error) {
        console.error("Error saving to database:", error);
      }
    },
    [collab_user_note_id]
  );

  const debouncedSaveContent = debounce(saveContent, 100);
  const debouncedSaveContentToDatabase = debounce(saveContentToDatabase, 10000);

  useEffect(() => {
    if (!collab_user_note_id) {
      console.error("collab_user_note_id is not available");
      return;
    }

    // console.log("LOCAL STORAGE NOTE ID:", collab_user_note_id);

    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

        const serializedState = JSON.stringify(editorState);

        debouncedSaveContent(serializedState);
        debouncedSaveContentToDatabase(serializedState);
      }
    );
  }, [
    debouncedSaveContent,
    debouncedSaveContentToDatabase,
    editor,
    collab_user_note_id,
  ]);

  return null;
}

// import { useCallback, useEffect } from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { debounce } from "lodash";

// export function LocalStoragePlugin({ collab_user_note_id }) {
//   const [editor] = useLexicalComposerContext();

//   const saveContent = useCallback(
//     function (content) {
//       localStorage.setItem(collab_user_note_id, content);
//     },
//     [collab_user_note_id]
//   );

//   const debouncedSaveContent = debounce(saveContent, 100);

//   useEffect(() => {
//     if (!collab_user_note_id) {
//       console.error("collab_user_note_id is not available");
//       return;
//     }

//     console.log("LOCAL STORAGE NOTE ID:", collab_user_note_id);
//     return editor.registerUpdateListener(
//       ({ editorState, dirtyElements, dirtyLeaves }) => {
//         // Don't update if nothing changed
//         if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

//         const serializedState = JSON.stringify(editorState);

//         debouncedSaveContent(serializedState);
//       }
//     );
//   }, [debouncedSaveContent, editor, collab_user_note_id]);

//   return null;
// }
