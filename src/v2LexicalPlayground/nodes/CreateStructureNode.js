// import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
// import { $createHeadingNode } from "@lexical/rich-text";
// import { $createListItemNode, $createListNode } from "@lexical/list";

// export function $createStructureNode() {
//   const root = $getRoot();

//   // Prepare the nodes to add
//   const nodesToAdd = [];

//   // "Notes:" Heading
//   const notesHeading = $createHeadingNode("h3").append(
//     $createTextNode("Notes:")
//   );
//   nodesToAdd.push(notesHeading);

//   // Empty Paragraph
//   nodesToAdd.push($createParagraphNode());

//   // Bullet list with a single bullet
//   const list1 = $createListNode("bullet");
//   list1.append($createListItemNode().append($createTextNode("")));
//   nodesToAdd.push(list1);

//   // Empty Paragraph
//   nodesToAdd.push($createParagraphNode());

//   // "Follow up:" Heading
//   const followUpHeading = $createHeadingNode("h3").append(
//     $createTextNode("Follow up:")
//   );
//   nodesToAdd.push(followUpHeading);

//   // Empty Paragraph
//   nodesToAdd.push($createParagraphNode());

//   // Another bullet list with a single bullet
//   const list2 = $createListNode("bullet");
//   list2.append($createListItemNode().append($createTextNode("")));
//   nodesToAdd.push(list2);

//   // Empty Paragraph
//   nodesToAdd.push($createParagraphNode());

//   // Check if there are any child nodes
//   if (root.getLastChild() !== null) {
//     let lastChild = root.getLastChild();
//     for (let node of nodesToAdd) {
//       lastChild.insertBefore(node);
//       lastChild = node; // Move the pointer to the last added node
//     }
//   } else {
//     // Append normally to the root
//     for (let node of nodesToAdd) {
//       root.append(node);
//     }
//   }
// }

import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";

export function $createStructureNode() {
  const root = $getRoot();

  // "Notes:" Heading
  const notesHeading = $createHeadingNode("h3").append(
    $createTextNode("Notes:").setStyle("font-weight: bold")
  );
  root.insertBefore(notesHeading);

  // Empty Paragraph
  const paragraph1 = $createParagraphNode();
  root.insertBefore(paragraph1);

  // Bullet list with a single bullet
  const list1 = $createListNode("bullet");
  list1.append($createListItemNode().append($createTextNode("")));
  root.insertBefore(list1);

  // Empty Paragraph
  const paragraph2 = $createParagraphNode();
  root.insertBefore(paragraph2);

  // "Follow up:" Heading
  const followUpHeading = $createHeadingNode("h3").append(
    $createTextNode("Action items:").setStyle("font-weight: bold")
  );
  root.insertBefore(followUpHeading);

  // Empty Paragraph
  const paragraph3 = $createParagraphNode();
  root.insertBefore(paragraph3);

  // Another bullet list with a single bullet
  const list2 = $createListNode("bullet");
  list2.append($createListItemNode().append($createTextNode("")));
  root.insertBefore(list2);

  // Empty Paragraph
  const paragraph4 = $createParagraphNode();
  root.insertBefore(paragraph4);
}
