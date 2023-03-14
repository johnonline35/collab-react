import { Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageCurrentState() {
  const params = useParams();

  return (
    <>
      <Flex mb='20px'>
        <Text>Current State of the Collab with {params.customer_id}</Text>
      </Flex>
      <Flex mb='20px'>
        <Text>
          This page will have a simple component that lets the user designate
          the current state of the Collab. This will be a drop down that
        </Text>
      </Flex>
    </>
  );
}
