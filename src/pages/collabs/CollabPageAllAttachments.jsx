import { Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageAllAttachments() {
  const params = useParams();

  return (
    <>
      <Flex mb='20px'>
        <Text>All attachments of the Collab with {params.customer_id}</Text>
      </Flex>
      <Flex mb='20px'>
        <Text>
          This page will have a link to every attachment that has been sent via
          email between the collab user and the collab workspace attendee list.
        </Text>
      </Flex>
    </>
  );
}
