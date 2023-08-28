import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $buildRapportNode } from "../../nodes/BuildRapportNode";
import { useEffect, useState } from "react";
import socket from "../../../util/socket";

export const INSERT_BUILD_RAPPORT_COMMAND = createCommand();

export default function BuildRapportPlugin({ meetingData }) {
  const [editor] = useLexicalComposerContext();
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (!meetingData || meetingData.length === 0) {
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
        console.log("streaming data:", data);
        // setSummary(data.content);
      } catch (error) {
        console.error("There was an error fetching the summary!", error);
      }
    }

    // Establish a connection and listen for events from the backend
    socket.on("connect", () => {
      console.log("Connected to backend");
    });

    socket.on("responseChunk", (data) => {
      console.log("chunk data:", data);

      // Append the new chunk of content to the editor
      editor.update(() => {
        $buildRapportNode(data.content);
      });
    });

    fetchSummary(); // fetch initial data

    // Clean up listeners and disconnect on component unmount or if meetingData changes
    return () => {
      socket.off("responseChunk");
      socket.disconnect();
    };
  }, [meetingData]);

  useEffect(() => {
    if (!summary) {
      console.log("No summary data");
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
