import {
  $createHeadingNode,
  $createParagraphNode,
  $createListNode,
  $getRoot,
  $createTextNode,
} from "lexical";

export function $createStructureNode() {
  const root = $getRoot();

  // Create an h3 heading node with the text "Notes:"
  const heading = $createHeadingNode("h3").append($createTextNode("Notes:"));

  // Create an empty bullet list
  const list = $createListNode("bullet");

  // Create an empty paragraph node
  const paragraph = $createParagraphNode();

  // Append all the created nodes to the root in the desired order
  root.append(heading, paragraph, list, paragraph);
}
