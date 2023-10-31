// import { useCallback, useEffect } from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { useParams } from "react-router-dom";
// import { debounce } from "lodash";

// export function LocalStoragePlugin() {
//   const [editor] = useLexicalComposerContext();
//   const { workspace_id, collab_user_note_id } = useParams();

//   const saveContent = useCallback(
//     function (content) {
//       const localStorageKey = `content_${workspace_id}_${collab_user_note_id}`;
//       localStorage.setItem(localStorageKey, content);
//     },
//     [workspace_id, collab_user_note_id]
//   );

//   const debouncedSaveContent = debounce(saveContent, 100);

//   useEffect(() => {
//     return editor.registerUpdateListener(
//       ({ editorState, dirtyElements, dirtyLeaves }) => {
//         // Don't update if nothing changed
//         if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

//         const serializedState = JSON.stringify(editorState);
//         debouncedSaveContent(serializedState);
//       }
//     );
//   }, [debouncedSaveContent, editor, workspace_id, collab_user_note_id]);

//   return null;
// }

import { useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

export function LocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();
  const { collab_user_note_id } = useParams();

  const saveContent = useCallback(
    function (content) {
      localStorage.setItem(collab_user_note_id, content);
    },
    [collab_user_note_id]
  );

  const debouncedSaveContent = debounce(saveContent, 100);

  useEffect(() => {
    if (!collab_user_note_id) {
      console.log("collab_user_note_id is not available");
      return;
    }
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Don't update if nothing changed
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
        // console.log("editorState:", editorState);
        // console.log(
        //   "JSON.stringify(editorState):",
        //   JSON.stringify(editorState)
        // );

        const serializedState = JSON.stringify(editorState);
        // editor.getEditorState().toJSON();
        // JSON.stringify(editorState);
        // console.log("Serialized Editor State:", serializedState);

        debouncedSaveContent(serializedState);
      }
    );
  }, [debouncedSaveContent, editor, collab_user_note_id]);

  return null;
}
