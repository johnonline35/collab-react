import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TextNode, $getRoot } from "lexical";

export default function FindAndStoreMentionPlugin() {
  console.log("FindAndStoreMentionPlugin Called.");
  const [editor] = useLexicalComposerContext();

  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      // Just like editor.update(), .read() expects a closure where you can use
      // the $ prefixed helper functions.

      const root = $getRoot();
      const allTextNodes = root.getAllTextNodes();
      allTextNodes.forEach((element) => {
        if (element.__mention === "Next Step:") {
          const nextStepNode = console.log(
            "Mention Node Type:",
            element.__mention
          );
          console.log("Mention Node UUID:", element.__uuid);
        }
        if (element.__mention === "Todo:") {
          console.log("Mention Node Type:", element.__mention);
          console.log("Mention Node UUID:", element.__uuid);
        }
      });
    });
  });
}
