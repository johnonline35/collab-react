import {
  $createParagraphNode,
  $createTextNode,
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text";

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = $createParagraphNode();

  // Create and append the centered h1 heading
  gmdNode.append(
    $createHeadingNode("h1", { format: "center" }).append(
      $createTextNode(meetingDetails.workspaceName)
    )
  );

  // Append a blank line (empty paragraph)
  gmdNode.append($createParagraphNode());

  // Create and append the attendees
  const attendeesContainer = $createQuoteNode();
  meetingDetails.attendees.forEach((attendee) => {
    attendeesContainer.append(
      $createParagraphNode().append($createTextNode(attendee.attendee_name))
    );
  });
  gmdNode.append(attendeesContainer);

  return gmdNode;
}
