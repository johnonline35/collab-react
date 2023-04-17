import { Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Lexical
import "../../../src/styles.css";
import LexicalEditor from "../../LexcialEditor";

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
