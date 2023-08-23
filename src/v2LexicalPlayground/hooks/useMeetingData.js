import { useState, useEffect } from "react";
import { fetchLexicalMeetingData } from "../../util/database";

export function useMeetingData(workspace_id) {
  const [meetingData, setMeetingData] = useState(null);

  useEffect(() => {
    fetchLexicalMeetingData(workspace_id).then((data) => {
      setMeetingData(data);
    });
  }, [workspace_id]);

  return meetingData;
}
