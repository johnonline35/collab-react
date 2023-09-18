import { useEffect, useState, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { fetchUUIDs, storeNextStep } from "../../../util/database";

export default function FindAndStoreMentionPlugin({ workspace_id, session }) {
  const [editor] = useLexicalComposerContext();
  const [uuidSet, setUuidSet] = useState(new Set());
  const [nextStepsMap, setNextStepsMap] = useState(new Map());
  const latestContentMap = useRef(new Map()).current;
  const userId = session?.user?.id;

  // Fetch the existing mention UUID's and store them in a Set()
  useEffect(() => {
    if (!userId || !workspace_id) {
      console.log("No userId or WorkspaceId found");
      return;
    }

    async function fetchData() {
      console.log("fetchData called");
      const fetchedUuids = await fetchUUIDs(workspace_id, userId);
      console.log("fetchedUuids:", fetchedUuids);
      if (fetchedUuids) {
        setUuidSet(new Set(fetchedUuids));
      }
    }

    fetchData();
  }, [workspace_id, userId]);

  // function newUuid(uuid, content) {
  //   console.log("New UUID detected:", uuid, "with content:", content);
  //   // Add any additional logic you want here.
  // }

  useEffect(() => {
    const handleEnter = async () => {
      console.log("ENTER key pressed!");

      const updatedMap = new Map([...nextStepsMap, ...latestContentMap]);

      for (let [uuid, content] of latestContentMap.entries()) {
        if (!uuidSet.has(uuid) && !nextStepsMap.has(uuid)) {
          const response = await storeNextStep(
            workspace_id,
            userId,
            uuid,
            content
          );
          console.log("Response from storeNextStep:", response);
        }
      }

      latestContentMap.clear();
      setNextStepsMap(updatedMap);
    };

    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        handleEnter();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [workspace_id, userId, nextStepsMap, editor, uuidSet]);

  useEffect(() => {
    if (!editor) {
      console.warn("Editor is not properly initialized.");
      return;
    }

    // Listen to the editor state for new mentions:
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const allTextNodes = root.getAllTextNodes();
        allTextNodes.forEach((node) => {
          if (node.__type === "mention" && node.__mention === "Next Steps:") {
            const targetMentionNode = node;
            const textContainerNode = targetMentionNode.getNextSibling();
            if (
              textContainerNode &&
              textContainerNode.getTextContent() !== null
            ) {
              const extractedNextStepContent =
                textContainerNode.getTextContent();
              const extractedNextStepUUID = node.__uuid;

              console.log(
                "Setting latestContentMap with UUID:",
                extractedNextStepUUID,
                "and content:",
                extractedNextStepContent
              );

              latestContentMap.set(
                extractedNextStepUUID,
                extractedNextStepContent
              );
            }
          }
        });
      });
    });

    return () => {
      if (unregister && typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor]);

  return null;
}
