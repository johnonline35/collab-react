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

// export function $createMeetingDetailsNode(meetingDetails, publicEmailDomains) {
//   const root = $getRoot();

//   let nodesToAdd = [];

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
//   nodesToAdd.push(meetingDateNode);
//   nodesToAdd.push($createParagraphNode());

//   const attendeesContainer = $createQuoteNode();

//   // Grouping attendees based on the information available
//   const companies = [];
//   const attendeesWithSocialProfiles = [];
//   const attendeesWithNameAndJob = [];
//   const attendeesWithNameOnly = [];
//   const attendeesWithEmailOnly = [];

//   meetingDetails.attendees.forEach((attendee) => {
//     let isCompany =
//       !publicEmailDomains.includes(attendee.attendee_domain) &&
//       (attendee.attendee_domain ||
//         attendee.job_company_linkedin_url ||
//         attendee.job_company_twitter_url);

//     let hasSocialProfile =
//       attendee.attendee_linkedin || attendee.attendee_twitter;
//     let hasNameAndJob = attendee.attendee_name && attendee.attendee_job_title;
//     let hasNameOnly = attendee.attendee_name && !attendee.attendee_job_title;

//     if (isCompany) {
//       companies.push(attendee);
//     } else if (hasSocialProfile) {
//       attendeesWithSocialProfiles.push(attendee);
//     } else if (hasNameAndJob) {
//       attendeesWithNameAndJob.push(attendee);
//     } else if (hasNameOnly) {
//       attendeesWithNameOnly.push(attendee);
//     } else {
//       attendeesWithEmailOnly.push(attendee);
//     }
//   });

//   // Function to create and append attendee paragraph
//   function appendAttendeeParagraph(attendee) {
//     const attendeeParagraph = $createParagraphNode();
//     let attendeeText = attendee.attendee_email || ""; // Default to email if other details are not available

//     if (attendee.attendee_name) {
//       attendeeText = capitalizeFirstLetterOfEachWord(attendee.attendee_name);
//       // Append email for attendees with name only
//       if (
//         !attendee.attendee_job_title &&
//         (!attendee.attendee_linkedin || !attendee.attendee_twitter)
//       ) {
//         attendeeText += ", " + attendee.attendee_email;
//       }
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
//   }

//   // Rendering companies first
//   companies.forEach(appendAttendeeParagraph);

//   // Rendering attendees with social profiles
//   attendeesWithSocialProfiles.forEach(appendAttendeeParagraph);

//   // Rendering attendees with name and job title
//   attendeesWithNameAndJob.forEach(appendAttendeeParagraph);

//   // Rendering attendees with name only (including email)
//   attendeesWithNameOnly.forEach(appendAttendeeParagraph);

//   // Rendering attendees with email only
//   attendeesWithEmailOnly.forEach(appendAttendeeParagraph);

//   nodesToAdd.push(attendeesContainer);
//   nodesToAdd.push($createParagraphNode());

//   if (root.getFirstChild() !== null) {
//     let firstChild = root.getFirstChild();
//     for (let node of nodesToAdd) {
//       firstChild.insertBefore(node);
//     }
//   } else {
//     for (let node of nodesToAdd) {
//       root.append(node);
//     }
//   }
// }

export function $createMeetingDetailsNode(meetingDetails, publicEmailDomains) {
  const root = $getRoot();

  let nodesToAdd = [];

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
    let shouldDisplayCompanyInfo =
      !publicEmailDomains.includes(attendee.attendee_domain) &&
      (attendee.attendee_domain ||
        attendee.job_company_linkedin_url ||
        attendee.job_company_twitter_url);

    if (shouldDisplayCompanyInfo) {
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

      for (let i = 0; i < companyLinks.length; i++) {
        companyParagraph.append(companyLinks[i]);
        if (i !== companyLinks.length - 1) {
          companyParagraph.append($createTextNode(" | "));
        }
      }

      attendeesContainer.append(companyParagraph);
    }

    const attendeeParagraph = $createParagraphNode();
    let attendeeText = attendee.attendee_email || ""; // Default to email if other details are not available

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

// const socketStub = (() => {
//   const callbacks = {};

//   const on = (event, callback) => {
//     callbacks[event] = callback;
//   };

//   const emit = (event, data) => {
//     // noop
//   };

//   const trigger = async () => {
//     let count = 0;
//     while (count < 50) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       callbacks["responseChunk"]({
//         content: "Hello from BUILD_RAPPORT 2",
//       });
//       count++;
//     }
//   };

//   return { on, emit, trigger };
// })();
