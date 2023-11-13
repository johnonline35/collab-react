import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { useEffect } from "react";
import socket from "../../../utils/socket";
import {
  $getRoot,
  $getSelection,
  $createTextNode,
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  $wrapNodeInElement,
  DecoratorNode,
  $isNodeSelection,
} from "lexical";
import { $buildRapportNode } from "../../nodes/BuildRapportNode";

export const INSERT_BUILD_RAPPORT_COMMAND = createCommand();

export default function BuildRapportPlugin({ meetingData, userId }) {
  const [editor] = useLexicalComposerContext();
  // const userId = session?.user?.id;

  useEffect(() => {
    if (!meetingData || !userId) {
      console.log("No meeting data or userid");
      return;
    }

    // Backend api to summarize meeting data and create prompt and submit it to OpenAi
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
    // New comment
    const unregister = editor.registerCommand(
      INSERT_BUILD_RAPPORT_COMMAND,
      () => {
        // Dispatching the commands
        socket.on("connect", () => {
          socket.emit("registerUser", userId);
        });

        socket.on("responseChunk", (data) => {
          if (data.error) {
            console.error("Received error:", data.error);
            return;
          }
          if (!data || data.content === undefined || data.content === null) {
            console.log("Received undefined, null or no data, ignoring.");
            return;
          }
          if (typeof data.content === "string" && data.content.trim() === "") {
            console.log("Received empty string, ignoring.");
            return;
          }

          editor.update(() => {
            const textNode = $createTextNode(data.content);
            $insertNodes([textNode]);
            if ($isRootOrShadowRoot(textNode.getParentOrThrow())) {
              $wrapNodeInElement(textNode, $createParagraphNode).selectEnd();
            }
          });
        });

        fetchSummary();

        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    // Function to unregister the command and disconnect from the socket in the cleanup
    return () => {
      // Disconnect the WebSocket
      socket.disconnect();

      // Remove event listeners
      socket.off("connect");
      socket.off("responseChunk");

      if (typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor, userId, meetingData]);

  return null;
}
