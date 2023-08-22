import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";
import { $createStructureNode } from "../../nodes/CreateStructureNode";
import { useEffect } from "react";

export const INSERT_STRUCTURE_COMMAND = createCommand();

export default function CreateStructurePlugin() {
  const [editor] = useLexicalComposerContext();

  // Register the command, depending on editor
  useEffect(() => {
    const unregister = editor.registerCommand(
      INSERT_STRUCTURE_COMMAND,
      () => {
        editor.update(() => {
          $createStructureNode();
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => {
      if (typeof unregister === "function") {
        unregister();
      }
    };
  }, [editor]);

  return null;
}
