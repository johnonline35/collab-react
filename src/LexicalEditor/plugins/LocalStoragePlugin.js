import { useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { debounce } from "lodash";

export function LocalStoragePlugin(props) {
  const namespace = props.namespace;
  const [editor] = useLexicalComposerContext();

  const saveContent = useCallback(
    function (content) {
      localStorage.setItem(namespace, content);
    },
    [namespace]
  );

  const debouncedSaveContent = debounce(saveContent, 150); // 150ms debounce rate

  useEffect(() => {
    // Load the state from local storage when the component first mounts
    const savedContent = localStorage.getItem(namespace);
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
  }, [debouncedSaveContent, editor, namespace]);

  return null;
}
