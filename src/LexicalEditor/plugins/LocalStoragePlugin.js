import { useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { debounce } from "../../util/debounce";

export function LocalStoragePlugin(props) {
  const namespace = props.namespace;
  const [editor] = useLexicalComposerContext();

  const saveContent = useCallback(
    function (content) {
      localStorage.setItem(namespace, content);
    },
    [namespace]
  );

  const debouncedSaveContent = debounce(saveContent, 500);

  useEffect(() => {
    // Load the state from local storage when the component first mounts
    const savedContent = localStorage.getItem(namespace);
    if (savedContent) {
      const savedState = JSON.parse(savedContent);
      editor.updateState(savedState);
    }

    return editor.registerUpdateListener(function ({
      editorState,
      dirtyElements,
      dirtyLeaves,
    }) {
      // Don't update if nothing changed
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      const serializedState = JSON.stringify(editorState);
      debouncedSaveContent(serializedState);
    });
  }, [debouncedSaveContent, editor, namespace]);

  return null;
}
