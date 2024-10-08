import type { Spread } from "lexical";

import {
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  $applyNodeReplacement,
  TextNode,
} from "lexical";
import { v4 as uuidv4 } from "uuid";

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    uuid: string;
  },
  SerializedTextNode
>;

function convertMentionElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createMentionNode(textContent);
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = "background-color: rgba(24, 119, 232, 0.2)";
export class MentionNode extends TextNode {
  __mention: string;
  __uuid: string;

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(
      node.__mention,
      node.__text,
      node.__key,
      node.__uuid
    );
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    console.log("Import Json called");
    const node = $createMentionNode(
      serializedNode.mentionName,
      serializedNode.uuid
    );
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    console.log("Node:", node);
    return node;
  }

  constructor(
    mentionName: string,
    text?: string,
    key?: NodeKey,
    uuid?: string
  ) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
    this.__uuid = uuid || uuidv4();
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      type: "mention",
      version: 1,
      uuid: this.__uuid,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = "mention";
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-mention", "true");
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
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

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(
  mentionName: string,
  uuid?: string
): MentionNode {
  const mentionNode = new MentionNode(mentionName, undefined, undefined, uuid);
  mentionNode.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}
