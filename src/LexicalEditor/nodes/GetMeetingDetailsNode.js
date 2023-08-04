import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = $createParagraphNode();

  // Use workspaceName as the heading
  gmdNode.append(
    $createHeadingNode("h1")
      .append($createTextNode(meetingDetails.workspaceName + " Notes"))
      .append($createParagraphNode())
  );

  // Use attendees' names as the content
  const attendeesContainer = $createQuoteNode();
  meetingDetails.attendees.forEach((attendee) => {
    const attendeeText =
      attendee.attendee_name + " " + attendee.attendee_job_title; // Concatenate name and job title
    attendeesContainer.append(
      $createParagraphNode().append(
        $createTextNode(attendeeText) // Pass the concatenated string as a single argument
      )
    );
  });
  gmdNode.append(attendeesContainer);

  return gmdNode;
}
