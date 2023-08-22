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
  const heading = $createHeadingNode("h3").append($createTextNode("Notes:"));
  root.append(heading);

  // Create an empty paragraph node and append it
  const paragraph = $createParagraphNode();
  root.append(paragraph);

  // Create an empty bullet list and append it
  const list = $createListNode("bullet");
  root.append(list);

  // Create another empty paragraph node and append it
  const paragraph2 = $createParagraphNode();
  root.append(paragraph2);
}
