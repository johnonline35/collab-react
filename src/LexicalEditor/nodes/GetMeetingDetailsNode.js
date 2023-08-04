import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = $createParagraphNode();

  // Use workspaceName as the heading
  gmdNode.append(
    $createHeadingNode("h1").append(
      $createTextNode(meetingDetails.workspaceName + " Notes")
    )
  );

  // Use attendees' names as the content
  const attendeesContainer = $createQuoteNode();
  meetingDetails.attendees.forEach((attendee) => {
    attendeesContainer.append(
      $createParagraphNode().append(
        $createTextNode(
          attendee.attendee_name,
          +" ",
          attendee.attendee_job_title
        )
      )
    );
  });
  gmdNode.append(attendeesContainer);

  return gmdNode;
}
