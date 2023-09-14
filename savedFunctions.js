// function getImageNodeInSelection(): ImageNode | null {
//   const selection = $getSelection();
//   if (!$isNodeSelection(selection)) {
//     return null;
//   }
//   const nodes = selection.getNodes();
//   const node = nodes[0];
//   return $isImageNode(node) ? node : null;
// }

// KERRY"S CODE FOR SIMULATING DATA.CONTENT API RESPONSE:

// const socketStub = (() => {
//   const callbacks = {};

//   const on = (event, callback) => {
//     callbacks[event] = callback;
//   };

//   const emit = (event, data) => {
//     // noop
//   };
// KERRYS SIMULATED RESPONSE CHUNK CODE:
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

// async function fetchSummary() {
//   await socketStub.trigger();
//   return;
//   try {
//     console.log("fetch called");
//     const response = await fetch(
//       "https://collab-express-production.up.railway.app/summarize-career-education",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({}),
//       }
//     );
//     if (!response.ok) {
//       throw new Error(`Server responded with a ${response.status} status.`);
//     }
//     const data = await response.json();
//     console.log("streaming data:", data);
//   } catch (error) {
//     console.error("There was an error fetching the summary!", error);
//   }
// }

// NODE CODE FOR INSERTING LINK FOR ROUTER AND GOOGLE API

// router.post("/insert-link-for-new-meeting", async (req, res) => {
//   console.log("/insert-link-for-new-meeting req.body:", req.body);
//   // Destructure information from the req.body
//   const { id, collab_user_id, workspace_id } = req.body.record;
//   console.log(
//     "meetingId:",
//     id,
//     "collab_user_id:",
//     collab_user_id,
//     "workspace_id :",
//     workspace_id
//   );

//   try {
//     await googleCalendarApiClient.enableCalendarLinkForNewMeeting(
//       id,
//       collab_user_id,
//       workspace_id
//     );

//     res.status(200).send({ success: "Link inserted for new meeting." });
//   } catch (error) {
//     console.error("Error inserting link for new meeting:", error);
//     res.status(500).send({ error: "Failed to insert link for new meeting." });
//   }
// });

// const updateMeetingDescription = async (
//   workspace_id,
//   collab_user_id,
//   workspace_attendee_enable_calendar_link
// ) => {
//   const workspaceLink = collabWorkspaceLinkToAppend + workspace_id;

//   try {
//     // Load the Google Calendar client
//     const calendar = await loadClient(collab_user_id);

//     // Fetch meeting data from the 'meetings' table
//     const { data: meetingData } = await supabase
//       .from("meetings")
//       .select("*")
//       .eq("workspace_id", workspace_id);

//     // Loop through each meeting
//     for (let meeting of meetingData) {
//       // Fetch the Google Calendar event
//       const event = await calendar.events.get({
//         calendarId: "primary",
//         eventId: meeting.id,
//       });

//       // Check if link needs to be added or removed
//       if (workspace_attendee_enable_calendar_link) {
//         // Create a hyperlink and prepend it to the existing description
//         const hyperlink = `<a href="${workspaceLink}">Collab Space</a>`;
//         const newDescription =
//           hyperlink + "<br/><br/>" + (event.data.description || "");

//         // Update the Google Calendar event
//         event.data.description = newDescription;
//       } else {
//         // Remove the hyperlink from the description
//         const hyperlinkRegEx = new RegExp(
//           `<a href="${workspaceLink.replace(
//             /[.*+\-?^${}()|[\]\\]/g,
//             "\\$&"
//           )}">Collab Space</a>`,
//           "g"
//         );
//         event.data.description = event.data.description.replace(
//           hyperlinkRegEx,
//           ""
//         );

//         // Remove any remaining line breaks after a hyperlink
//         const lineBreaksRegEx = new RegExp("<br/><br/>", "g");
//         event.data.description = event.data.description.replace(
//           lineBreaksRegEx,
//           ""
//         );
//       }

//       // Update the Google Calendar event
//       const response = await calendar.events.update({
//         calendarId: "primary",
//         eventId: meeting.id,
//         resource: event.data,
//       });
//     }
//   } catch (error) {
//     console.error("The API returned an error: ", error);
//   }
// };

// const enableCalendarLinkForNewMeeting = async (
//   id,
//   collab_user_id,
//   workspace_id
// ) => {
//   console.log(
//     "enableCalendarLinkForNewMeeting Called Successfully",
//     "id:",
//     id,
//     "collab_user_id:",
//     collab_user_id,
//     "workspace_id:",
//     workspace_id
//   );
//   // Check if the workspace allows calendar links.
//   const { data: workspace, error } = await supabase
//     .from("workspaces")
//     .select("workspace_attendee_enable_calendar_link")
//     .eq("workspace_id", workspace_id)
//     .single();

//   if (error) {
//     console.error("Error querying workspace:", error);
//     return res.status(500).send({ error: "Error querying the workspace." });
//   }

//   if (!workspace) {
//     return res.status(400).send({ error: "No workspace found" });
//   }

//   if (workspace.workspace_attendee_enable_calendar_link !== true) {
//     return res
//       .status(400)
//       .send({ error: "Enable Calendar Links set to false by user" });
//   }

//   const workspaceLink = collabWorkspaceLinkToAppend + workspace_id;

//   try {
//     // Load the Google Calendar client
//     const calendar = await loadClient(collab_user_id); // Using userId as per your extraction from req.body

//     const event = await calendar.events.get({
//       calendarId: "primary",
//       eventId: id,
//     });

//     // Create a hyperlink and prepend it to the existing description
//     const hyperlink = `<a href="${workspaceLink}">Collab Space</a>`;
//     const newDescription =
//       hyperlink + "<br/><br/>" + (event.data.description || "");

//     // Update the Google Calendar event
//     event.data.description = newDescription;

//     const response = await calendar.events.update({
//       calendarId: "primary",
//       eventId: id,
//       resource: event.data,
//     });
//   } catch (error) {
//     console.error("The API returned an error: ", error);
//     res.status(500).send({ error: "Failed to update the calendar event." });
//   }
// };
