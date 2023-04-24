// import {
//   RootNode,
//   createEditor,
//   ParagraphNode,
//   ElementNode,
//   TextNode,
// } from "lexical";
// import { v4 as uuidv4 } from "uuid";

// export class CustomTextNode extends ElementNode {
//   constructor(content, parent) {
//     super(CustomTextNode.getType(), { text: content }, parent);
//     this.uuid = uuidv4();
//   }

//   static getType() {
//     return "custom-text-node";
//   }

//   static clone(node) {
//     const clonedNode = new CustomTextNode(
//       node.getAttribute("text"),
//       node.parent
//     );
//     clonedNode.uuid = node.uuid;
//     return clonedNode;
//   }

//   static importJSON(serializedNode) {
//     const node = new CustomTextNode(
//       serializedNode.attributes.text,
//       serializedNode.parent
//     );
//     node.uuid = serializedNode.uuid;
//     return node;
//   }

//   exportJSON() {
//     const serializedNode = super.exportJSON();
//     serializedNode.type = CustomTextNode.getType();
//     serializedNode.uuid = this.uuid;
//     return serializedNode;
//   }
// }

import {
  RootNode,
  createEditor,
  ParagraphNode,
  ElementNode,
  TextNode,
} from "lexical";
import { v4 as uuidv4 } from "uuid";

export class CustomTextNode extends TextNode {
  constructor(content, parent) {
    super(content, parent);
    this.uuid = uuidv4();
  }

  static getType() {
    return "custom-text-node";
  }

  static clone(node) {
    return new CustomTextNode(node.content, node.parent);
  }

  static importJSON(serializedNode) {
    const node = new CustomTextNode(
      serializedNode.content,
      serializedNode.parent
    );
    node.uuid = serializedNode.uuid;
    return node;
  }

  exportJSON() {
    const serializedNode = super.exportJSON();
    serializedNode.type = CustomTextNode.getType();
    serializedNode.uuid = this.uuid;
    console.log(serializedNode);
    return serializedNode;
  }
}
