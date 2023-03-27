import { Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import DisplayTeamCollabShowPage from "../../components/DisplayTeamCollabShowPage";

// TODO: write all db api calls as this page will load in isolation

export default function CollabPageQuestions() {
  const params = useParams();

  return (
    <>
      <Flex direction='column'>
        <Text mb={5}>
          Showcase page -- write the api calls for this page as it needs to hit
          supabase not use state.
        </Text>
        <Text mb={5}>
          The showcase page will be shown to an attendee when they click on a
          collab page calendar link.
        </Text>
        <Text mb={5}></Text>
      </Flex>
      <DisplayTeamCollabShowPage />
    </>
  );
}
