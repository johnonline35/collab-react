import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import {
  fetchNextStepUUIDs,
  storeNextStep,
  fetchTodoUuids,
  storeTodo,
} from "../../../utils/database";

export default function FindAndStoreMentionPlugin({ workspace_id, userId }) {
  const [editor] = useLexicalComposerContext();
  const existingNextStepUuidsSet = useRef(new Set());
  const existingTodoUuidsSet = useRef(new Set());
  const latestNextStepsMap = useRef(new Map()).current;
  const latestTodoMap = useRef(new Map()).current;
  const handleEnterRef = useRef(null);
  const isProcessing = useRef(false);
  // const userId = session?.user?.id;

  // Fetch existing uuid's and set them for checking
  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedNextStepUuids, fetchedTodoUuids] = await Promise.all([
          fetchNextStepUUIDs(workspace_id, userId),
          fetchTodoUuids(workspace_id, userId),
        ]);

        if (fetchedNextStepUuids) {
          fetchedNextStepUuids.forEach((uuid) => {
            existingNextStepUuidsSet.current.add(uuid);
          });
        }

        if (fetchedTodoUuids) {
          fetchedTodoUuids.forEach((uuid) => {
            existingTodoUuidsSet.current.add(uuid);
          });
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
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

      for (let [uuid, content] of latestNextStepsMap.entries()) {
        if (!existingNextStepUuidsSet.current.has(uuid)) {
          const response = await storeNextStep(
            workspace_id,
            userId,
            uuid,
            content
          );

          if (response && response.success) {
            existingNextStepUuidsSet.current.add(uuid);
          }
        } else {
          // TODO: Add some error handling here
        }
      }

      latestNextStepsMap.clear();

      for (let [uuid, content] of latestTodoMap.entries()) {
        if (!existingTodoUuidsSet.current.has(uuid)) {
          const response = await storeTodo(workspace_id, userId, uuid, content);

          if (response && response.success) {
            existingTodoUuidsSet.current.add(uuid);
          }
        } else {
          // TODO: Add some error handling here
        }
      }

      latestTodoMap.clear();

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
          if (node.__type === "mention") {
            if (node.__mention === "Next Steps:") {
              const targetMentionNode = node;
              const textContainerNode = targetMentionNode.getNextSibling();
              if (textContainerNode && textContainerNode.getTextContent()) {
                const content = textContainerNode.getTextContent();
                const uuid = node.__uuid;
                latestNextStepsMap.set(uuid, content);
              }
            } else if (node.__mention === "Todo:") {
              const targetMentionNode = node;
              const textContainerNode = targetMentionNode.getNextSibling();
              if (textContainerNode && textContainerNode.getTextContent()) {
                const content = textContainerNode.getTextContent();
                const uuid = node.__uuid;
                latestTodoMap.set(uuid, content);
              }
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
