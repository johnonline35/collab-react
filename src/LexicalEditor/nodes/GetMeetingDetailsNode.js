import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { capitalizeFirstLetterOfEachWord } from "path-to-your-function"; // Import the function

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = $createParagraphNode();

  // Use workspaceName as the heading
  gmdNode.append(
    $createHeadingNode("h1")
      .append($createTextNode(meetingDetails.workspaceName + " Notes"))
      .append($createParagraphNode())
  );

  // Append the next meeting date
  gmdNode.append(
    $createHeadingNode("h2")
      .append(
        $createTextNode("Next Meeting: " + meetingDetails.nextMeetingDate)
      )
      .append($createParagraphNode())
  );

  // Use attendees' names and job titles as the content
  const attendeesContainer = $createQuoteNode();
  meetingDetails.attendees.forEach((attendee) => {
    const attendeeName = capitalizeFirstLetterOfEachWord(
      attendee.attendee_name
    ); // Capitalize the name
    const attendeeJobTitle = capitalizeFirstLetterOfEachWord(
      attendee.attendee_job_title
    ); // Capitalize the job title
    const attendeeText = attendeeName + " " + attendeeJobTitle;
    attendeesContainer.append(
      $createParagraphNode().append($createTextNode(attendeeText))
    );
  });
  gmdNode.append(attendeesContainer);

  return gmdNode;
}
