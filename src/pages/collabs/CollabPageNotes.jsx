import {
  Flex,
  Text,
  Tabs,
  Tab,
  TabList,
  TabIndicator,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Lexical
import "../../../src/styles.css";
// import LexicalEditor from "../../LexcialEditor";
import PlaygroundApp from "../../v2LexicalPlayground/App";

import CollabPageHome from "./CollabPageHome";

export default function CollabPageNotes() {
  const params = useParams();
  console.log(params);

  return (
    <>
      <PlaygroundApp />
    </>
  );
}
