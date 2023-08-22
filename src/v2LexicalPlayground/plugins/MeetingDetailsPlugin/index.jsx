import { useParams } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { useEffect, useState } from "react";
import { fetchLexicalMeetingData } from "../../../util/database";
import {
  $createParagraphNode,
  $createTextNode,
  $createHeadingNode,
  $createLinkNode,
  $createQuoteNode,
} from "lexical";
import { capitalizeFirstLetterOfEachWord } from "../utils/timeAndCapitalize";
import { utcToZonedTime, format } from "date-fns-tz";

export const INSERT_MEETING_DETAILS_COMMAND = createCommand();

function formatURL(url) {
  if (!url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
}

function createLinkNodeWithText(url, text, title) {
  url = formatURL(url);
  const linkNode = $createLinkNode(url, {
    target: "_blank",
    title: title,
  });
  linkNode.append($createTextNode(text));
  return linkNode;
}

export default function MeetingDetailsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [meetingData, setMeetingData] = useState([]);
  const { workspace_id } = useParams();

  useEffect(() => {
    console.log(
      "useEffect for fetching Lexical Meeting Data is called with workspace_id:",
      workspace_id
    );

    fetchLexicalMeetingData(workspace_id).then((data) => {
      setMeetingData(data);
    });
  }, [workspace_id]);

  useEffect(() => {
    if (!meetingData || meetingData.length === 0) {
      console.log("No meeting data");
      return;
    }

    const unregister = editor.registerCommand(
      INSERT_MEETING_DETAILS_COMMAND,
      () => {
        editor.update(() => {
          const root = $getRoot();
          const meeting = meetingData[0];

          // Workspace Name Heading
          root.append(
            $createHeadingNode("h1")
              .append(
                $createTextNode(meeting.workspaceName + " Notes").setStyle(
                  "font-weight: bold"
                )
              )
              .setFormat("center")
          );

          // Next Meeting Date
          const timeZone = meeting.user_timezone;
          const zonedDate = utcToZonedTime(
            new Date(meeting.nextMeetingDate),
            timeZone
          );
          let formattedNextMeetingDate = format(
            zonedDate,
            "EEEE, MMMM d, h:mma",
            {
              timeZone,
            }
          )
            .replace("AM", "am")
            .replace("PM", "pm");
          if (
            formattedNextMeetingDate.endsWith(":00am") ||
            formattedNextMeetingDate.endsWith(":00pm")
          ) {
            formattedNextMeetingDate = formattedNextMeetingDate.replace(
              ":00",
              ""
            );
          }
          root.append(
            $createHeadingNode("h2").append(
              $createTextNode(formattedNextMeetingDate)
            )
          );

          const attendeesContainer = $createQuoteNode();
          meeting.attendees.forEach((attendee) => {
            // Company Information
            if (
              attendee.attendee_domain ||
              attendee.job_company_linkedin_url ||
              attendee.job_company_twitter_url
            ) {
              const companyParagraph = $createParagraphNode();
              companyParagraph.append(
                $createTextNode(
                  meeting.workspaceName + " Company Information | "
                )
              );

              let companyLinks = [];

              if (attendee.attendee_domain) {
                companyLinks.push(
                  createLinkNodeWithText(
                    attendee.attendee_domain,
                    "Website",
                    "Company Website"
                  )
                );
              }
              if (attendee.job_company_linkedin_url) {
                companyLinks.push(
                  createLinkNodeWithText(
                    attendee.job_company_linkedin_url,
                    "LinkedIn",
                    "Company LinkedIn"
                  )
                );
              }
              if (attendee.job_company_twitter_url) {
                companyLinks.push(
                  createLinkNodeWithText(
                    attendee.job_company_twitter_url,
                    "Twitter",
                    "Company Twitter"
                  )
                );
              }

              for (let i = 0; i < companyLinks.length; i++) {
                companyParagraph.append(companyLinks[i]);
                if (i !== companyLinks.length - 1) {
                  companyParagraph.append($createTextNode(" | "));
                }
              }

              attendeesContainer.append(companyParagraph);
            }

            // Attendee Information
            const attendeeParagraph = $createParagraphNode();
            let attendeeText = "";
            if (attendee.attendee_name) {
              attendeeText = capitalizeFirstLetterOfEachWord(
                attendee.attendee_name
              );
            }
            if (attendee.attendee_job_title) {
              const attendeeJobTitle = capitalizeFirstLetterOfEachWord(
                attendee.attendee_job_title
              );
              attendeeText += attendeeText
                ? ", " + attendeeJobTitle
                : attendeeJobTitle;
            }
            if (attendeeText) {
              attendeeParagraph.append($createTextNode(attendeeText));
            }

            // Attendee Social Media Links
            let socialLinks = [];

            if (attendee.attendee_linkedin_url) {
              socialLinks.push(
                createLinkNodeWithText(
                  attendee.attendee_linkedin_url,
                  "LinkedIn",
                  "Attendee LinkedIn"
                )
              );
            }
            if (attendee.attendee_twitter_url) {
              socialLinks.push(
                createLinkNodeWithText(
                  attendee.attendee_twitter_url,
                  "Twitter",
                  "Attendee Twitter"
                )
              );
            }

            for (let i = 0; i < socialLinks.length; i++) {
              attendeeParagraph.append($createTextNode(" ("));
              attendeeParagraph.append(socialLinks[i]);
              attendeeParagraph.append($createTextNode(")"));
              if (i !== socialLinks.length - 1) {
                attendeeParagraph.append($createTextNode(", "));
              }
            }

            attendeesContainer.append(attendeeParagraph);
          });
          root.append(attendeesContainer);
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => {
      if (typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor, meetingData]);

  return null;
}

// import { useParams } from "react-router-dom";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { $getRoot, createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
// import { $createMeetingDetailsNode } from "../../nodes/GetMeetingDetailsNode";
// import { useEffect, useState } from "react";
// import { fetchLexicalMeetingData } from "../../../util/database";

// export const INSERT_MEETING_DETAILS_COMMAND = createCommand();

// export default function MeetingDetailsPlugin() {
//   const [editor] = useLexicalComposerContext();
//   const [meetingData, setMeetingData] = useState([]);
//   const { workspace_id } = useParams();

//   // Fetch the meeting data only when workspace_id changes
//   useEffect(() => {
//     console.log(
//       "useEffect for fetching Lexical Meeting Data is called with workspace_id:",
//       workspace_id
//     );

//     fetchLexicalMeetingData(workspace_id).then((data) => {
//       setMeetingData(data);
//     });
//   }, [workspace_id]); // Only workspace_id in the dependencies

//   // Register the command, depending on editor and meetingData
//   useEffect(() => {
//     if (!meetingData || meetingData.length === 0) {
//       console.log("No meeting data");
//       return;
//     }

//     const unregister = editor.registerCommand(
//       INSERT_MEETING_DETAILS_COMMAND,
//       () => {
//         editor.update(() => {
//           const root = $getRoot();
//           meetingData.forEach((m) => {
//             const gmdNode = $createMeetingDetailsNode(m);
//             root.append(gmdNode);
//           });
//         });
//         return true;
//       },
//       COMMAND_PRIORITY_EDITOR
//     );

//     // If the registerCommand method returns a function to unregister the command, you can call it in the cleanup
//     return () => {
//       if (typeof unregister === "function") {
//         unregister();
//       }
//     };
//   }, [editor, meetingData]); // Only editor and meetingData in the dependencies

//   return null;
// }
