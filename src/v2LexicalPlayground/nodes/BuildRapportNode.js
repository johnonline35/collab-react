import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  ElementNode,
} from "lexical";

import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

export function $buildRapportNode(responseContent) {
  const selection = $getSelection();

  // Check if the selection is not null and is of the expected type
  if (selection && selection instanceof ElementNode) {
    if (responseContent !== "") {
      const lastChild = selection.getLastChild();

      // If the last child is a paragraph, append text to it
      if (lastChild && lastChild.__type === "paragraph") {
        lastChild.append($createTextNode(responseContent));
      } else {
        // If the last child isn't a paragraph, create a new one and append the text
        const paragraph = $createParagraphNode().append(
          $createTextNode(responseContent)
        );
        // Assuming insertBeforeLastChild() is a function that inserts the paragraph before the last child.
        insertBeforeLastChild(paragraph);
      }
    }
  } else {
    console.warn("Selection is either null or not of the expected type.");
  }
}

// export function $buildRapportNode(responseContent) {
//   const root = $getRoot();

//   if (responseContent !== "") {
//     const lastChild = root.getLastChild();

//     // If the last child is a paragraph, append text to it
//     if (lastChild && lastChild.__type === "paragraph") {
//       lastChild.append($createTextNode(responseContent));
//     } else {
//       // If the last child isn't a paragraph, create a new one and append the text
//       const paragraph = $createParagraphNode().append(
//         $createTextNode(responseContent)
//       );
//       insertBeforeLastChild(paragraph);
//       insertBeforeLastChild(paragraph);
//     }
//   }
// }

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
