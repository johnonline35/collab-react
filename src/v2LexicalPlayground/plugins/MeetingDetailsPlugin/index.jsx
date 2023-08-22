import { useParams } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $createMeetingDetailsNode } from "../../nodes/GetMeetingDetailsNode";
import { useEffect, useState } from "react";
import { fetchLexicalMeetingData } from "../../../util/database";

export const INSERT_MEETING_DETAILS_COMMAND = createCommand();

export default function MeetingDetailsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [meetingData, setMeetingData] = useState([]);
  const { workspace_id } = useParams();

  // Fetch the meeting data only when workspace_id changes
  useEffect(() => {
    console.log(
      "useEffect for fetching Lexical Meeting Data is called with workspace_id:",
      workspace_id
    );

    fetchLexicalMeetingData(workspace_id).then((data) => {
      setMeetingData(data);
    });
  }, [workspace_id]); // Only workspace_id in the dependencies

  // Register the command, depending on editor and meetingData
  useEffect(() => {
    if (!meetingData || meetingData.length === 0) {
      console.log("No meeting data");
      return;
    }

    const unregister = editor.registerCommand(
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

    // If the registerCommand method returns a function to unregister the command, you can call it in the cleanup
    return () => {
      if (typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor, meetingData]); // Only editor and meetingData in the dependencies

  return null;
}
