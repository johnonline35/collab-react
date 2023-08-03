import { $createParagraphNode, ElementNode } from "lexical";
import { $createTextNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";

export function $createMeetingDetailsNode({ companyName, attendees }) {
  const gmdNode = $createParagraphNode(); // new MeetingDetailsNode();

  gmdNode.append($createHeadingNode("h1").append($createTextNode(companyName)));

  const attendeesContainer = $createQuoteNode();
  attendees.forEach((attendee) => {
    attendeesContainer.append(
      $createParagraphNode().append($createTextNode(attendee))
    );
  });
  gmdNode.append(attendeesContainer);

  return gmdNode;
}
