import { useState, useEffect } from "react";
import { fetchLexicalMeetingData } from "../../utils/database";
import { supabase } from "../../supabase/clientapp";

export function useMeetingData(workspace_id, collab_users_note_id) {
  const [meetingData, setMeetingData] = useState(null);

  useEffect(() => {
    const note = supabase
      .from("collab_users_notes")
      .select("*")
      .eq("collab_users_note_id", collab_users_note_id);

    const nextMeeting = note.data[0];
    const nextMeetingId = nextMeeting.meeting_id;

    console.log({ nextMeetingId: nextMeetingId });

    fetchLexicalMeetingData(workspace_id, collab_users_note_id).then((data) => {
      setMeetingData(data);
    });
  }, [workspace_id, collab_users_note_id]);

  return meetingData;
}
