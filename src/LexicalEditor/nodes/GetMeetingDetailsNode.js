import {
  $createParagraphNode,
  $getRoot,
  $createTextNode,
  $createLinkNode,
} from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { capitalizeFirstLetterOfEachWord } from "../../util/timeAndCapitalize";
import { utcToZonedTime, format } from "date-fns-tz";

export function $createMeetingDetailsNode(meetingDetails) {
  const gmdNode = $createParagraphNode();

  // Use workspaceName as the heading
  gmdNode.append(
    $createHeadingNode("h1")
      .append(
        $createTextNode(meetingDetails.workspaceName + " Notes").setStyle(
          "font-weight: bold"
        )
      )
      .setFormat("center")
      .append($createParagraphNode())
  );

  // Format the next meeting date using the formatTime function
  const timeZone = meetingDetails.user_timezone; // Assuming you have this property
  const zonedDate = utcToZonedTime(
    new Date(meetingDetails.nextMeetingDate),
    timeZone
  );
  let formattedNextMeetingDate = format(zonedDate, "EEEE, MMMM d, h:mma", {
    timeZone,
  })
    .replace("AM", "am")
    .replace("PM", "pm");

  // If the minutes are "00", remove them
  if (
    formattedNextMeetingDate.endsWith(":00am") ||
    formattedNextMeetingDate.endsWith(":00pm")
  ) {
    formattedNextMeetingDate = formattedNextMeetingDate.replace(":00", "");
  }

  // Append the next meeting date
  gmdNode.append(
    $createHeadingNode("h2")
      .append($createTextNode("Date: " + formattedNextMeetingDate))
      .append($createParagraphNode())
  );

  // Use attendees' names and job titles as the content
  const attendeesContainer = $createQuoteNode();
  meetingDetails.attendees.forEach((attendee) => {
    const textNodes = [];

    if (attendee.attendee_name) {
      const attendeeName = capitalizeFirstLetterOfEachWord(
        attendee.attendee_name
      );
      textNodes.push($createTextNode(attendeeName));
    }

    if (attendee.attendee_job_title) {
      const attendeeJobTitle = capitalizeFirstLetterOfEachWord(
        attendee.attendee_job_title
      );
      textNodes.push($createTextNode(attendeeJobTitle));
    }

    if (attendee.attendee_linkedin) {
      const linkedinLink = $createLinkNode({
        url: attendee.attendee_linkedin,
        title: "LinkedIn Profile",
      });
      textNodes.push(linkedinLink);
    }

    if (attendee.attendee_twitter) {
      const twitterLink = $createLinkNode({
        url: attendee.attendee_twitter,
        title: "Twitter",
      });
      textNodes.push(twitterLink);
    }

    if (textNodes.length > 0) {
      attendeesContainer.append($createParagraphNode().append(...textNodes));
    }
  });

  gmdNode.append(attendeesContainer);

  return gmdNode;
}
