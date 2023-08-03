import * as React from "react";

import { $getRoot } from "lexical";
import { $createMeetingDetailsNode } from "../nodes/GetMeetingDetailsNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function MeetingToolbarPlugin({ meetingData }) {
  // Accept meetingData as a prop
  const [editor] = useLexicalComposerContext();

  return (
    <div className='toolbar'>
      <button
        onClick={() => {
          editor.update(() => {
            const root = $getRoot();

            meetingData.forEach((m) => {
              const gmdNode = $createMeetingDetailsNode(m);
              root.append(gmdNode);
            });
          });
        }}
        className={"toolbar-item spaced "}
      >
        <span className='text'>Insert Upcoming Meeting</span>
      </button>
    </div>
  );
}
