import { useState, useEffect } from "react";
import { fetchLexicalMeetingData } from "../../utils/database";
import { supabase } from "../../supabase/clientapp";

export function useMeetingData(session, workspace_id, collab_user_note_id) {
  const [meetingData, setMeetingData] = useState(null);

  useEffect(() => {
    if (!session) return;
    const userId = session?.user?.id;

    async function fetchData() {
      try {
        // Fetch the note data asynchronously
        let { data: noteData, error } = await supabase
          .from("collab_users_notes")
          .select("*")
          .eq("collab_user_note_id", collab_user_note_id)
          .single();

        if (error) {
          throw error;
        }

        if (noteData) {
          const nextMeetingId = noteData.meeting_id;

          const meetingInfo = await fetchLexicalMeetingData(
            userId,
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
  }, [session, workspace_id, collab_user_note_id]);

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
