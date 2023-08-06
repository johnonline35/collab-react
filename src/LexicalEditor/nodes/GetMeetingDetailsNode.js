import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createAutoLinkNode, $createLinkNode } from "@lexical/link";
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

  // Format the next meeting date
  const timeZone = meetingDetails.user_timezone;
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
    const attendeeParagraph = $createParagraphNode();
    let attendeeText = "";

    if (attendee.attendee_name) {
      attendeeText = capitalizeFirstLetterOfEachWord(attendee.attendee_name);
    }

    if (attendee.attendee_job_title) {
      const attendeeJobTitle = capitalizeFirstLetterOfEachWord(
        attendee.attendee_job_title
      );
      attendeeText += attendeeText ? ", " + attendeeJobTitle : attendeeJobTitle;
    }

    if (attendeeText) {
      attendeeParagraph.append($createTextNode(attendeeText));
    }

    if (attendee.attendee_linkedin) {
      attendeeParagraph.append($createTextNode(" | "));
      attendeeParagraph.append(
        $createLinkNode(attendee.attendee_linkedin, {
          target: "_blank",
          title: "LinkedIn Profile",
        })
      );
    }

    if (attendee.attendee_twitter) {
      attendeeParagraph.append($createTextNode(" | "));
      attendeeParagraph.append(
        $createLinkNode(attendee.attendee_twitter, {
          target: "_blank",
          title: "Twitter Profile",
        })
      );
    }

    attendeesContainer.append(attendeeParagraph);
  });
  gmdNode.append(attendeesContainer).append($createParagraphNode());

  return gmdNode;
}
