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
