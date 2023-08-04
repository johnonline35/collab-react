import { ParagraphNode, ElementNode, TextNode } from "lexical";

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = [];

  // Create and append the centered h1 heading
  const headingNode = new ElementNode("h1");
  headingNode.append(new TextNode(meetingDetails.workspaceName));

  // Apply center styling. Note: This assumes Lexical accepts custom CSS for the nodes.
  headingNode.createDOM = () => {
    const dom = document.createElement("h1");
    dom.style.textAlign = "center";
    return dom;
  };

  gmdNode.push(headingNode);

  // Append a blank line (empty paragraph)
  gmdNode.push(new ParagraphNode());

  // Create and append the attendees
  meetingDetails.attendees.forEach((attendee) => {
    const attendeeParagraph = new ParagraphNode();
    attendeeParagraph.append(new TextNode(attendee.attendee_name));
    gmdNode.push(attendeeParagraph);
  });

  return gmdNode;
}
