import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { fetchUUIDs } from "../../../util/database";
import { supabase } from "../../../supabase/clientapp";

export default function FindAndStoreMentionPlugin({ workspace_id, session }) {
  const [editor] = useLexicalComposerContext();
  const [uuidSet, setUuidSet] = useState(new Set());
  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchData() {
      const fetchedUuids = await fetchUUIDs(workspace_id, userId);
      if (fetchedUuids) {
        setUuidSet(new Set(fetchedUuids));
      }
    }

    if (userId && workspace_id) fetchData();
  }, [workspace_id, userId]);

  async function upsertDataToSupabase(
    extractedNextStepUUID,
    extractedNextStepContent
  ) {
    try {
      const { error } = await supabase.from("collab_users_next_steps").upsert({
        collab_user_next_steps_id: extractedNextStepUUID,
        workspace_id,
        collab_user_id: userId,
        nextstep_content: extractedNextStepContent,
      });

      if (error) {
        console.error("Error upserting data:", error);
      } else {
        setUuidSet((prevSet) => new Set([...prevSet, extractedNextStepUUID]));
      }
    } catch (err) {
      console.error("Supabase upsert error:", err);
    }
  }

  function getMentionData(editorState) {
    let extractedData = null;
    editorState.read(() => {
      const root = $getRoot();
      const allTextNodes = root.getAllTextNodes();
      for (const node of allTextNodes) {
        if (node.__type === "mention" && node.__mention === "Next Steps:") {
          const textContainerNode = node.getNextSibling();
          if (
            textContainerNode &&
            textContainerNode.getTextContent() !== null
          ) {
            extractedData = {
              extractedNextStepUUID: node.__uuid,
              extractedNextStepContent: textContainerNode.getTextContent(),
            };
          }
        }
      }
    });
    return extractedData;
  }

  useEffect(() => {
    if (!editor) return;

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      getMentionData(editorState);
    });

    editor.registerCommand(
      KEY_ENTER_COMMAND,
      ({ editorState }) => {
        const mentionData = getMentionData(editorState);
        if (mentionData && !uuidSet.has(mentionData.extractedNextStepUUID)) {
          upsertDataToSupabase(
            mentionData.extractedNextStepUUID,
            mentionData.extractedNextStepContent
          );
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      if (unregister) unregister();
    };
  }, [editor, uuidSet]);

  return null;
}

// import { useEffect, useState } from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { $getRoot } from "lexical";
// import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
// import { fetchUUIDs } from "../../../util/database";

// export default function FindAndStoreMentionPlugin({ workspace_id, session }) {
//   console.log("FindAndStoreMentionPlugin Called.");

//   const [editor] = useLexicalComposerContext();
//   const [uuidSet, setUuidSet] = useState(new Set());
//   const userId = session?.user?.id;

//   // Fetch the existing mention UUID's and store them in a Set()
//   useEffect(() => {
//     if (!userId || !workspace_id) {
//       console.log("No userId or WorkspaceId found");
//       return;
//     }

//     async function fetchData() {
//       console.log("fetchData called");
//       const fetchedUuids = await fetchUUIDs(workspace_id, userId);
//       console.log("fetchedUuids:", fetchedUuids);
//       if (fetchedUuids) {
//         setUuidSet(new Set(fetchedUuids));
//       }
//     }

//     fetchData();
//   }, [workspace_id, userId]);

//   useEffect(() => {
//     console.log("Fetched UUID's:", uuidSet);
//   }, [uuidSet]);

//   useEffect(() => {
//     if (!editor) {
//       console.warn("Editor is not properly initialized.");
//       return;
//     }

//     // Listen to the editor state for new mentions:
//     const unregister = editor.registerUpdateListener(({ editorState }) => {
//       editorState.read(() => {
//         const root = $getRoot();
//         const allTextNodes = root.getAllTextNodes();
//         allTextNodes.forEach((node) => {
//           if (node.__type === "mention" && node.__mention === "Next Steps:") {
//             const targetMentionNode = node;
//             const textContainerNode = targetMentionNode.getNextSibling();
//             if (
//               textContainerNode &&
//               textContainerNode.getTextContent() !== null
//             ) {
//               const extractedNextStepContent =
//                 textContainerNode.getTextContent();
//               const extractedNextStepUUID = node.__uuid;
//             }
//           }
//         });
//       });
//     });

//     // When the enter key is pressed, check the node tree for new UUID's and insert if needed:
//     editor.registerCommand(
//       KEY_ENTER_COMMAND,
//       (event) => {
//         console.log("ENTER key pressed!");
//         return false;
//       },
//       COMMAND_PRIORITY_LOW
//     );

//     return () => {
//       if (unregister && typeof unregister === "function") {
//         unregister();
//       }
//     };
//   }, [editor]);

//   return null;
// }
