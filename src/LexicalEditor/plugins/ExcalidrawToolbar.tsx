import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";

import "../nodes/ExcalidrawNode/ExcalidrawPluginCSS.css";
import { useState } from "react";

import { INSERT_EXCALIDRAW_COMMAND } from "../plugins/ExcalidrawPlugin";

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  return (
    <div className='toolbar'>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
        }}
        className={"toolbar-item spaced "}
      >
        <span className='text'>Insert Excalidraw</span>
      </button>
    </div>
  );
}
