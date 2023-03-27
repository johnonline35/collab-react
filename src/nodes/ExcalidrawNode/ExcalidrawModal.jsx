import "./ExcalidrawModal.css";

import { Excalidraw } from "@excalidraw/excalidraw";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Button from "../../LexcialUI/Button";
import Modal from "../../LexcialUI/Modal";

export default function ExcalidrawModal({
  closeOnClickOutside = false,
  onSave,
  initialElements,
  isShown = false,
  onDelete,
}) {
  const excaliDrawModelRef = useRef(null);

  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [elements, setElements] = useState(initialElements);

  useEffect(() => {
    if (excaliDrawModelRef.current !== null) {
      excaliDrawModelRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement = null;

    const clickOutsideHandler = (event) => {
      const target = event.target;
      if (
        excaliDrawModelRef.current !== null &&
        !excaliDrawModelRef.current.contains(target) &&
        closeOnClickOutside
      ) {
        onDelete();
      }
    };

    if (excaliDrawModelRef.current !== null) {
      modalOverlayElement = excaliDrawModelRef.current?.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement?.addEventListener("click", clickOutsideHandler);
      }
    }

    return () => {
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener("click", clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onDelete]);

  useLayoutEffect(() => {
    const currentModalRef = excaliDrawModelRef.current;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onDelete();
      }
    };

    if (currentModalRef !== null) {
      currentModalRef.addEventListener("keydown", onKeyDown);
    }

    return () => {
      if (currentModalRef !== null) {
        currentModalRef.removeEventListener("keydown", onKeyDown);
      }
    };
  }, [elements, onDelete]);

  const save = () => {
    if (elements.filter((el) => !el.isDeleted).length > 0) {
      onSave(elements);
    } else {
      // delete node if the scene is clear
      onDelete();
    }
  };

  const discard = () => {
    if (elements.filter((el) => !el.isDeleted).length === 0) {
      // delete node if the scene is clear
      onDelete();
    } else {
      //Otherwise, show confirmation dialog before closing
      setDiscardModalOpen(true);
    }
  };

  function ShowDiscardDialog() {
    return React.createElement(
      Modal,
      {
        title: "Discard",
        onClose: () => {
          setDiscardModalOpen(false);
        },
        closeOnClickOutside: true,
      },
      "Are you sure you want to discard the changes?",
      React.createElement(
        "div",
        {
          className: "ExcalidrawModal__discardModal",
        },
        React.createElement(
          Button,
          {
            onClick: () => {
              setDiscardModalOpen(false);
              onDelete();
            },
          },
          "Discard"
        ),
        " ",
        React.createElement(
          Button,
          {
            onClick: () => {
              setDiscardModalOpen(false);
            },
          },
          "Cancel"
        )
      )
    );
  }

  if (isShown === false) {
    return null;
  }

  const onChange = (els) => {
    setElements(els);
  };

  // This is a hacky work-around for Excalidraw + Vite.
  // In DEV, Vite pulls this in fine, in prod it doesn't. It seems
  // like a module resolution issue with ESM vs CJS?
  const _Excalidraw =
    Excalidraw.$$typeof != null ? Excalidraw : Excalidraw.default;

  return createPortal(
    React.createElement(
      "div",
      {
        className: "ExcalidrawModal__overlay",
        role: "dialog",
      },
      React.createElement(
        "div",
        {
          className: "ExcalidrawModal__modal",
          ref: excaliDrawModelRef,
          tabIndex: -1,
        },
        React.createElement(
          "div",
          {
            className: "ExcalidrawModal__row",
          },
          discardModalOpen && React.createElement(ShowDiscardDialog, null),
          React.createElement(_Excalidraw, {
            onChange: onChange,
            initialData: {
              appState: {
                isLoading: false,
              },
              elements: initialElements,
            },
          }),
          React.createElement(
            "div",
            {
              className: "ExcalidrawModal__actions",
            },
            React.createElement(
              "button",
              {
                className: "action-button",
                onClick: discard,
              },
              "Discard"
            ),
            React.createElement(
              "button",
              {
                className: "action-button",
                onClick: save,
              },
              "Save"
            )
          )
        )
      )
    ),
    document.body
  );
}
