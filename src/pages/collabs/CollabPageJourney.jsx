import {
  Box,
  SimpleGrid,
  Stack,
  ListIcon,
  ListItem,
  List,
  IconButton,
  CloseButton,
  Button,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { SlBadge } from "react-icons/sl";
import { FiCheck, FiCheckCircle, FiTarget } from "react-icons/fi";
import { TeamMemberStack } from "../../components/TeamMemberStack";
import { NextStepsList } from "../../components/NextStepsList";
import {
  AttachmentIcon,
  CalendarIcon,
  ChatIcon,
  DeleteIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";

import { TodoList } from "../../components/TodoList";
import { TimelineComponent } from "../../components/Timeline/TimelineComponent";
import { SortableListComponent } from "../../components/SortableList/SortableListComponent";
import { SortableListComponentChallenge } from "../../components/SortableList/SortableListComponentChallenge";
import { QandAComponent } from "../../components/Q&A/Q&AComponent";

export default function CollabPageHome() {
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
    <Stack
      spacing={{
        base: "8",
        lg: "6",
      }}
    >
      <Stack
        spacing='4'
        direction={{
          base: "column",
          lg: "row",
        }}
        justify='space-between'
      ></Stack>
      <Stack
        spacing={{
          base: "5",
          lg: "6",
        }}
      >
        <SimpleGrid
          columns={{
            base: 1,
            md: 3,
          }}
          gap='6'
        >
          <Card p='20px'>
            <List>
              <ListItem>
                <ListIcon as={SlBadge} color='black' />
                Goals
              </ListItem>
              <SortableListComponent />
              <ListItem>
                <Flex direction='row' justify='space-between'>
                  <Flex>
                    <ListIcon as={QuestionOutlineIcon} color='black' mt='5px' />
                    Challenges
                  </Flex>
                </Flex>
                <SortableListComponentChallenge />
              </ListItem>
            </List>
          </Card>
          <Card p='12px'>
            <List>
              <Flex direction='row' justify='space-between'>
                <ListItem mb='0px'>
                  <ListIcon as={CalendarIcon} color='black' />
                  Timeline
                </ListItem>
                {/* <Flex pr='10px' gap='2'>
                  <Button variant='secondary' size='sm'>
                    Book Meeting
                  </Button>
                  <Spacer />
                  <IconButton
                    size='sm'
                    variant='secondary'
                    icon={<DeleteIcon />}
                  />
                </Flex> */}
              </Flex>
              <TimelineComponent />
            </List>
          </Card>
          <Card p='12px'>
            <List>
              <Flex direction='row' justify='space-between'>
                <ListItem>
                  <ListIcon as={ChatIcon} color='black' />
                  Q&A Email Threads
                </ListItem>
                {/* <Flex pr='10px' gap='2'>
                  <Button variant='secondary' size='sm'>
                    Create Briefing Doc
                  </Button>
                  <Spacer />
                  <IconButton
                    size='sm'
                    variant='secondary'
                    icon={<FiCheck />}
                  />
                </Flex> */}
              </Flex>
              <QandAComponent />
            </List>
          </Card>
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
