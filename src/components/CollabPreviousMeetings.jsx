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

const PreviousMeetings = ({ meetings }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getDuration = (startDate, endDate) => {
    const differenceInMilliseconds = endDate - startDate;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const hours = Math.floor(differenceInSeconds / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes} min${minutes > 1 ? "s" : ""}`;
    } else if (minutes === 0) {
      return `${hours} hr${hours > 1 ? "s" : ""}`;
    } else {
      return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${
        minutes > 1 ? "s" : ""
      }`;
    }
  };

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

                    const formattedStartDate = formatDate(startDate);
                    const duration = getDuration(startDate, endDate);

                    return (
                      <ListItem key={meeting.id}>
                        <Flex align='center'>
                          <ListIcon as={MdCheckCircle} color='blue.400' />
                          <Text ml={2}>Date: {formattedStartDate}.</Text>
                          {/* Duration: {duration} */}
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
