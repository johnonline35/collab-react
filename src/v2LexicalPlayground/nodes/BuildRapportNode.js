import { $createParagraphNode, $getRoot, $createTextNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";

function simulateTyping(content, callback) {
  let currentText = "";
  let index = 0;

  function typeCharacter() {
    if (index < content.length) {
      currentText += content[index];
      index++;
      callback(currentText);
      setTimeout(typeCharacter, 50); // 50ms delay to simulate typing
    }
  }

  typeCharacter();
}

export function $buildRapportNode(responseContent) {
  // "Rapport Building Topics:" Heading
  const notesHeading = $createHeadingNode("h3").append(
    $createTextNode("Rapport Building Topics:").setStyle("font-weight: bold")
  );
  insertBeforeLastChild(notesHeading);

  insertBeforeLastChild($createParagraphNode());

  // Split the response content by lines
  const lines = responseContent.split("\n");

  for (const line of lines) {
    const cleanedLine = line.replace("undefined", "").trim();

    if (cleanedLine.startsWith("- ")) {
      const bulletContent = cleanedLine.substring(2); // Remove "- " from the start
      const singleBulletList = $createListNode("bullet");

      // Simulate typing for the bullet point
      simulateTyping(bulletContent, (typedContent) => {
        singleBulletList.append(
          $createListItemNode().append($createTextNode(typedContent))
        );
      });

      insertBeforeLastChild(singleBulletList);
      insertBeforeLastChild($createParagraphNode());
    } else if (cleanedLine !== "") {
      // Simulate typing for plain text
      simulateTyping(cleanedLine, (typedContent) => {
        insertBeforeLastChild(
          $createParagraphNode().append($createTextNode(typedContent))
        );
      });
    }
  }
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
