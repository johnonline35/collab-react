import { useEffect } from "react";
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isLinkNode,
  $isRangeSelection,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode as $isLinkNodeFromLink } from "@lexical/link";

export default function ClickableLinkPlugin({ filter, newTab = true }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    function onClick(e) {
      const event = e;
      const linkDomNode = getLinkDomNode(event, editor);

      if (linkDomNode === null) {
        return;
      }

      const href = linkDomNode.getAttribute("href");

      if (
        linkDomNode.getAttribute("contenteditable") === "false" ||
        href === undefined
      ) {
        return;
      }

      const selection = editor.getEditorState().read($getSelection);
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        return;
      }

      let linkNode = null;
      editor.update(() => {
        const maybeLinkNode = $getNearestNodeFromDOMNode(linkDomNode);

        if ($isLinkNodeFromLink(maybeLinkNode)) {
          linkNode = maybeLinkNode;
        }
      });

      if (
        linkNode === null ||
        (filter !== undefined && !filter(event, linkNode))
      ) {
        return;
      }

      try {
        if (href !== null) {
          const isMiddle = event.type === "auxclick" && event.button === 1;
          window.open(
            href,
            newTab || event.metaKey || event.ctrlKey || isMiddle
              ? "_blank"
              : "_self"
          );
          event.preventDefault();
        }
      } catch {
        // It didn't work, which is better than throwing an exception!
      }
    }

    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener("click", onClick);
        prevRootElement.removeEventListener("auxclick", onClick);
      }

      if (rootElement !== null) {
        rootElement.addEventListener("click", onClick);
        rootElement.addEventListener("auxclick", onClick);
      }
    });
  }, [editor, filter, newTab]);
  return null;
}

function isLinkDomNode(domNode) {
  return domNode.nodeName.toLowerCase() === "a";
}

function getLinkDomNode(event, editor) {
  return editor.getEditorState().read(() => {
    const domNode = event.target;

    if (isLinkDomNode(domNode)) {
      return domNode;
    }

    if (domNode.parentNode && isLinkDomNode(domNode.parentNode)) {
      return domNode.parentNode;
    }

    return null;
  });
}
