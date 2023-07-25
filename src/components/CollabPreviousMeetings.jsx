import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/clientapp";
import {
  Stack,
  StackDivider,
  Box,
  Flex,
  ListItem,
  ListIcon,
  Container,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const PreviousMeetings = () => {
  const params = useParams();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      let { data: meetings, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("workspace_id", params.workspace_id)
        .order("start_dateTime", { ascending: false });

      if (error) console.error("Error fetching meetings: ", error);
      else setMeetings(meetings);
    };

    fetchMeetings();
  }, [params.workspace_id]);

  return (
    <Box
      as='section'
      py={{
        base: "4",
        md: "8",
      }}
    >
      <Container maxW='3xl'>
        <Box
          bg='bg-surface'
          borderRadius='lg'
          p={{
            base: "4",
            md: "6",
          }}
        >
          <Stack spacing='5' divider={<StackDivider />}>
            <Stack spacing='1'>
              <Box>
                <Flex direction='column'>
                  {meetings.map((meeting) => (
                    <ListItem key={meeting.id}>
                      <ListIcon as={MdCheckCircle} color='green.500' />
                      {meeting.title}
                    </ListItem>
                  ))}
                </Flex>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PreviousMeetings;
