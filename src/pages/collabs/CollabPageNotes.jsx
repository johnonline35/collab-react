import { Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Lexical
import "../../../src/styles.css";
// import LexicalEditor from "../../LexcialEditor";
import PlaygroundApp from "../../v2LexicalPlayground/App";

export default function CollabPageNotes() {
  const params = useParams();
  console.log(params);

  return (
    <>
      <PlaygroundApp />
    </>
  );
}
