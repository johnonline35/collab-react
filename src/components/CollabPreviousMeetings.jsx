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
  Text,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { format, formatDistanceStrict } from "date-fns";

const PreviousMeetings = () => {
  const params = useParams();
  const [meetings, setMeetings] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        let { data, error } = await supabase
          .from("meetings")
          .select("*")
          .eq("workspace_id", params.workspace_id)
          .order('"start_dateTime"', { ascending: false });

        if (error) {
          console.error("Error fetching meetings: ", error);
          return;
        }

        console.log("Fetched meetings: ", data);
        setMeetings(data);
      } catch (error) {
        console.error("Exception caught while fetching meetings: ", error);
      }
    };

    console.log("Workspace ID: ", params.workspace_id);
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
                  {meetings.map((meeting) => {
                    const startDate = new Date(meeting.start_dateTime);
                    const endDate = new Date(meeting.end_dateTime);

                    const formattedStartDate = formatDate(
                      meeting.start_dateTime
                    );
                    const duration = formatDistanceStrict(endDate, startDate);

                    return (
                      <ListItem key={meeting.id}>
                        <Flex align='center'>
                          <ListIcon as={MdCheckCircle} color='green.500' />
                          <Text ml={2}>
                            Date: {formattedStartDate}. Duration: {duration}
                          </Text>
                        </Flex>
                      </ListItem>
                    );
                  })}
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
