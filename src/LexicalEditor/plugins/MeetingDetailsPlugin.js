import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $createMeetingDetailsNode } from "../nodes/GetMeetingDetailsNode";
import { $getRoot } from "lexical";
import { useEffect, useState } from "react";

export const INSERT_MEETING_DETAILS_COMMAND = createCommand();

export default function MeetingDetailsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [meetingData, setMeetingData] = useState([]);

  useEffect(() => {
    setMeetingData([
      {
        companyName: "THIS Meeting",
        attendees: ["Kerry Ritter", "Chris Alto"],
      },
      {
        companyName: "Zipper Meeting",
        attendees: ["Kerry Ritter", "Chris Alto"],
      },
      {
        companyName: "Zipper Meeting",
        attendees: ["Kerry Ritter", "Chris Alto"],
      },
      {
        companyName: "Zipper Meeting",
        attendees: ["Kerry Ritter", "Chris Alto"],
      },
    ]);

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
      COMMAND_PRIORITY_EDITOR // Using the predefined constant
    );
  }, [editor, meetingData]);

  return null;
}
