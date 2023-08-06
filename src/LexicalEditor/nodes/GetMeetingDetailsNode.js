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
      // If there is already content in the attendeeText, append a separator to it.
      if (attendeeText) {
        attendeesContainer.append(
          $createParagraphNode().append($createTextNode(attendeeText + " | "))
        );
        attendeeText = ""; // Reset attendeeText
      }

      // Create the LinkedIn link and append to the container.
      attendeesContainer.append(
        $createParagraphNode()
          .append($createTextNode("LinkedIn Profile: "))
          .append(
            $createLinkNode(attendee.attendee_linkedin, {
              target: "_blank",
              title: "LinkedIn Profile",
            })
          )
      );
    }

    if (attendee.attendee_twitter) {
      // If there is already content in the attendeeText or a LinkedIn link was added, append a separator.
      if (attendeeText || attendee.attendee_linkedin) {
        attendeesContainer.append(
          $createParagraphNode().append($createTextNode(" | "))
        );
      }

      // Create the Twitter link and append to the container.
      attendeesContainer.append(
        $createParagraphNode()
          .append($createTextNode("Twitter: "))
          .append(
            $createLinkNode(attendee.attendee_twitter, {
              target: "_blank",
              title: "Twitter Profile",
            })
          )
      );
    } else if (attendeeText) {
      attendeesContainer.append(
        $createParagraphNode().append($createTextNode(attendeeText))
      );
      attendeeText = ""; // Reset attendeeText
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
