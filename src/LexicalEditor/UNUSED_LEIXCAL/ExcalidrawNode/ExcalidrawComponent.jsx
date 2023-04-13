import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { $isExcalidrawNode } from "./index";
import ExcalidrawImage from "./ExcalidrawImage";
import ExcalidrawModal from "./ExcalidrawModal";
import ImageResizer from "../LexcialUI/ImageResizer";

export default function ExcalidrawComponent({ nodeKey, data }) {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setModalOpen] = useState(
    data === "[]" && editor.isEditable()
  );
  const imageContainerRef = useRef(null);
  const buttonRef = useRef(null);
  const captionButtonRef = useRef(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);

  const onDelete = useCallback(
    (event) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isExcalidrawNode(node)) {
            node.remove();
          }
          setSelected(false);
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey, setSelected]
  );

  useEffect(() => {
    if (isModalOpen) {
      editor.setEditable(false);
    } else {
      editor.setEditable(true);
    }
  }, [isModalOpen, editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          const buttonElem = buttonRef.current;
          const eventTarget = event.target;

          if (isResizing) {
            return true;
          }

          if (buttonElem !== null && buttonElem.contains(eventTarget)) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            if (event.detail > 1) {
              setModalOpen(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, isResizing, onDelete, setSelected]);

  const deleteNode = useCallback(() => {
    setModalOpen(false);
    return editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isExcalidrawNode(node)) {
        node.remove();
      }
    });
  }, [editor, nodeKey]);

  const setData = (newData) => {
    if (!editor.isEditable()) {
      return;
    }
    return editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isExcalidrawNode(node)) {
        if (newData.length > 0) {
          node.setData(JSON.stringify(newData));
        } else {
          node.remove();
        }
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const onResizeEnd = () => {
    setTimeout(() => {
      setIsResizing(false);
    }, 200);
  };
}
