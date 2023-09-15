import { $applyNodeReplacement, TextNode, $getroot } from "lexical";
import { v4 as uuidv4 } from "uuid";

export function $createMentionNode(mentionName, uuid) {
  const mentionNode = new MentionNode(mentionName, null, null, uuid);
  mentionNode.setMode("segmented").toggleDirectionless();

  //   console.log("Created Mention Node:", mentionNode);
  //   console.log("UUID of Created Mention Node:", mentionNode.__uuid);

  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(node) {
  return node instanceof MentionNode;
}

function convertMentionElement(domNode) {
  const textContent = domNode.textContent;
  const uuid = domNode.getAttribute("data-uuid");

  if (textContent !== null) {
    const node = $createMentionNode(textContent, uuid);
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = "background-color: rgba(24, 119, 232, 0.2)";
export class MentionNode extends TextNode {
  constructor(mentionName, text, key, uuid) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
    this.__uuid = uuid ?? uuidv4(); // Use provided UUID or generate a new one
  }

  static getType() {
    return "mention";
  }

  static clone(node) {
    return new MentionNode(
      node.__mention,
      node.__text,
      node.__key,
      node.__uuid
    );
  }

  static importJSON(serializedNode) {
    console.log("Deserializing MentionNode:", serializedNode);
    const node = new MentionNode(
      serializedNode.mentionName,
      serializedNode.text,
      undefined,
      serializedNode.uuid
    );
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    console.log("Resulting MentionNode after deserialization:", node);
    return node;
  }

  exportJSON() {
    const serializedData = {
      ...super.exportJSON(),
      mentionName: this.__mention,
      uuid: this.__uuid,
      type: "mention",
      version: 1,
    };
    console.log("Serialized MentionNode:", serializedData);
    return serializedData;
  }

  // static importJSON(serializedNode) {
  //   const node = new MentionNode(
  //     serializedNode.mentionName,
  //     serializedNode.text,
  //     undefined,
  //     serializedNode.uuid
  //   );
  //   node.setFormat(serializedNode.format);
  //   node.setDetail(serializedNode.detail);
  //   node.setMode(serializedNode.mode);
  //   node.setStyle(serializedNode.style);
  //   return node;
  // }

  // exportJSON() {
  //   return {
  //     ...super.exportJSON(),
  //     mentionName: this.__mention,
  //     uuid: this.__uuid,
  //     type: "mention",
  //     version: 1,
  //   };
  // }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = "mention";
    dom.dataset.uuid = this.__uuid;
    return dom;
  }

  exportDOM() {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-mention", "true");
    element.setAttribute("data-uuid", this.__uuid);
    element.textContent = this.__text;
    return { element };
  }

  static importDOM() {
    return {
      span: (domNode) => {
        if (!domNode.hasAttribute("data-lexical-mention")) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity() {
    return true;
  }
}
