import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getNodeByKey, DecoratorNode } from "lexical";
import { useEffect, useState } from "react";

export class NoteStructureNode extends DecoratorNode {
  constructor(spanText = "", key) {
    super(key);
    this.__spanText = spanText;
  }

  static getType() {
    return "note-structure-node";
  }

  createDOM(config) {
    return document.createElement("span");
  }

  updateDOM() {
    return false;
  }

  static importJSON(serializedNode) {
    const node = $createNoteStructureNode(serializedNode.uuid);
    node.__spanText = serializedNode.spanText;
    return node;
  }

  exportJSON() {
    return {
      uuid: this.__uuid,
      spanText: this.__spanText,
      type: NoteStructureNode.getType(),
      version: 1,
    };
  }

  static clone(node) {
    return new NoteStructureNode(node.__spanText, node.__key);
  }

  decorate() {
    return (
      <NoteStructureNodeComponent uuid={this.__uuid} nodeKey={this.__key} />
    );
  }
}

export function $createNoteStructureNode(uuid) {
  return new NoteStructureNode("", uuid);
}

function NoteStructureNodeComponent(props) {
  const [editor] = useLexicalComposerContext();
  const [spanText, setSpanText] = useState("TEXT");

  useEffect(() => {
    editor.update(() => {
      const currentNode = $getNodeByKey(props.nodeKey);
      const textNode = $createTextNode(spanText);
      currentNode && currentNode.replace(textNode);
    });
  }, [editor, props.nodeKey, spanText]);

  return <span>{spanText}</span>;
}

// useEffect(() => {
//   const delayedLoop = async (text) => {
//     let count = 0;

//     while (count < 5) {
//       count++;
//       const newSpanText = `${text}: ${count} `;
//       setSpanText(newSpanText);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   };

//   delayedLoop("hello");

//   // fetchData();
// }, []);
