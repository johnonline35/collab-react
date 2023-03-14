import { Flex, Text, Textarea } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPage() {
  const params = useParams();

  return (
    <>
      <Flex>
        <Text>CollabPage for: {params.customer_id}</Text>
      </Flex>
      <Flex>
        <Textarea variant='unstyled' width='960px'></Textarea>
      </Flex>
    </>
  );
}
