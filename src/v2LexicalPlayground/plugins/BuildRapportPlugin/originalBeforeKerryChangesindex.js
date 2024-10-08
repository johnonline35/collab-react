import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $insertNodes,
  $getRoot,
  $isRootOrShadowRoot,
  $getSelection,
  $getNodeByKey,
} from "lexical";
import { useEffect, useState, useRef } from "react";
import socket from "../../../utils/socket";
import { useSession } from "../../../hooks/useSession";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";

import { $createTextNode, $createParagraphNode } from "lexical";
import { $buildRapportNode } from "../../nodes/BuildRapportNode";

import { $createHeadingNode } from "@lexical/rich-text";
import { insertBeforeLastChild } from "../../utils/insertBeforeLastChild";

export const CONNECT_SOCKET_COMMAND = createCommand();
export const APPEND_CHUNK_TO_EDITOR_COMMAND = createCommand();
export const INSERT_BUILD_RAPPORT_COMMAND = createCommand();
export const INSERT_HEADING_COMMAND = createCommand();

export default function BuildRapportPlugin({ meetingData, triggerEffect }) {
  const session = useSession();
  const [editor] = useLexicalComposerContext();
  const [summary, setSummary] = useState("");
  const hasInsertedHeadingRef = useRef(false);
  const hasEffectRun = useRef(false);

  const insertHeading = () => {
    console.log("insertHeading called");
    editor.update(() => {
      const root = $getRoot();
      const paragraph = $createParagraphNode();
      console.log("editor.update(() =>  called");
      const notesHeading = $createHeadingNode("h3").append(
        $createTextNode("Pre-Meeting Research:").setStyle("font-weight: bold")
      );
      root.append(notesHeading);
      root.append(paragraph);
    });
  };

  useEffect(() => {
    console.log("useEffect fired:", triggerEffect);
    if (!hasEffectRun.current && !triggerEffect) {
      console.log("Effect early exit due to run check and trigger check.");
      return;
    }
    if (!session) {
      console.error("User is not authenticated!");
      return;
    }
    console.log("session user object:", session);
    if (!meetingData || meetingData.length === 0) {
      console.log("Effect early exit due to no meeting data.");
      return;
    }
    console.log("All checks passed and useEffect succesfully called.");
    const unregisterInsertHeading = editor.registerCommand(
      INSERT_HEADING_COMMAND,
      () => {
        insertHeading();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    if (!hasInsertedHeadingRef.current) {
      editor.dispatchCommand(INSERT_HEADING_COMMAND);
      hasInsertedHeadingRef.current = true;
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

    // Registering the commands
    const unregisterConnect = editor.registerCommand(
      CONNECT_SOCKET_COMMAND,
      () => {
        console.log("Connected to backend");
        socket.emit("registerUser", session.user.id);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    // const unregisterAppendChunk = editor.registerCommand(
    //   APPEND_CHUNK_TO_EDITOR_COMMAND,
    //   (data) => {
    //     console.log("chunk data:", data);
    //     editor.update(() => {
    //       const WINDOW_KEY = `selection_${new Date().getTime()}`;

    //       const currentSelection = $getSelection();
    //       const focusKey =
    //         currentSelection && currentSelection.focus
    //           ? currentSelection.focus.key
    //           : $getRoot().getKey();

    //       window[WINDOW_KEY] = focusKey;

    //       $getRoot()
    //         .getAllTextNodes()
    //         .forEach((n) => {
    //           if (n.getKey() === window[WINDOW_KEY]) {
    //             n.getParent().append(data.content);
    //           }
    //         });
    //     });

    //     return true;
    //   },
    //   COMMAND_PRIORITY_EDITOR
    // );

    // const root = $getRoot();
    // console.log("root:", root);
    // const rootKey = root.__last;
    // console.log("rootkey:", rootKey);

    const unregisterAppendChunk = editor.registerCommand(
      // const WINDOW_KEY = `selection_${new Date().getTime()}`;

      // window[WINDOW_KEY] = $getSelection()?.focus
      //   ? $getSelection().focus.key
      //   : $getRoot().__last;

      // window[WINDOW_KEY] = $getSelection().focus.key;
      APPEND_CHUNK_TO_EDITOR_COMMAND,
      (data) => {
        console.log("chunk data:", data);
        editor.update(() => {
          const selection = $getSelection();
          selection?.insertNodes([$buildRapportNode]);

          // const textNodes = $getRoot().getAllTextNodes();
          // console.log("textNodes", textNodes);
          // if (textNodes) {
          //   textNodes.forEach((n) => {
          //     console.log("textNode Found:", n);
          //     if (n.getKey() === selectionFocusKey) {
          //       console.log(
          //         "n.getKey() === selectionFocusKey:",
          //         n.getKey(),
          //         data.content
          //       );
          //       n.getParent().append(data.content);
          //     } else {
          //       if (data.content !== "") {
          //         const lastChild = root.getLastChild();

          //         // If the last child is a paragraph, append text to it
          //         if (lastChild && lastChild.__type === "paragraph") {
          //           lastChild.append($createTextNode(data.content));
          //         } else {
          //           // If the last child isn't a paragraph, create a new one and append the text
          //           const paragraph = $createParagraphNode().append(
          //             $createTextNode(data.content)
          //           );
          //           insertBeforeLastChild(paragraph);
          //           insertBeforeLastChild(paragraph);
          //         }
          //       }
          //     }
          //   });
          // }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    // Dispatching the commands
    socket.on("connect", () => {
      editor.dispatchCommand(CONNECT_SOCKET_COMMAND);
    });

    socket.on("responseChunk", (data) => {
      if (data.content === undefined) {
        console.log("Received undefined content, ignoring.");
        return;
      }
      if (data.content.trim() === "") {
        console.log("Received empty content, ignoring.");
        return;
      }
      editor.dispatchCommand(APPEND_CHUNK_TO_EDITOR_COMMAND, data);
    });

    fetchSummary();

    hasEffectRun.current = true;
    hasInsertedHeadingRef.current = false;

    return () => {
      unregisterConnect();
      unregisterAppendChunk();
      unregisterInsertHeading();
      socket.off("responseChunk");
      socket.disconnect();
    };
  }, [meetingData, editor, triggerEffect, session]);

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

// export default function BuildRapportPlugin({ meetingData, triggerEffect }) {
//   const session = useSession();
//   const [editor] = useLexicalComposerContext();
//   const [summary, setSummary] = useState("");
//   const hasInsertedHeadingRef = useRef(false);
//   const hasEffectRun = useRef(false);

//   const insertHeading = () => {
//     console.log("insertHeading called");
//     editor.update(() => {
//       const root = $getRoot();
//       const paragraph = $createParagraphNode();
//       console.log("editor.update(() =>  called");
//       const notesHeading = $createHeadingNode("h3").append(
//         $createTextNode("Pre-Meeting Research:").setStyle("font-weight: bold")
//       );
//       root.append(notesHeading);
//       root.append(paragraph);
//     });
//   };

//   useEffect(() => {
//     console.log("useEffect fired:", triggerEffect);
//     if (!hasEffectRun.current && !triggerEffect) {
//       console.log("Effect early exit due to run check and trigger check.");
//       return;
//     }
//     if (!session) {
//       console.error("User is not authenticated!");
//       return;
//     }
//     console.log("session user object:", session);
//     if (!meetingData || meetingData.length === 0) {
//       console.log("Effect early exit due to no meeting data.");
//       return;
//     }
//     console.log("All checks passed and useEffect succesfully called.");
//     const unregisterInsertHeading = editor.registerCommand(
//       INSERT_HEADING_COMMAND,
//       () => {
//         insertHeading();
//         return true;
//       },
//       COMMAND_PRIORITY_EDITOR
//     );

//     if (!hasInsertedHeadingRef.current) {
//       editor.dispatchCommand(INSERT_HEADING_COMMAND);
//       hasInsertedHeadingRef.current = true;
//     }

//     async function fetchSummary() {
//       try {
//         console.log("fetch called");
//         const response = await fetch(
//           "https://collab-express-production.up.railway.app/summarize-career-education",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(meetingData),
//           }
//         );
//         if (!response.ok) {
//           throw new Error(`Server responded with a ${response.status} status.`);
//         }
//         const data = await response.json();
//         console.log("streaming data:", data);
//       } catch (error) {
//         console.error("There was an error fetching the summary!", error);
//       }
//     }

//     // Registering the commands
//     const unregisterConnect = editor.registerCommand(
//       CONNECT_SOCKET_COMMAND,
//       () => {
//         console.log("Connected to backend");
//         socket.emit("registerUser", session.user.id);
//         return true;
//       },
//       COMMAND_PRIORITY_EDITOR
//     );

//     const unregisterAppendChunk = editor.registerCommand(
//       APPEND_CHUNK_TO_EDITOR_COMMAND,
//       (data) => {
//         console.log("chunk data:", data);
//         editor.update(() => {
//           const buildRapportNode = $buildRapportNode(data.content);
//           const selection = $getSelection();
//           const selectionKey = selection.anchor.key;
//           selection?.insertNodes([buildRapportNode]);
//           // if (data.content.trim()) {
//           //   // only proceed if content is not empty
//           //   const buildRapportNode = $buildRapportNode(data.content);
//           //   $insertNodes([buildRapportNode]);
//           //   if ($isRootOrShadowRoot(buildRapportNode.getParentOrThrow())) {
//           //     $wrapNodeInElement(
//           //       buildRapportNode,
//           //       $createParagraphNode
//           //     ).selectEnd();
//           //   }
//           // }
//         });

//         return true;
//       },
//       COMMAND_PRIORITY_EDITOR
//     );

//     // Dispatching the commands
//     socket.on("connect", () => {
//       editor.dispatchCommand(CONNECT_SOCKET_COMMAND);
//     });

//     socket.on("responseChunk", (data) => {
//       if (data.content.trim() === "") {
//         console.log("Received empty content, ignoring.");
//         return;
//       }
//       editor.dispatchCommand(APPEND_CHUNK_TO_EDITOR_COMMAND, data);
//     });

//     fetchSummary();

//     hasEffectRun.current = true;
//     hasInsertedHeadingRef.current = false;

//     return () => {
//       unregisterConnect();
//       unregisterAppendChunk();
//       unregisterInsertHeading();
//       socket.off("responseChunk");
//       socket.disconnect();
//     };
//   }, [meetingData, editor, triggerEffect, session]);

//   useEffect(() => {
//     if (!summary) {
//       console.log("No summary data");
//       return;
//     }
//     const unregister = editor.registerCommand(
//       INSERT_BUILD_RAPPORT_COMMAND,
//       () => {
//         console.log("command set");
//         return true;
//       },
//       COMMAND_PRIORITY_EDITOR
//     );
//     return () => {
//       if (typeof unregister === "function") {
//         unregister();
//       }
//     };
//   }, [editor, summary]);

//   return null;
// }

// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import {
//   $createTextNode,
//   $createParagraphNode,
//   createCommand,
//   COMMAND_PRIORITY_EDITOR,
// } from "lexical";
// import { $buildRapportNode } from "../../nodes/BuildRapportNode";
// import { useEffect, useState, useRef } from "react";
// import socket from "../../../util/socket";
// import { $createHeadingNode } from "@lexical/rich-text";
// import { insertBeforeLastChild } from "../../utils/insertBeforeLastChild";
// import { useSession } from "../../../hooks/useSession";

// export const INSERT_BUILD_RAPPORT_COMMAND = createCommand();

// export default function BuildRapportPlugin({ meetingData, triggerEffect }) {
//   const session = useSession();
//   const [editor] = useLexicalComposerContext();
//   const [summary, setSummary] = useState("");
//   const hasInsertedHeadingRef = useRef(false);
//   const hasEffectRun = useRef(false);

//   const insertHeading = () => {
//     console.log("insertHeading called");

//     editor.update(() => {
//       console.log("editor.update(() =>  called");
//       const notesHeading = $createHeadingNode("h3").append(
//         $createTextNode("Pre-Meeting Research:").setStyle("font-weight: bold")
//       );
//       insertBeforeLastChild(notesHeading);
//       insertBeforeLastChild($createParagraphNode());
//     });
//   };

//   useEffect(() => {
//     console.log("useEffect fired:", triggerEffect);

//     if (!hasEffectRun.current && !triggerEffect) {
//       console.log("Effect early exit due to run check and trigger check.");
//       return;
//     }

//     if (!session) {
//       console.error("User is not authenticated!");
//       return;
//     }

//     console.log("session user object:", session);

//     if (!meetingData || meetingData.length === 0) {
//       console.log("Effect early exit due to no meeting data.");
//       return;
//     }

//     console.log("All checks passed and useEffect succesfully called.");

//     // Insert the heading here, right after the initial checks.
//     if (!hasInsertedHeadingRef.current) {
//       console.log(
//         "hasInsertedHeadingRef.current:",
//         hasInsertedHeadingRef.current
//       );
//       insertHeading();
//       hasInsertedHeadingRef.current = true;
//       console.log(
//         "hasInsertedHeadingRef.current:",
//         hasInsertedHeadingRef.current
//       );
//     }

//     async function fetchSummary() {
//       try {
//         console.log("fetch called");
//         const response = await fetch(
//           "https://collab-express-production.up.railway.app/summarize-career-education",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(meetingData),
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Server responded with a ${response.status} status.`);
//         }

//         const data = await response.json();
//         console.log("streaming data:", data);
//       } catch (error) {
//         console.error("There was an error fetching the summary!", error);
//       }
//     }

//     // Establish a connection and listen for events from the backend
//     socket.on("connect", () => {
//       console.log("Connected to backend");
//       socket.emit("registerUser", session.user.id);
//     });

//     socket.on("responseChunk", (data) => {
//       console.log("chunk data:", data);

//       // Append the new chunk of content to the editor
//       editor.update(() => {
//         $buildRapportNode(data.content);
//       });
//     });

//     fetchSummary(); // fetch initial data

//     hasEffectRun.current = true;
//     hasInsertedHeadingRef.current = false;

//     // Clean up listeners and disconnect on component unmount or if meetingData changes
//     return () => {
//       socket.off("responseChunk");
//       socket.disconnect();
//     };
//   }, [meetingData, editor, triggerEffect]); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     if (!summary) {
//       console.log("No summary data");
//       return;
//     }

//     const unregister = editor.registerCommand(
//       INSERT_BUILD_RAPPORT_COMMAND,
//       () => {
//         console.log("command set");
//         return true;
//       },
//       COMMAND_PRIORITY_EDITOR
//     );

//     return () => {
//       if (typeof unregister === "function") {
//         unregister();
//       }
//     };
//   }, [editor, summary]);

//   return null;
// }
