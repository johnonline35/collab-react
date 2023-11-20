import { useState, useEffect } from "react";
import { fetchLexicalMeetingData } from "../../utils/database";
import { supabase } from "../../supabase/clientapp";

export function useMeetingData(userId, workspace_id, collab_user_note_id) {
  const [meetingData, setMeetingData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let { data: noteData, error } = await supabase
          .from("collab_users_notes")
          .select("*")
          .eq("collab_user_note_id", collab_user_note_id)
          .single();

        if (error) {
          throw error;
        }

        if (noteData) {
          const insertedMeetingDetails = noteData.inserted_meeting_details;
          const noteId = noteData.collab_user_note_id;
          const nextMeetingId = noteData.meeting_id;

          const meetingInfo = await fetchLexicalMeetingData(
            userId,
            workspace_id,
            nextMeetingId
          );

          if (meetingInfo) {
            meetingInfo.insertedMeetingDetails = insertedMeetingDetails;
            meetingInfo.noteId = noteId;
            setMeetingData(meetingInfo);
          }
        }
      } catch (err) {
        console.error("Error fetching meeting data:", err);
      }
    }

    fetchData();
  }, [userId, workspace_id, collab_user_note_id]);

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
