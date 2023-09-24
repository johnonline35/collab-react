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
import { $createCustomDecoratorNode } from "../../nodes/CustomDecoratorNode";
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
          const createStructureNode = $createCustomDecoratorNode();
          //
          // const selection = $getSelection();
          // if (!$isNodeSelection(selection)) {
          //   return null;
          // }
          // const nodes = selection.getNodes();
          // const node = nodes[0];
          // console.log("Node for structure node:", node);
          const textNode = $createTextNode("TEXT NODE");
          $insertNodes([createStructureNode]);
          if ($isRootOrShadowRoot(createStructureNode.getParentOrThrow())) {
            $wrapNodeInElement(
              createStructureNode,
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
