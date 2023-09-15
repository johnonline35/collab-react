import {
  $createParagraphNode,
  $getRoot,
  $createTextNode,
  $getSelection,
  $isNodeSelection,
} from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

export function $createStructureNode() {
  // const notesHeading = $createHeadingNode("h3")
  //   .append($createTextNode("Notes:").setStyle("font-weight: bold"))
  //   .append($createListNode("bullet"))
  //   .append($createListItemNode().append($createTextNode("")))
  //   .append($createParagraphNode())
  //   .append($createHeadingNode("h3"))
  //   .append($createTextNode("Action items:").setStyle("font-weight: bold"))
  //   .append($createListNode("bullet"))
  //   .append($createListItemNode().append($createTextNode("")))
  //   .append($createParagraphNode());
  // return notesHeading;
  // "Notes:" Heading
  const notesHeading = $createHeadingNode("h3").append(
    $createTextNode("Notes:").setStyle("font-weight: bold")
  );
  insertBeforeLastChild(notesHeading);

  // Empty Paragraph
  insertBeforeLastChild($createParagraphNode());

  // Bullet list with a single bullet
  const list1 = $createListNode("bullet");
  list1.append($createListItemNode().append($createTextNode("")));
  insertBeforeLastChild(list1);

  // Empty Paragraph
  insertBeforeLastChild($createParagraphNode());

  // "Follow up:" Heading
  const followUpHeading = $createHeadingNode("h3").append(
    $createTextNode("Action items:").setStyle("font-weight: bold")
  );
  insertBeforeLastChild(followUpHeading);

  // Empty Paragraph
  insertBeforeLastChild($createParagraphNode());

  // Another bullet list with a single bullet
  const list2 = $createListNode("bullet");
  list2.append($createListItemNode().append($createTextNode("")));
  insertBeforeLastChild(list2);

  // Empty Paragraph
  insertBeforeLastChild($createParagraphNode());
}
