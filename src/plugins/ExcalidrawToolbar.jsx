import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";

import "../styles.css";
import { useState } from "react";

import { INSERT_EXCALIDRAW_COMMAND } from "./ExcalidrawPlugin";

export default function ExcalidrawToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  return (
    <div className='excalidraw-toolbar'>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
        }}
        className={"excalidraw-toolbar-item spaced "}
      >
        <span className='excalidraw-text'>Insert Diagram</span>
      </button>
    </div>
  );
}
