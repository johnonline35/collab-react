import { useState, useEffect } from "react";
import {
  Stack,
  StackDivider,
  Box,
  Flex,
  ListItem,
  ListIcon,
  Container,
  Text,
  Link,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

export default function PreviousMeetings({
  workspace_id,
  customerName,
  meetingsNotes,
}) {
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
                  {meetingsNotes.map((meetingNote) => {
                    const startDate = new Date(meetingNote.start_dateTime);
                    const endDate = new Date(meetingNote.end_dateTime);

                    const formattedStartDate = formatDate(startDate);
                    const duration = getDuration(startDate, endDate);

                    return (
                      <ListItem key={meetingNote.id}>
                        <Flex align='center'>
                          <ListIcon as={MdCheckCircle} color='blue.400' />
                          <ChakraLink
                            as={ReactRouterLink}
                            to={`/collabs/${workspace_id}/${meetingNote.collab_user_note_id}`}
                            customerName={customerName}
                          >
                            {formattedStartDate}
                          </ChakraLink>

                          {/* <Text ml={2}>Date: {formattedStartDate}.</Text> */}

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
}
