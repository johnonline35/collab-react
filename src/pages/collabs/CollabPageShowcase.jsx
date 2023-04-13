import { Box, Flex, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import DisplayTeamCollabShowPage from "../../components/DisplayTeamCollabShowPage";
import { AttachmentIcon } from "@chakra-ui/icons";

// TODO: write all db api calls as this page will load in isolation

export default function CollabPageQuestions() {
  const params = useParams();

  const Card = (props) => (
    <Box
      minH='36'
      bg='bg-surface'
      boxShadow='sm'
      borderRadius='lg'
      {...props}
    />
  );

  return (
    <>
      {/* <Flex direction='column'>
        <Text mb={5}>
          Showcase page for {params.attendee_company_id} -- write the api calls
          for this page as it needs to hit supabase not use state.
        </Text>
        <Text mb={5}>
          The showcase page will be shown to an attendee when they click on a
          collab page calendar link.
        </Text>
        <Text mb={5}></Text>
      </Flex> */}
      <DisplayTeamCollabShowPage />
    </>
  );
}
