import { useParams } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $buildRapportNode } from "../../nodes/BuildRapportNode";
import { useEffect, useState } from "react";
import { fetchLexicalMeetingData } from "../../../util/database";

export const INSERT_MEETING_DETAILS_COMMAND = createCommand();

export default function BuildRapportPlugin() {
  const [editor] = useLexicalComposerContext();
  const { workspace_id } = useParams();

  // Fetch the meeting data only when workspace_id changes
  useEffect(() => {
    fetchOpenAI();
  }, [workspace_id]); // Only workspace_id in the dependencies

  // Register the command, depending on editor and meetingData
  useEffect(() => {
    if (!openAiResponse || openAiResponse.length === 0) {
      console.log("No openAiResponse data");
      return;
    }

    const unregister = editor.registerCommand(
      INSERT_MEETING_DETAILS_COMMAND,
      () => {
        editor.update(() => {
          meetingData.forEach((m) => {
            $buildRapportNode(m);
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
