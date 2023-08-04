import {
  $createTextNode,
  $createHeadingNode,
  $createQuoteNode,
  $createParagraphNode,
} from "@lexical/rich-text";

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = [];

  // Create and append the centered h1 heading
  gmdNode.push(
    $createHeadingNode("h1", { format: "center" }).append(
      $createTextNode(meetingDetails.workspaceName)
    )
  );

  // Append a blank line (empty paragraph)
  gmdNode.push($createParagraphNode());

  // Create and append the attendees
  const attendeesContainer = $createQuoteNode();
  meetingDetails.attendees.forEach((attendee) => {
    attendeesContainer.append(
      $createParagraphNode().append($createTextNode(attendee.attendee_name))
    );
  });
  gmdNode.push(attendeesContainer);

  return gmdNode;
}
