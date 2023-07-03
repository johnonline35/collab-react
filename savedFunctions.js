// with collab_user: '{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"{workspaces.workspace_name} Meeting Notes","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"heading","version":1,"tag":"h1"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"{meetings.start_datetime}","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Attendees:","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"collab_users.collab_user_name, collab_users.collab_user_job_title","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"attendees.attendee_name, attendees.attendee.job_title, attendees.attendee_linkedin, attendees.attendee_twitter","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Notes:","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

// Real time function that waits for the background jobs then calls getCompanyTileInfo(userId)

// const receivedUpdate = useRef(false);
// const isSubscribed = useRef(false);

// useEffect(() => {
//   if (!userId) {
//     console.log("userId is not set, returning early");
//     return; // Don't set up subscription if userId is not set yet
//   }

//   console.log("Setting up subscription for userId:", userId);

//   // Set up a Realtime subscription
//   const subscription = supabase
//     .channel("job_queue:collab_user_id=eq." + userId)
//     .on(
//       "postgres_changes",
//       { event: "UPDATE", schema: "public" },
//       (payload) => {
//         console.log("Received UPDATE event:", payload);

//         // Check if the job status is "job_complete"
//         if (payload.new.job_complete === true) {
//           console.log("Job completed, jobId:", payload.new.job_id);

//           // Mark that an update was received
//           receivedUpdate.current = true;

//           getCompanyTileInfo(userId);

//           // Unsubscribe from the subscription as it's no longer needed
//           console.log("Unsubscribing from subscription for userId:", userId);
//           subscription.unsubscribe();
//           isSubscribed.current = false;
//         }
//       }
//     )
//     .subscribe();

//   console.log("Subscription LIVE:", subscription);
//   isSubscribed.current = true;

//   // Check shortly after subscribing if an update was received
//   setTimeout(() => {
//     if (isSubscribed.current && !receivedUpdate.current) {
//       console.log("No update received, calling getCompanyTileInfo.");
//       getCompanyTileInfo(userId);

//       // Unsubscribe as it's no longer needed
//       console.log("Unsubscribing from subscription for userId:", userId);
//       subscription.unsubscribe();
//       isSubscribed.current = false;
//     }
//   }, 5000); // Check after 5 seconds for example, can be adjusted
// }, [userId]); // Rerun this hook whenever userId changes
