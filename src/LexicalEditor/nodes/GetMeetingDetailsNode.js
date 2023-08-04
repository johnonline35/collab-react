import { ParagraphNode, ElementNode, TextNode } from "lexical";

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = [];

  // Create and append the centered h1 heading
  const headingText = new TextNode(meetingDetails.workspaceName);
  const headingNode = new ElementNode("h1");
  headingNode.append(headingText);
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
