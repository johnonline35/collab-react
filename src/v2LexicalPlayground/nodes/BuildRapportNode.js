import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

export function $buildRapportNode() {
  // "Notes:" Heading
  const notesHeading = $createHeadingNode("h3").append(
    $createTextNode("Facts to help Build Rapport:").setStyle(
      "font-weight: bold"
    )
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
}
