import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";

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
  list.append($createListItemNode().append($createTextNode("")));
  root.append(list);

  // Create another empty paragraph node and append it

  root.append(paragraph);

  const heading2 = $createHeadingNode("h3").append(
    $createTextNode("Follow up:")
  );
  root.append(heading2);

  // Create an empty paragraph node and append it

  root.append(paragraph);

  // Create an empty bullet list and append it
  list.append($createListItemNode().append($createTextNode("")));
  root.append(list);

  // Create another empty paragraph node and append it
  root.append(paragraph);
}
