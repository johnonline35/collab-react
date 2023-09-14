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
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
  $createTextNode,
} from "lexical";
import { $insertNodeToNearestRoot } from "@lexical/utils";
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
          //
          // $createStructureNode();
          //
          // const selection = $getSelection();
          // if (!$isNodeSelection(selection)) {
          //   return null;
          // }
          // const nodes = selection.getNodes();
          // const node = nodes[0];
          // console.log("Node for structure node:", node);
          const textNode = $createTextNode("TEXT NODE");
          $insertNodeToNearestRoot(textNode);
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
