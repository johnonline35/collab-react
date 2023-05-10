// export const getGoogleCal = () => {
//   // 1. Authenticate the user and obtain an access token to make requests to the Google Calendar API.
//   // Work on this to get the user authed - there is a google package oauth2

//   // 2. Calculate the start and end times for the 6-month period that you want to retrieve events for.
//   const now = new Date();
//   const sixMonthsAgo = new Date();
//   sixMonthsAgo.setMonth(now.getMonth() - 6);

//   // 3. Use the Calendar API's events.list() method to retrieve a list of all events within the specified time period.
//   const request = gapi.client.calendar.events.list({
//     calendarId: "primary",
//     timeMin: sixMonthsAgo.toISOString(),
//     timeMax: now.toISOString(),
//     showDeleted: false,
//     singleEvents: true,
//     orderBy: "startTime",
//   });

//   request.execute(function (response) {
//     const meetings = [];

//     // 4. Iterate over the list of events and check if each event has at least one attendee.
//     for (let i = 0; i < response.items.length; i++) {
//       const event = response.items[i];
//       if (event.attendees && event.attendees.length > 0) {
//         // 5. If an event has at least one attendee, add it to an array of meetings.
//         meetings.push(event);
//       }
//     }

//     // 6. Check if the meetings in that array have the same attendee in more than one meeting and nest them in a new array.
//     const nestedMeetings = [];
//     const attendeeMap = {};

//     for (let i = 0; i < meetings.length; i++) {
//       const meeting = meetings[i];

//       if (meeting.attendees && meeting.attendees.length > 0) {
//         const attendee = meeting.attendees[0].email;

//         if (attendeeMap[attendee]) {
//           attendeeMap[attendee].push(meeting);
//         } else {
//           attendeeMap[attendee] = [meeting];
//         }
//       }
//     }

//     // 7. Order the nested meetings by the earliest date of the first meeting, and then the following meetings with all the attendees also listed.
//     const sortedAttendeeMap = Object.values(attendeeMap).sort((a, b) => {
//       const aStart = new Date(a[0].start.dateTime);
//       const bStart = new Date(b[0].start.dateTime);
//       return aStart - bStart;
//     });

//     console.log("Nested meetings:", sortedAttendeeMap);
//   });
// };

// // 1. Authenticate the user and obtain an access token to make requests to the Google Calendar API.
// // (Assuming you have already obtained the access token and stored it in the variable accessToken.)

// // 2. Retrieve the ID of the specific calendar event that you want to update.
// // const eventId = "INSERT_EVENT_ID_HERE";

// // // 3. Use the Calendar API's events.get() method to retrieve the details of the calendar event.
// // const requestCalendarDescription = gapi.client.calendar.events.get({
// //   calendarId: "primary",
// //   eventId: eventId,
// // });

// // request.execute(function (event) {
// //   // 4. Update the event's description property with the desired text.
// //   event.description = "this is the description";

// //   // 5. Use the Calendar API's events.update() method to update the calendar event with the new description.
// //   const updateRequest = gapi.client.calendar.events.update({
// //     calendarId: "primary",
// //     eventId: eventId,
// //     resource: event,
// //   });

// //   updateRequest.execute(function (updatedEvent) {
// //     console.log("Event updated: " + updatedEvent.htmlLink);
// //   });
// // });
