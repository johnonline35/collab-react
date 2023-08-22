import {
  $createParagraphNode,
  $createListNode,
  $getRoot,
  $createTextNode,
} from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";

export function $createStructureNode() {
  const root = $getRoot();

  // Create an h3 heading node with the text "Notes:"
  const heading = $createHeadingNode("h3");
  heading.append($createTextNode("Notes:"));

  root.append(heading);

  const paragraph = $createParagraphNode();
}
