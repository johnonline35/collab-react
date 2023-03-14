import { Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageNextSteps() {
  const params = useParams();

  return (
    <>
      <Flex mb='20px'>
        <Text>CollabPage Next steps for: {params.customer_id}</Text>
      </Flex>
      <Flex mb='20px'>
        <Text>
          This page will replicate the information taken from notes that use
          @next, and will generate a new bullet item for each @next.
        </Text>
      </Flex>
    </>
  );
}
