import { useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

export function LocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();
  const { workspace_id } = useParams();

  const saveContent = useCallback(
    function (content) {
      localStorage.setItem(workspace_id, content);
    },
    [workspace_id]
  );

  const debouncedSaveContent = debounce(saveContent, 100);

  useEffect(() => {
    // Load the state from local storage when the component first mounts
    const savedContent = localStorage.getItem(workspace_id);
    if (savedContent) {
      const savedStateJSON = JSON.parse(savedContent);
      const savedState = editor.parseEditorState(savedStateJSON);
      editor.setEditorState(savedState); // Update the editor state
    }

    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Don't update if nothing changed
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

        const serializedState = JSON.stringify(editorState);
        debouncedSaveContent(serializedState);
      }
    );
  }, [debouncedSaveContent, editor, workspace_id]);

  return null;
}
