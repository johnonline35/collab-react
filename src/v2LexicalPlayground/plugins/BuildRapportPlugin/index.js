import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $createParagraphNode,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { $buildRapportNode } from "../../nodes/BuildRapportNode";
import { useEffect, useState, useRef } from "react";
import socket from "../../../util/socket";
import { $createHeadingNode } from "@lexical/rich-text";
import { insertBeforeLastChild } from "../../utils/insertBeforeLastChild";

export const INSERT_BUILD_RAPPORT_COMMAND = createCommand();

export default function BuildRapportPlugin({ meetingData }) {
  const [editor] = useLexicalComposerContext();
  const [summary, setSummary] = useState("");
  const hasInsertedHeadingRef = useRef(false); // using ref to avoid re-renders

  const insertHeading = () => {
    editor.update(() => {
      const notesHeading = $createHeadingNode("h3").append(
        $createTextNode("Pre-Meeting Research:").setStyle("font-weight: bold")
      );
      insertBeforeLastChild(notesHeading);
      insertBeforeLastChild($createParagraphNode());
    });
  };

  useEffect(() => {
    if (!meetingData || meetingData.length === 0) {
      console.log("No meeting data");
      return;
    }

    console.log("Use effect called, about to call backend endpoint next.");

    // Insert the heading here, right after the initial checks.
    if (!hasInsertedHeadingRef.current) {
      insertHeading();
      hasInsertedHeadingRef.current = true; // Update the flag to ensure the heading isn't inserted again
    }

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
  }, [meetingData, editor]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!summary) {
      console.log("No summary data");
      return;
    }

    const unregister = editor.registerCommand(
      INSERT_BUILD_RAPPORT_COMMAND,
      () => {
        console.log("command set");
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => {
      if (typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor, summary]);

  return null;
}
