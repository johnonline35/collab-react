import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";

export function $buildRapportNode() {
  const root = $getRoot();

  // Create nodes to add
  const nodesToAdd = [];

  // "Notes:" Heading
  const notesHeading = $createHeadingNode("h3").append(
    $createTextNode("Facts to help Build Rapport:").setStyle(
      "font-weight: bold"
    )
  );
  nodesToAdd.push(notesHeading);

  // Empty Paragraph
  nodesToAdd.push($createParagraphNode());

  // Bullet list with a single bullet
  const list1 = $createListNode("bullet");
  list1.append($createListItemNode().append($createTextNode("")));
  nodesToAdd.push(list1);

  // Empty Paragraph
  nodesToAdd.push($createParagraphNode());

  // "Follow up:" Heading
  const followUpHeading = $createHeadingNode("h3").append(
    $createTextNode("Action items:").setStyle("font-weight: bold")
  );
  nodesToAdd.push(followUpHeading);

  // Empty Paragraph
  nodesToAdd.push($createParagraphNode());

  // Another bullet list with a single bullet
  const list2 = $createListNode("bullet");
  list2.append($createListItemNode().append($createTextNode("")));
  nodesToAdd.push(list2);

  // Empty Paragraph
  nodesToAdd.push($createParagraphNode());

  const lastChild = root.getLastChild();

  if (lastChild) {
    for (let node of nodesToAdd) {
      lastChild.insertBefore(node);
    }
  }
}
