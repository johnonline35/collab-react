import { createCommand } from "lexical";
import { $createMeetingDetailsNode } from "../nodes/GetMeetingDetailsNode";
import { $getRoot } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
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
    return editor.registerCommand(INSERT_MEETING_DETAILS_COMMAND, () => {
      editor.update(() => {
        const root = $getRoot();
        meetingData.forEach((m) => {
          const gmdNode = $createMeetingDetailsNode(m);
          root.append(gmdNode);
        });
      });
      return true;
    });
  }, [editor, meetingData]);

  return null;
}
