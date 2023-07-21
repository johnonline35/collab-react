import { $createParagraphNode, ElementNode } from "lexical";
import { $createTextNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";

export class MeetingNode extends ElementNode {
  static getType() {
    return "custom-meeting-node";
  }

  static clone(node) {
    return new MeetingNode(node.__key);
  }

  createDOM() {
    const dom = document.createElement("div");
    return dom;
  }

  updateDOM(prevNode, dom) {
    return false;
  }

  importJSON() {
    // TODO: Implement when the JSON importing functionality is required
  }

  exportJSON() {
    console.log("exportJSON", this);
    return {
      type: MeetingNode.getType(),
      version: 0,
      children: [],
    };
  }
}

export function $createMeetingNode({ companyName, attendees }) {
  const icNode = $createParagraphNode();
  //   new MeetingNode();

  icNode.append($createHeadingNode("h1").append($createTextNode(companyName)));

  const attendeesContainer = $createQuoteNode();
  attendees.forEach((attendee) => {
    attendeesContainer.append(
      $createParagraphNode().append($createTextNode(attendee))
    );
  });
  icNode.append(attendeesContainer);

  return icNode;
}

export function $isMeetingNode(node) {
  return node instanceof MeetingNode;
}
