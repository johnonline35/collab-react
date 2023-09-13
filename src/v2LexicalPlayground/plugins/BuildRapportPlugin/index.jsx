import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { useEffect } from "react";
import { useSession } from "../../../hooks/useSession";
import socket from "../../../util/socket";
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

// const socketStub = (() => {
//   const callbacks = {};

//   const on = (event, callback) => {
//     callbacks[event] = callback;
//   };

//   const emit = (event, data) => {
//     // noop
//   };

//   const trigger = async () => {
//     let count = 0;
//     while (count < 50) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       callbacks["responseChunk"]({
//         content: "Hello from BUILD_RAPPORT 2",
//       });
//       count++;
//     }
//   };

//   return { on, emit, trigger };
// })();

// async function fetchSummary() {
//   await socketStub.trigger();
//   return;
//   try {
//     console.log("fetch called");
//     const response = await fetch(
//       "https://collab-express-production.up.railway.app/summarize-career-education",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({}),
//       }
//     );
//     if (!response.ok) {
//       throw new Error(`Server responded with a ${response.status} status.`);
//     }
//     const data = await response.json();
//     console.log("streaming data:", data);
//   } catch (error) {
//     console.error("There was an error fetching the summary!", error);
//   }
// }

export default function BuildRapportPlugin({ meetingData }) {
  const [editor] = useLexicalComposerContext();
  const session = useSession();

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

  useEffect(() => {
    const unregister = editor.registerCommand(
      INSERT_BUILD_RAPPORT_COMMAND,
      () => {
        // Dispatching the commands
        socket.on("connect", () => {
          socket.emit("registerUser", session.user.id);
        });

        socket.on("responseChunk", (data) => {
          if (data.content === undefined || data.content.trim() === "") {
            console.log("Received undefined or empty content, ignoring.");
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

    // If the registerCommand method returns a function to unregister the command, you can call it in the cleanup
    return () => {
      if (typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor]);

  return null;
}
