import {
  Avatar,
  Badge,
  Center,
  chakra,
  CloseButton,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Reorder } from "framer-motion";
import { useState } from "react";
import { challengeIssues } from "./challengedata";

const List = chakra(Reorder.Group);
const ListItem = chakra(Reorder.Item);

export const SortableListComponentChallenge = () => {
  const [order, setOrder] = useState(() =>
    challengeIssues.map((issue) => issue.challenge_id)
  );
  return (
    <Center
      maxW='sm'
      mx='auto'
      py={{
        base: "4",
        md: "8",
      }}
    >
      <Stack spacing='5' flex='1'>
        {/* <Stack spacing='1'>
          <Text fontSize='lg' fontWeight='medium'>
            Sortable list
          </Text>
          <Text color='muted' fontSize='sm'>
            Grab a card and move it
          </Text>
        </Stack> */}
        <List values={order} onReorder={setOrder} listStyleType='none'>
          <Stack spacing='3' width='full'>
            {order
              .map((item) =>
                challengeIssues.find((value) => value.challenge_id === item)
              )
              .map((issue) =>
                issue ? (
                  <ListItem
                    key={issue.challenge_id}
                    value={issue.challenge_id}
                    bg='bg-surface'
                    p='4'
                    boxShadow='sm'
                    position='relative'
                    borderRadius='lg'
                    cursor='grab'
                    whileTap={{
                      cursor: "grabbing",
                      scale: 1.1,
                    }}
                  >
                    <Stack shouldWrapChildren spacing='4'>
                      <Flex direction='row' justify='space-between'>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          color='emphasized'
                        >
                          {issue.challenge_title}
                        </Text>
                        <CloseButton size='sm' />
                      </Flex>
                      <HStack justify='space-between'>
                        <Badge colorScheme={"red"} size='sm'>
                          {issue.challenge_type}
                        </Badge>
                        <HStack spacing='3'>
                          <Text
                            fontSize='xs'
                            color='subtle'
                            fontWeight='medium'
                          >
                            {issue.challenge_author.challenge_name}
                          </Text>
                          <Avatar
                            src={issue.challenge_author.challenge_avatarUrl}
                            name={issue.challenge_author.challenge_name}
                            boxSize='6'
                          />
                        </HStack>
                      </HStack>
                    </Stack>
                  </ListItem>
                ) : null
              )}
          </Stack>
        </List>
      </Stack>
    </Center>
  );
};
