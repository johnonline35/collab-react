import { RootNode, createEditor, ParagraphNode, ElementNode } from "lexical";
import { v4 as uuidv4 } from "uuid";

export class CustomParagraphNode extends ParagraphNode {
  constructor(content, parent) {
    super(content, parent);
    this.uuid = uuidv4();
  }

  static getType() {
    return "custom-paragraph";
  }

  static clone(node) {
    return new CustomParagraphNode(node.content, node.parent);
  }

  static importJSON(serializedNode) {
    const node = new CustomParagraphNode(
      serializedNode.content,
      serializedNode.parent
    );
    node.uuid = serializedNode.uuid;
    return node;
  }

  exportJSON() {
    const serializedNode = super.exportJSON();
    serializedNode.type = CustomParagraphNode.getType();
    serializedNode.uuid = this.uuid;
    console.log(serializedNode);
    return serializedNode;
  }
}

//   createDOM() {
//     const dom = document.createElement("p");
//     dom.setAttribute("data-uuid", this.uuid);
//     return dom;
//   }

//   updateDOM(prevNode, dom) {
//     return true;
//   }
