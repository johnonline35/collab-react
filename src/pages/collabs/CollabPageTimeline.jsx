import { Flex, Text, Textarea } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageTimeline() {
  const params = useParams();

  return (
    <>
      <Flex>
        <Text>CollabPageTimeline for: {params.customer_id}</Text>
      </Flex>
    </>
  );
}
