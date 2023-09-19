import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { fetchUUIDs, storeNextStep } from "../../../util/database";

export default function FindAndStoreMentionPlugin({ workspace_id, session }) {
  const [editor] = useLexicalComposerContext();
  const existingUuidsSet = useRef(new Set());
  const latestContentMap = useRef(new Map()).current;
  const handleEnterRef = useRef(null);
  const isProcessing = useRef(false);
  const userId = session?.user?.id;

  // Fetch existing uuid's and set them for checking
  useEffect(() => {
    async function fetchData() {
      const fetchedUuids = await fetchUUIDs(workspace_id, userId);

      if (fetchedUuids) {
        fetchedUuids.forEach((uuid) => {
          existingUuidsSet.current.add(uuid);
        });
      }
    }

    if (userId && workspace_id) {
      fetchData();
    } else {
      console.log("No userId or WorkspaceId found");
    }
  }, [workspace_id, userId]);

  // On enter keydown, process the current mention node contents and store in
  // supabase if uuid is new and not yet stored
  useEffect(() => {
    handleEnterRef.current = async () => {
      if (isProcessing.current) return;

      isProcessing.current = true;

      for (let [uuid, content] of latestContentMap.entries()) {
        if (!existingUuidsSet.current.has(uuid)) {
          const response = await storeNextStep(
            workspace_id,
            userId,
            uuid,
            content
          );

          if (response && response.success) {
            existingUuidsSet.current.add(uuid);
          }
        } else {
          // TODO: Add some error handling here
        }
      }

      latestContentMap.clear();

      isProcessing.current = false;
    };

    const unregisterEnterCommand = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        console.log("ENTER key detected");
        if (handleEnterRef.current) {
          handleEnterRef.current();
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      if (unregisterEnterCommand) {
        unregisterEnterCommand();
      }
    };
  }, [editor, workspace_id, userId]);

  // Listen to the current editor state and maintain copy of all mention nodes and corresponding uuid's
  useEffect(() => {
    if (!editor) {
      console.warn("Editor is not properly initialized.");
      return;
    }

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const allTextNodes = root.getAllTextNodes();
        allTextNodes.forEach((node) => {
          if (node.__type === "mention" && node.__mention === "Next Steps:") {
            const targetMentionNode = node;
            const textContainerNode = targetMentionNode.getNextSibling();
            if (textContainerNode && textContainerNode.getTextContent()) {
              const content = textContainerNode.getTextContent();
              const uuid = node.__uuid;
              latestContentMap.set(uuid, content);
            }
          }
        });
      });
    });

    return () => {
      if (unregister) {
        unregister();
      }
    };
  }, [editor]);

  return null;
}
