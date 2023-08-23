import { useState, useEffect, useMemo } from "react";
import { fetchLexicalMeetingData } from "../../util/database";

export function useMeetingData(workspace_id) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLexicalMeetingData(workspace_id).then((newData) => {
      setData(newData);
    });
  }, [workspace_id]);

  const meetingData = useMemo(() => data, [data]);

  return meetingData;
}
