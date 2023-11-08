import { useState, useEffect } from "react";
import { fetchLexicalMeetingData } from "../../utils/database";
import { supabase } from "../../supabase/clientapp";

export function useMeetingData(workspace_id, collab_user_note_id) {
  const [meetingData, setMeetingData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the note data asynchronously
        let { data: noteData, error } = await supabase
          .from("collab_users_notes")
          .select("*")
          .eq("collab_user_note_id", collab_user_note_id)
          .single(); // Assuming you are fetching a single item with a unique ID

        if (error) {
          throw error;
        }

        if (noteData) {
          const nextMeetingId = noteData.meeting_id;

          // Fetch additional data based on the meeting ID
          // console.log({ collab_users_note_id: collab_user_note_id });
          // console.log({ nextMeetingId: nextMeetingId });
          // console.log({ workspace_id: workspace_id });
          const meetingInfo = await fetchLexicalMeetingData(
            workspace_id,
            nextMeetingId
          );

          setMeetingData(meetingInfo);
        }
      } catch (err) {
        // Handle errors, for example by setting some error state or logging
        console.error("Error fetching meeting data:", err);
      }
    }

    fetchData();
  }, [workspace_id, collab_user_note_id]);

  return meetingData;
}

// export function useMeetingData(workspace_id, collab_users_note_id) {
//   const [meetingData, setMeetingData] = useState(null);

//   useEffect(() => {
//     fetchLexicalMeetingData(workspace_id, collab_users_note_id).then((data) => {
//       setMeetingData(data);
//     });
//   }, [workspace_id, collab_users_note_id]);

//   return meetingData;
// }
