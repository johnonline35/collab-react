import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $buildRapportNode } from "../../nodes/BuildRapportNode";
import { useEffect, useState } from "react";

export const INSERT_BUILD_RAPPORT_COMMAND = createCommand();

export default function BuildRapportPlugin({ meetingData }) {
  const [editor] = useLexicalComposerContext();
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (!meetingData) {
      console.log("No meeting data");
      return;
    }

    console.log("Use effect called, about to call backend endpoint next.");
    async function fetchSummary() {
      try {
        console.log("fetch called");
        const response = await fetch(
          "https://collab-express-production.up.railway.app/summarize-career-education",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(meetingData),
          }
        );

        if (!response.ok) {
          throw new Error(`Server responded with a ${response.status} status.`);
        }

        const data = await response.json();
        console.log("data:", data);
        setSummary(data.content);
      } catch (error) {
        console.error("There was an error fetching the summary!", error);
      }
    }

    fetchSummary();
  }, [meetingData]);

  useEffect(() => {
    if (!summary) {
      return;
    }

    const unregister = editor.registerCommand(
      INSERT_BUILD_RAPPORT_COMMAND,
      () => {
        editor.update(() => {
          $buildRapportNode(summary); // This is an example, adjust as needed
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => {
      if (typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor, summary]); // Added summary to dependencies

  return null;
}
