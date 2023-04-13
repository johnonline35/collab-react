import { Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  $getRoot,
  $getSelection,
  EditorState,
  setEditorState,
  $createTextNode,
  $createParagraphNode,
  createEditor,
} from "lexical";

// Lexical
import "../../../src/styles.css";
import LexicalEditor from "../../LexcialEditor";
import { useEffect } from "react";
import { supabase } from "../../supabase/clientapp";

export default function CollabPageNotes() {
  const params = useParams();
  console.log(params);

  return (
    <>
      <Flex minW='800px' mt='0px' justify='center'>
        <Flex mt='0px' justify='center' align='center' width='960px'>
          <LexicalEditor />
        </Flex>
      </Flex>
    </>
  );
}
