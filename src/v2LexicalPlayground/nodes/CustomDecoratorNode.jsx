import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode } from "lexical";
import { $getNodeByKey } from "lexical/LexicalUtils";
import { DecoratorNode } from "lexical/nodes/LexicalDecoratorNode";
import { useEffect, useState } from "react";

export class CustomDecoratorNode extends DecoratorNode {
  decorate() {
    return (
      <CustomDecoratorNodeComponent uuid={this.__uuid} nodeKey={this.__key} />
    );
  }
}

export function $createCustomDecoratorNode(uuid) {
  return new CustomDecoratorNode(uuid);
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
