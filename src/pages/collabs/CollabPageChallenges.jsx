import { Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageChallenges() {
  const params = useParams();

  return (
    <>
      <Flex mb='20px'>
        <Text>Challenges Page for: {params.customer_id}</Text>
      </Flex>
      <Flex mb='20px'>
        <Text>
          This page will replicate the information taken from notes that use
          @challenge, and will generate a new bullet item for each @challenge.
        </Text>
      </Flex>
    </>
  );
}
