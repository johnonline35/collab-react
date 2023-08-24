import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

export function $buildRapportNode(responseContent) {
  // "Rapport Building Topics:" Heading
  const notesHeading = $createHeadingNode("h3").append(
    $createTextNode("Rapport Building Topics:").setStyle("font-weight: bold")
  );
  insertBeforeLastChild(notesHeading);

  // Split the response content by lines
  const lines = responseContent.split("\n");

  const bulletList = $createListNode("bullet");
  for (const line of lines) {
    if (line.startsWith("- ")) {
      // This is a bullet point
      const bulletContent = line.substring(2); // Remove "- " from the start
      bulletList.append(
        $createListItemNode().append($createTextNode(bulletContent))
      );

      // Add an empty line after the bullet, without a bullet
      insertBeforeLastChild($createParagraphNode());
    } else if (line.trim() !== "") {
      // This is a plain text
      insertBeforeLastChild(
        $createParagraphNode().append($createTextNode(line))
      );
    }
  }
  // Insert the entire bullet list
  insertBeforeLastChild(bulletList);
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
