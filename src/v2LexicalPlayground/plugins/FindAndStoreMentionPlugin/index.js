import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

export default function FindAndStoreMentionPlugin() {
  console.log("FindAndStoreMentionPlugin Called.");

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor) {
      console.warn("Editor is not properly initialized.");
      return;
    }

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const allTextNodes = root.getAllTextNodes();
        allTextNodes.forEach((element) => {
          if (element.__mention === "Next Step:") {
            const nextStepNode = element;
            const firstChild = nextStepNode.getFirstChild();
            console.log("Mention Node Type:", element.__mention);
            console.log("Mention Node UUID:", element.__uuid);
            console.log("firstChild:", firstChild);
          }
        });
      });
    });

    return () => {
      if (unregister && typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor]);

  return null;
}
