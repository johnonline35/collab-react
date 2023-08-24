import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

export function $buildRapportNode(responseContent) {
  // "Notes:" Heading
  const notesHeading = $createHeadingNode("h3").append(
    $createTextNode("Rapport Building Topics:").setStyle("font-weight: bold")
  );
  insertBeforeLastChild(notesHeading);

  // Create a list for bullets
  const bulletList = $createListNode("bullet");
  const lines = responseContent.split("\n");

  for (const line of lines) {
    if (line.startsWith("- ")) {
      // This is a bullet point
      const bulletContent = line.substring(2); // Remove "- " from the start
      const bullet = $createListItemNode().append(
        $createTextNode(bulletContent)
      );
      bulletList.append(bullet);

      // Add an empty line between each bullet
      bulletList.append($createListItemNode().append($createTextNode("")));
    } else if (line.trim() !== "") {
      // This is a plain text
      const text = $createParagraphNode().append($createTextNode(line));
      insertBeforeLastChild(text);
    }
    // For new lines
    insertBeforeLastChild($createParagraphNode());
  }

  // Add the bullet list to the document
  insertBeforeLastChild(bulletList);

  // Empty Paragraph
  insertBeforeLastChild($createParagraphNode());
}

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
