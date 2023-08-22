import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createLinkNode } from "@lexical/link";
import { capitalizeFirstLetterOfEachWord } from "../utils/timeAndCapitalize";
import { utcToZonedTime, format } from "date-fns-tz";

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

export function $createMeetingDetailsNode(meetingDetails) {
  const root = $getRoot();

  let nodesToAdd = [];

  // Workspace Name Heading
  const workspaceNameNode = $createHeadingNode("h1")
    .append(
      $createTextNode(meetingDetails.workspaceName + " Notes").setStyle(
        "font-weight: bold"
      )
    )
    .setFormat("center");
  nodesToAdd.push(workspaceNameNode);
  nodesToAdd.push($createParagraphNode()); // An empty line after heading

  // Next Meeting Date
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
  if (
    formattedNextMeetingDate.endsWith(":00am") ||
    formattedNextMeetingDate.endsWith(":00pm")
  ) {
    formattedNextMeetingDate = formattedNextMeetingDate.replace(":00", "");
  }

  const meetingDateNode = $createHeadingNode("h2").append(
    $createTextNode(formattedNextMeetingDate)
  );
  nodesToAdd.push(meetingDateNode);
  nodesToAdd.push($createParagraphNode());

  const attendeesContainer = $createQuoteNode();
  meetingDetails.attendees.forEach((attendee) => {
    // Company Information
    if (
      attendee.attendee_domain ||
      attendee.job_company_linkedin_url ||
      attendee.job_company_twitter_url
    ) {
      const companyParagraph = $createParagraphNode();
      companyParagraph.append(
        $createTextNode(
          meetingDetails.workspaceName + " Company Information | "
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

      // Join links with ' | ' separator
      for (let i = 0; i < companyLinks.length; i++) {
        companyParagraph.append(companyLinks[i]);
        if (i !== companyLinks.length - 1) {
          // Not the last item
          companyParagraph.append($createTextNode(" | "));
        }
      }

      attendeesContainer.append(companyParagraph);
    }

    // Attendee Information
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
      const linkedinLinkNode = createLinkNodeWithText(
        attendee.attendee_linkedin,
        "LinkedIn",
        "LinkedIn Profile"
      );
      attendeeParagraph.append(linkedinLinkNode);
    }
    if (attendee.attendee_twitter) {
      attendeeParagraph.append($createTextNode(" | "));
      const twitterLinkNode = createLinkNodeWithText(
        attendee.attendee_twitter,
        "Twitter",
        "Twitter Profile"
      );
      attendeeParagraph.append(twitterLinkNode);
    }
    attendeesContainer.append(attendeeParagraph);
  });
  nodesToAdd.push(attendeesContainer);
  nodesToAdd.push($createParagraphNode());
  nodesToAdd.push($createParagraphNode());

  if (root.getFirstChild() !== null) {
    let firstChild = root.getFirstChild();
    for (let node of nodesToAdd) {
      firstChild.insertBefore(node);
    }
  } else {
    for (let node of nodesToAdd) {
      root.append(node);
    }
  }
}

// import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
// import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
// import { $createLinkNode } from "@lexical/link";
// import { capitalizeFirstLetterOfEachWord } from "../utils/timeAndCapitalize";
// import { utcToZonedTime, format } from "date-fns-tz";

// function formatURL(url) {
//   if (!url.startsWith("http")) {
//     return "https://" + url;
//   }
//   return url;
// }

// function createLinkNodeWithText(url, text, title) {
//   url = formatURL(url);
//   const linkNode = $createLinkNode(url, {
//     target: "_blank",
//     title: title,
//   });
//   linkNode.append($createTextNode(text));
//   return linkNode;
// }

// export function $createMeetingDetailsNode(meetingDetails) {
//   const root = $getRoot();

//   // Workspace Name Heading
//   const workspaceNameNode = $createHeadingNode("h1")
//     .append(
//       $createTextNode(meetingDetails.workspaceName + " Notes").setStyle(
//         "font-weight: bold"
//       )
//     )
//     .setFormat("center");
//   root.append(workspaceNameNode);
//   root.append($createParagraphNode()); // An empty line after heading

//   // Next Meeting Date
//   const timeZone = meetingDetails.user_timezone;
//   const zonedDate = utcToZonedTime(
//     new Date(meetingDetails.nextMeetingDate),
//     timeZone
//   );
//   let formattedNextMeetingDate = format(zonedDate, "EEEE, MMMM d, h:mma", {
//     timeZone,
//   })
//     .replace("AM", "am")
//     .replace("PM", "pm");
//   if (
//     formattedNextMeetingDate.endsWith(":00am") ||
//     formattedNextMeetingDate.endsWith(":00pm")
//   ) {
//     formattedNextMeetingDate = formattedNextMeetingDate.replace(":00", "");
//   }

//   const meetingDateNode = $createHeadingNode("h2").append(
//     $createTextNode(formattedNextMeetingDate)
//   );
//   root.append(meetingDateNode);
//   root.append($createParagraphNode()); // An empty line after date

//   const attendeesContainer = $createQuoteNode();
//   meetingDetails.attendees.forEach((attendee) => {
//     // Company Information
//     if (
//       attendee.attendee_domain ||
//       attendee.job_company_linkedin_url ||
//       attendee.job_company_twitter_url
//     ) {
//       const companyParagraph = $createParagraphNode();
//       companyParagraph.append(
//         $createTextNode(
//           meetingDetails.workspaceName + " Company Information | "
//         )
//       );

//       let companyLinks = [];

//       if (attendee.attendee_domain) {
//         companyLinks.push(
//           createLinkNodeWithText(
//             attendee.attendee_domain,
//             "Website",
//             "Company Website"
//           )
//         );
//       }
//       if (attendee.job_company_linkedin_url) {
//         companyLinks.push(
//           createLinkNodeWithText(
//             attendee.job_company_linkedin_url,
//             "LinkedIn",
//             "Company LinkedIn"
//           )
//         );
//       }
//       if (attendee.job_company_twitter_url) {
//         companyLinks.push(
//           createLinkNodeWithText(
//             attendee.job_company_twitter_url,
//             "Twitter",
//             "Company Twitter"
//           )
//         );
//       }

//       // Join links with ' | ' separator
//       for (let i = 0; i < companyLinks.length; i++) {
//         companyParagraph.append(companyLinks[i]);
//         if (i !== companyLinks.length - 1) {
//           // Not the last item
//           companyParagraph.append($createTextNode(" | "));
//         }
//       }

//       attendeesContainer.append(companyParagraph);
//     }

//     // Attendee Information
//     const attendeeParagraph = $createParagraphNode();
//     let attendeeText = "";
//     if (attendee.attendee_name) {
//       attendeeText = capitalizeFirstLetterOfEachWord(attendee.attendee_name);
//     }
//     if (attendee.attendee_job_title) {
//       const attendeeJobTitle = capitalizeFirstLetterOfEachWord(
//         attendee.attendee_job_title
//       );
//       attendeeText += attendeeText ? ", " + attendeeJobTitle : attendeeJobTitle;
//     }
//     if (attendeeText) {
//       attendeeParagraph.append($createTextNode(attendeeText));
//     }
//     if (attendee.attendee_linkedin) {
//       attendeeParagraph.append($createTextNode(" | "));
//       const linkedinLinkNode = createLinkNodeWithText(
//         attendee.attendee_linkedin,
//         "LinkedIn",
//         "LinkedIn Profile"
//       );
//       attendeeParagraph.append(linkedinLinkNode);
//     }
//     if (attendee.attendee_twitter) {
//       attendeeParagraph.append($createTextNode(" | "));
//       const twitterLinkNode = createLinkNodeWithText(
//         attendee.attendee_twitter,
//         "Twitter",
//         "Twitter Profile"
//       );
//       attendeeParagraph.append(twitterLinkNode);
//     }
//     attendeesContainer.append(attendeeParagraph);
//   });
//   root.append(attendeesContainer);
//   root.append($createParagraphNode());
//   root.append($createParagraphNode());
// }
