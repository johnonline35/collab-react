import { TextNode } from "lexical";

export class EmoticonNode extends TextNode {
  __className;

  static getType() {
    return "emoticon";
  }

  static clone(node) {
    return new EmoticonNode(node.__className, node.__text, node.__key);
  }

  constructor(className, text, key) {
    super(text, key);
    this.__className = className;
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.className = this.__className;
    return dom;
  }
}

export function $isEmoticonNode(node) {
  return node instanceof EmoticonNode;
}

export function $createEmoticonNode(className, emoticonText) {
  return new EmoticonNode(className, emoticonText).setMode("token");
}
