/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

type CaretPositionFromPointDocument = {
  caretPositionFromPoint(
    x: number,
    y: number
  ): {
    offsetNode: Node;
    offset: number;
  } | null;
};

export default function caretFromPoint(
  x: number,
  y: number
): null | {
  offset: number;
  node: Node;
} {
  const doc = document as Document & CaretPositionFromPointDocument;

  if (typeof doc.caretRangeFromPoint !== "undefined") {
    const range = doc.caretRangeFromPoint(x, y);
    if (range === null) {
      return null;
    }
    return {
      node: range.startContainer,
      offset: range.startOffset,
    };
  } else if (typeof doc.caretPositionFromPoint !== "undefined") {
    const range = doc.caretPositionFromPoint(x, y);
    if (range === null) {
      return null;
    }
    return {
      node: range.offsetNode,
      offset: range.offset,
    };
  } else {
    // Gracefully handle IE
    return null;
  }
}

// ORIGINAL FACEBOOK CODE UNALTERED
// export default function caretFromPoint(
//   x: number,
//   y: number,
// ): null | {
//   offset: number;
//   node: Node;
// } {
//   if (typeof document.caretRangeFromPoint !== 'undefined') {
//     const range = document.caretRangeFromPoint(x, y);
//     if (range === null) {
//       return null;
//     }
//     return {
//       node: range.startContainer,
//       offset: range.startOffset,
//     };
//     // @ts-ignore
//   } else if (document.caretPositionFromPoint !== 'undefined') {
//     // @ts-ignore FF - no types
//     const range = document.caretPositionFromPoint(x, y);
//     if (range === null) {
//       return null;
//     }
//     return {
//       node: range.offsetNode,
//       offset: range.offset,
//     };
//   } else {
//     // Gracefully handle IE
//     return null;
//   }
// }
