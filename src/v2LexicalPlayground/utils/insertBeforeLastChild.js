import { $getRoot } from "lexical";

export function insertBeforeLastChild(node) {
  const root = $getRoot();
  const lastChild = root.getLastChild();
  if (lastChild) {
    lastChild.insertBefore(node);
  } else {
    root.append(node);
  }
}
