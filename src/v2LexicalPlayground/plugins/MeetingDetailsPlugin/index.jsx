import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $createMeetingDetailsNode } from "../../nodes/GetMeetingDetailsNode";
import { useEffect } from "react";

export default function MeetingDetailsPlugin({
  meetingData,
  publicEmailDomains,
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!meetingData || meetingData.length === 0) {
      console.log("No meeting data");
      return;
    }

    if (!meetingData.insertedMeetingDetails) {
      editor.update(() => {
        meetingData.forEach((m) => {
          $createMeetingDetailsNode(m, publicEmailDomains);
        });
      });

      //
    }
  }, [editor, meetingData]);

  return null;
}

export const INSERT_MEETING_DETAILS_COMMAND = createCommand();

// export default function MeetingDetailsPlugin({
//   meetingData,
//   publicEmailDomains,
// }) {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     if (!meetingData || meetingData.length === 0) {
//       console.log("No meeting data");
//       return;
//     }

//     const unregister = editor.registerCommand(
//       INSERT_MEETING_DETAILS_COMMAND,
//       () => {
//         editor.update(() => {
//           meetingData.forEach((m) => {
//             $createMeetingDetailsNode(m, publicEmailDomains);
//           });
//         });
//         return true;
//       },
//       COMMAND_PRIORITY_EDITOR
//     );

//     // If the registerCommand method returns a function to unregister the command, you can call it in the cleanup
//     return () => {
//       if (typeof unregister === "function") {
//         unregister();
//       }
//     };
//   }, [editor, meetingData]);

//   return null;
// }
