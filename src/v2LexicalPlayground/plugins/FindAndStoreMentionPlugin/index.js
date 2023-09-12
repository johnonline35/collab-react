import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { fetchUUIDs } from "../../../util/database";

export default function FindAndStoreMentionPlugin({ workspace_id, session }) {
  console.log("FindAndStoreMentionPlugin Called.");

  const [editor] = useLexicalComposerContext();
  const [uuidSet, setUuidSet] = useState(new Set());
  const { userId } = session.user.id;
  console.log(" FindAndStoreMentionPlugin UserID:", userId);

  useEffect(() => {
    async function fetchData() {
      const fetchedUuids = await fetchUUIDs(workspace_id, userId);
      if (fetchedUuids) {
        setUuidSet(new Set(fetchedUuids));
      }
    }

    fetchData();
  }, [workspace_id, userId]);

  useEffect(() => {
    if (!editor) {
      console.warn("Editor is not properly initialized.");
      return;
    }

    // HERE ARE THE INSTRUCTIONS TO CHAT GPT 4:
    // get next step UUID list from supabase for the current userId and workspaceId - from here: Table "collab_users_next_steps"; select "collab_user_next_steps_id" eq "workspace_id" & collab_user_id
    // use Set() to store them
    // whenever there is an enter keydown event, check the Set() with the UUID of the
    // THIS IS THE END  OF THE INSTRUCTIONS TO CHAT GPT 4

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const allTextNodes = root.getAllTextNodes();
        allTextNodes.forEach((node) => {
          if (node.__mention === "Next Step:") {
            const targetMentionNode = node;
            const textContainerNode = targetMentionNode.getNextSibling();
            if (
              textContainerNode &&
              textContainerNode.getTextContent() !== null
            ) {
              const extractedTextContent = textContainerNode.getTextContent();
              const extractedTextUUID = node.__uuid;
              console.log("Mention Node Type:", node.__mention);
              console.log("Mention Node UUID:", extractedTextUUID);
              console.log("extractedTextContent:", extractedTextContent);
            }
          }
        });
      });
    });

    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        // Handle enter key presses here
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      if (unregister && typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor]);

  return null;
}
