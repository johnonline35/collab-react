import { useEffect } from "react";
import { $createEmoticonNode } from "../nodes/EmoticonNode";
import { TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function emoticonTransform(node) {
  const textContent = node.getTextContent();
  if (textContent === ":avo:") {
    node.replace($createEmoticonNode("emoticon avo-emoticon", "avo"));
  } else if (textContent === ":)") {
    node.replace($createEmoticonNode("", "🙂"));
  }
}

function useEmoticons(editor) {
  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(
      TextNode,
      emoticonTransform
    );
    return () => {
      removeTransform();
    };
  }, [editor]);
}

export default function EmoticonPlugin() {
  const [editor] = useLexicalComposerContext();
  useEmoticons(editor);
  return null;
}
