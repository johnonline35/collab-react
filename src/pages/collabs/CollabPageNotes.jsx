import {
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Lexical
import "../../../src/styles.css";
import LexicalEditor from "../../LexcialEditor";

export default function CollabPage() {
  const params = useParams();

  return (
    <>
      {/* <Flex>
        <Text>CollabPage for: {params.customer_id}</Text>
      </Flex> */}
      <Flex minW='800px' mt='0px' justify='center'>
        <Flex mt='0px' justify='center' align='center' width='960px'>
          <LexicalEditor />
        </Flex>
      </Flex>
    </>
  );
}
