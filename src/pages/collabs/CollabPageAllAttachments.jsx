import { Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageAllAttachments() {
  const params = useParams();

  return (
    <>
      <Flex>
        <Text>CollabPageAllAttachments for: {params.customer_id}</Text>
      </Flex>
    </>
  );
}
