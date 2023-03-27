import { Flex, Text, Textarea } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageQuestions() {
  const params = useParams();

  return (
    <>
      <Flex mb='20px'>
        <Text>
          All questions and answers of the Collab with{" "}
          {params.attendee_company_id}
        </Text>
      </Flex>
      <Flex mb='20px'>
        <Text>
          This page will list every question and answer email thread using #q to
          nest the emails on this page
        </Text>
      </Flex>
    </>
  );
}
