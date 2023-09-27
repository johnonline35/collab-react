import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  LexicalCommand,
  LexicalEditor,
  $createTextNode,
} from "lexical";
import { $insertNodeToNearestRoot, $wrapNodeInElement } from "@lexical/utils";
import { $createStructureNode } from "../../nodes/CreateStructureNode";
import { $createNoteStructureNode } from "../../nodes/NoteStructureNode";
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
          const createNoteStructureNode = $createNoteStructureNode();
          $insertNodes([createNoteStructureNode]);
          if ($isRootOrShadowRoot(createNoteStructureNode.getParentOrThrow())) {
            $wrapNodeInElement(
              createNoteStructureNode,
              $createParagraphNode
            ).selectEnd();
          }
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
