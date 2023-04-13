import { exportToSvg } from "@excalidraw/excalidraw";
// import {
//   ExcalidrawElement,
//   NonDeleted,
// } from "@excalidraw/excalidraw/types/element/types";
// import { AppState } from "@excalidraw/excalidraw/types/types";
import * as React from "react";
import { useEffect, useState } from "react";

// exportToSvg has fonts that need to be removed
const removeStyleFromSvg_HACK = (svg) => {
  const styleTag = svg.firstElementChild.firstElementChild;

  // Generated SVG is getting double-sized by height and width attributes
  // We want to match the real size of the SVG element
  const viewBox = svg.getAttribute("viewBox");
  if (viewBox != null) {
    const viewBoxDimensions = viewBox.split(" ");
    svg.setAttribute("width", viewBoxDimensions[2]);
    svg.setAttribute("height", viewBoxDimensions[3]);
  }

  if (styleTag && styleTag.tagName === "style") {
    styleTag.remove();
  }
};

/**
 * @explorer-desc
 * A component for rendering Excalidraw elements as a static image
 */
export default function ExcalidrawImage({
  elements,
  imageContainerRef,
  appState = null,
  rootClassName = null,
}) {
  const [Svg, setSvg] = useState < SVGElement;

  useEffect(() => {
    const setContent = async () => {
      const svg = await exportToSvg({
        elements,
        files: null,
      });
      removeStyleFromSvg_HACK(svg);

      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("display", "block");

      setSvg(svg);
    };
    setContent();
  }, [elements, appState]);

  return (
    <div
      ref={imageContainerRef}
      className={rootClassName ?? ""}
      dangerouslySetInnerHTML={{ __html: Svg.outerHTML ?? "" }}
    />
  );
}
