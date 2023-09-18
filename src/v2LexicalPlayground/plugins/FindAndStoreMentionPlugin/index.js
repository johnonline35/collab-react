import { useEffect, useState, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { fetchUUIDs } from "../../../util/database";

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

  useEffect(() => {
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        console.log("ENTER key pressed!");
        setNextStepsMap((prevMap) => {
          const updatedMap = new Map([...prevMap, ...latestContentMap]);
          latestContentMap.clear(); // Clear temp storage
          return updatedMap;
        });
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [nextStepsMap, editor, uuidSet]);

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
