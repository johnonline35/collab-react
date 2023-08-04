import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { capitalizeFirstLetterOfEachWord } from "../../util/timeAndCapitalize";
import { utcToZonedTime, format } from "date-fns-tz";

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = $createParagraphNode();

  // Use workspaceName as the heading
  gmdNode.append(
    $createHeadingNode("h1")
      .append($createTextNode(meetingDetails.workspaceName + " Notes"))
      .append($createParagraphNode())
  );

  // Format the next meeting date using the formatTime function
  const timeZone = meetingDetails.user_timezone; // Assuming you have this property
  const zonedDate = utcToZonedTime(
    new Date(meetingDetails.nextMeetingDate),
    timeZone
  );
  const formattedNextMeetingDate = format(zonedDate, "yyyy-MM-dd HH:mm:ssXXX", {
    timeZone,
  });

  // Append the next meeting date
  gmdNode.append(
    $createHeadingNode("h2")
      .append($createTextNode("Meeting Date: " + formattedNextMeetingDate))
      .append($createParagraphNode())
  );

  // Use attendees' names and job titles as the content
  const attendeesContainer = $createQuoteNode();
  meetingDetails.attendees.forEach((attendee) => {
    let attendeeText = "";

    if (attendee.attendee_name) {
      const attendeeName = capitalizeFirstLetterOfEachWord(
        attendee.attendee_name
      );
      attendeeText += attendeeName;
    }

    if (attendee.attendee_job_title) {
      const attendeeJobTitle = capitalizeFirstLetterOfEachWord(
        attendee.attendee_job_title
      );
      attendeeText += attendeeText ? ", " + attendeeJobTitle : attendeeJobTitle;
    }

    if (attendee.attendee_linkedin) {
      attendeeText += attendeeText
        ? " | LinkedIn Profile: " + attendee.attendee_linkedin
        : "LinkedIn Profile: " + attendee.attendee_linkedin;
    }

    if (attendee.attendee_twitter) {
      attendeeText += attendeeText
        ? " | Twitter: " + attendee.attendee_twitter
        : "Twitter: " + attendee.attendee_twitter;
    }

    if (attendeeText) {
      attendeesContainer.append(
        $createParagraphNode().append($createTextNode(attendeeText))
      );
    }
  });

  gmdNode.append(attendeesContainer);

  return gmdNode;
}
