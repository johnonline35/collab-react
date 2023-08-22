import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";

export function $createStructureNode() {
  const root = $getRoot();

  // "Notes:" Heading
  const notesHeading = $createHeadingNode("h3").append(
    $createTextNode("Notes:").setStyle("font-weight: bold")
  );
  root.append(notesHeading);

  // Empty Paragraph
  const paragraph1 = $createParagraphNode();
  root.append(paragraph1);

  // Bullet list with a single bullet
  const list1 = $createListNode("bullet");
  list1.append($createListItemNode().append($createTextNode("")));
  root.append(list1);

  // Empty Paragraph
  const paragraph2 = $createParagraphNode();
  root.append(paragraph2);

  // "Follow up:" Heading
  const followUpHeading = $createHeadingNode("h3").append(
    $createTextNode("Action items:").setStyle("font-weight: bold")
  );
  root.append(followUpHeading);

  // Empty Paragraph
  const paragraph3 = $createParagraphNode();
  root.append(paragraph3);

  // Another bullet list with a single bullet
  const list2 = $createListNode("bullet");
  list2.append($createListItemNode().append($createTextNode("")));
  root.append(list2);

  // Empty Paragraph
  const paragraph4 = $createParagraphNode();
  root.append(paragraph4);
}
