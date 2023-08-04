import { useParams } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $createMeetingDetailsNode } from "../nodes/GetMeetingDetailsNode";
import { $getRoot } from "lexical";
import { useEffect, useState } from "react";
import { fetchLexicalMeetingData } from "../../util/database";

export const INSERT_MEETING_DETAILS_COMMAND = createCommand();

export default function MeetingDetailsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [meetingData, setMeetingData] = useState([]);
  const { workspace_id } = useParams();

  useEffect(() => {
    fetchLexicalMeetingData(workspace_id).then((data) => {
      setMeetingData(data);
    });

    return editor.registerCommand(
      INSERT_MEETING_DETAILS_COMMAND,
      () => {
        editor.update(() => {
          const root = $getRoot();
          meetingData.forEach((m) => {
            const gmdNode = $createMeetingDetailsNode(m);
            root.append(gmdNode);
          });
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor, meetingData, workspace_id]);

  return null;
}
