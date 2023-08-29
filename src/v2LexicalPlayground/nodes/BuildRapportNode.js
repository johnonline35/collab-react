import { $createParagraphNode, $createTextNode } from "lexical";
import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

let currentParagraphNode = null;
let buffer = "";

export function $buildRapportNode(responseContent) {
  buffer += responseContent;
  const lines = buffer.split("\n");

  if (!lines) {
    console.error("lines is undefined!");
    return;
  }

  for (let i = 0; i < lines.length; i++) {
    const cleanedLine = lines[i].trim();

    if (!currentParagraphNode) {
      currentParagraphNode = $createParagraphNode();
      insertBeforeLastChild(currentParagraphNode);
    }

    if (i === lines.length - 1 && cleanedLine === "") {
      // If the last line is empty, it means we've encountered a newline at the end.
      currentParagraphNode = null; // Ready to start a new paragraph on next iteration
    } else {
      if (currentParagraphNode.childNodes.length === 0) {
        // If current paragraph is empty, create a new text node
        const textNode = $createTextNode(cleanedLine);
        currentParagraphNode.append(textNode);
      } else {
        // Otherwise, append to the existing text node
        const existingTextNode = currentParagraphNode.childNodes[0];
        existingTextNode.textContent += cleanedLine;
      }
    }
  }

  // If the last line did not end with a newline, keep it in the buffer for next iteration
  if (!buffer.endsWith("\n")) {
    buffer = lines[lines.length - 1];
  } else {
    buffer = "";
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
