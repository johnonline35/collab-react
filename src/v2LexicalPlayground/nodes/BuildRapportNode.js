import {
  $getRoot,
  $getSelection,
  $createTextNode,
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  $wrapNodeInElement,
  DecoratorNode,
  $isNodeSelection,
} from "lexical";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

import { insertBeforeLastChild } from "../utils/insertBeforeLastChild";
import { useContext } from "react";
import { SessionContext } from "../privateRoute";

const socketStub = (() => {
  const callbacks = {};

  const on = (event, callback) => {
    callbacks[event] = callback;
  };

  const emit = (event, data) => {
    // noop
  };

  const trigger = async () => {
    let count = 0;
    while (count < 50) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      callbacks["responseChunk"]({
        content: "Hello from BUILD_RAPPORT 2",
      });
      count++;
    }
  };

  return { on, emit, trigger };
})();

async function fetchSummary() {
  await socketStub.trigger();
  return;
  try {
    console.log("fetch called");
    const response = await fetch(
      "https://collab-express-production.up.railway.app/summarize-career-education",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    if (!response.ok) {
      throw new Error(`Server responded with a ${response.status} status.`);
    }
    const data = await response.json();
    console.log("streaming data:", data);
  } catch (error) {
    console.error("There was an error fetching the summary!", error);
  }
}

export function $buildRapportNode() {
  const session = useContext(SessionContext);
  const selection = getSelection();

  const icNode = $createParagraphNode();

  icNode.append($createTextNode("TEXT TEST"));

  return icNode;
  // const session = useSession();

  // socketStub.on("connect", () => {
  //   socketStub.emit("registerUser", session.user.id);
  // });

  // socketStub.on("responseChunk", (data) => {
  //   if (data.content === undefined || data.content.trim() === "") {
  //     console.log("Received undefined or empty content, ignoring.");
  //     return;
  //   }

  //   const textNode = $createTextNode(data.content);
  //   if ($isRootOrShadowRoot(textNode.getParentOrThrow())) {
  //     $wrapNodeInElement(textNode, $createParagraphNode).selectEnd();
  //   }
  // });
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
//   return root;
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
