import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  getLastChild,
} from "lexical";
import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

export function $buildRapportNode(responseContent) {
  const lines = responseContent.split("\n");

  if (lines.length === 0) return; // nothing to process

  // Handle the first line which should be appended to the current last node
  const firstLine = lines[0].trim();
  if (firstLine) {
    const lastChild = $getRoot().getLastChild();
    if (lastChild && lastChild.isTextNode) {
      // Append to existing text
      lastChild.append($createTextNode(firstLine));
    } else {
      // Otherwise create a new paragraph
      insertBeforeLastChild(
        $createParagraphNode().append($createTextNode(firstLine))
      );
    }
  }

  // Handle any subsequent lines (after the first)
  for (let i = 1; i < lines.length; i++) {
    const cleanedLine = lines[i].trim();
    if (cleanedLine) {
      insertBeforeLastChild(
        $createParagraphNode().append($createTextNode(cleanedLine))
      );
    }
  }
}

// import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
// import { $createHeadingNode } from "@lexical/rich-text";
// import { $createListItemNode, $createListNode } from "@lexical/list";
// import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

// export function $buildRapportNode(responseContent) {
//   // "Rapport Building Topics:" Heading
//   const notesHeading = $createHeadingNode("h3").append(
//     $createTextNode("Pre-Meeting Research:").setStyle("font-weight: bold")
//   );
//   insertBeforeLastChild(notesHeading);

//   insertBeforeLastChild($createParagraphNode());

//   // Split the response content by lines
//   const lines = responseContent.split("\n");

//   for (const line of lines) {
//     const cleanedLine = line.replace("undefined", "").trim();

//     if (cleanedLine.startsWith("- ")) {
//       // This is a bullet point
//       const bulletContent = cleanedLine.substring(2); // Remove "- " from the start

//       // Create a single bullet list with the current bullet
//       const singleBulletList = $createListNode("bullet");
//       singleBulletList.append(
//         $createListItemNode().append($createTextNode(bulletContent))
//       );
//       insertBeforeLastChild(singleBulletList);

//       // Add an empty line after the bullet
//       insertBeforeLastChild($createParagraphNode());
//     } else if (cleanedLine !== "") {
//       // This is a plain text
//       insertBeforeLastChild(
//         $createParagraphNode().append($createTextNode(cleanedLine))
//       );
//     }
//   }
// }

// import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
// import { $createHeadingNode } from "@lexical/rich-text";
// import { $createListItemNode, $createListNode } from "@lexical/list";
// import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

// export function $buildRapportNode() {
//   // "Notes:" Heading
//   const notesHeading = $createHeadingNode("h3").append(
//     $createTextNode("Rapport Building Topics:").setStyle("font-weight: bold")
//   );
//   insertBeforeLastChild(notesHeading);

//   // Empty Paragraph
//   insertBeforeLastChild($createParagraphNode());

//   // Bullet list with a single bullet
//   const list1 = $createListNode("bullet");
//   list1.append($createListItemNode().append($createTextNode("")));
//   insertBeforeLastChild(list1);

//   // Empty Paragraph
//   insertBeforeLastChild($createParagraphNode());
// }
