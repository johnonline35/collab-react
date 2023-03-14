import { Flex, Text, Textarea } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageQuestions() {
  const params = useParams();

  return (
    <>
      <Flex>
        <Text>CollabPageQuestions for: {params.customer_id}</Text>
      </Flex>
    </>
  );
}
