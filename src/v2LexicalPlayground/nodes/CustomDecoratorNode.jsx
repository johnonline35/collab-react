import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getNodeByKey, DecoratorNode } from "lexical";
import { useEffect, useState } from "react";

export class CustomDecoratorNode extends DecoratorNode {
  constructor(spanText = "", key) {
    super(key);
    this.__spanText = spanText;
  }

  static getType() {
    return "custom-decorator-node";
  }

  createDOM(config) {
    const div = document.createElement("div");
    return div;
  }

  updateDOM() {
    return false;
  }

  static importJSON(serializedNode) {
    const node = $createCustomDecoratorNode(serializedNode.uuid);
    node.__spanText = serializedNode.spanText;
    return node;
  }

  exportJSON() {
    return {
      uuid: this.__uuid,
      spanText: this.__spanText,
      type: CustomDecoratorNode.getType(),
      version: 1,
    };
  }

  static clone(node) {
    return new CustomDecoratorNode(node.__spanText, node.__key);
  }

  decorate() {
    return (
      <CustomDecoratorNodeComponent uuid={this.__uuid} nodeKey={this.__key} />
    );
  }
}

export function $createCustomDecoratorNode(uuid) {
  return new CustomDecoratorNode("", uuid);
}

function CustomDecoratorNodeComponent(props) {
  const [editor] = useLexicalComposerContext();
  const [spanText, setSpanText] = useState("");

  useEffect(() => {
    const delayedLoop = async (text) => {
      let count = 0;

      while (count < 5) {
        count++;
        const newSpanText = `${text}: ${count} `;
        setSpanText(newSpanText);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    delayedLoop("hello");

    const fetchData = async () => {
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
        /**
         * Append the text in the data object to the spanText state.
         * // props.onSpanTextChange(data.summary);
         */
        console.log("streaming data:", data);
      } catch (error) {
        console.error("There was an error fetching the summary!", error);
      }
    };

    // fetchData();
  }, []);

  useEffect(() => {
    // editor.update(() => {
    //   const currentNode = $getNodeByKey(props.nodeKey);
    //   const textNode = $createTextNode(spanText);
    //   currentNode && currentNode.replace(textNode);
    // });
  }, [spanText]);

  return <span spellCheck='false'>{spanText}</span>;
}

/**
 * import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getNodeByKey, DecoratorNode } from "lexical";
import { useEffect, useState } from "react";

export class CustomDecoratorNode extends DecoratorNode {
  constructor(spanText = "", key) {
    super(key);
    this.__spanText = spanText;
  }

  static getType() {
    return "custom-decorator-node";
  }

  static clone(node) {
    return new CustomDecoratorNode(node.__spanText, node.__key);
  }

  decorate() {
    return (
      <CustomDecoratorNodeComponent uuid={this.__uuid} nodeKey={this.__key} />
    );
  }
}

export function $createCustomDecoratorNode(uuid) {
  return new CustomDecoratorNode("", uuid);
}

function CustomDecoratorNodeComponent(props) {
  const [editor] = useLexicalComposerContext();
  const [spanText, setSpanText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  // useEffect for mimicking receiving a streaming response
  useEffect(() => {
    const delayedLoop = (text) => {
      let count = 0;

      const loop = () => {
        if (count < 5) {
          count++;
          setSpanText(`${text}: ${count} `);
          setTimeout(loop, 500);
        } else {
          setIsStreaming(false);
          return;
        }
      };

      loop();
    };

    delayedLoop("hello");
  }, []);

  useEffect(() => {
    if (isStreaming) {
      return;
    }

    editor.update(() => {
      const currentNode = $getNodeByKey(props.nodeKey);
      const textNode = $createTextNode(spanText);
      currentNode && currentNode.replace(textNode);
    });
  }, [isStreaming]);

  return <span spellCheck='false'>{spanText}</span>;
}

 */
