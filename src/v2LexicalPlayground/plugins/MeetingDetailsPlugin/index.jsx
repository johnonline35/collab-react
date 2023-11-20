import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $createMeetingDetailsNode } from "../../nodes/GetMeetingDetailsNode";
import { useEffect } from "react";
import { supabase } from "../../../supabase/clientapp";

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

    meetingData.forEach(async (m) => {
      // Check if insertedMeetingDetails is null or false for each meeting item
      if (!m.insertedMeetingDetails) {
        editor.update(() => {
          $createMeetingDetailsNode(m, publicEmailDomains);
        });

        // Update the Supabase table
        try {
          const { error } = await supabase
            .from("collab_users_notes")
            .update({ inserted_meeting_details: true })
            .eq("collab_user_note_id", m.noteId);

          if (error) {
            throw error;
          }

          console.log(`Updated insertedMeetingDetails for noteId: ${m.noteId}`);
        } catch (err) {
          console.error(`Error updating Supabase for noteId: ${m.noteId}`, err);
        }
      }
    });
  }, [editor, meetingData, supabase]);

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
