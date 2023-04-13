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
import { issues } from "./data";
const List = chakra(Reorder.Group);
const ListItem = chakra(Reorder.Item);

export const SortableListComponent = () => {
  const [order, setOrder] = useState(() => issues.map((issue) => issue.id));
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
              .map((item) => issues.find((value) => value.id === item))
              .map((issue) =>
                issue ? (
                  <ListItem
                    key={issue.id}
                    value={issue.id}
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
                          {issue.title}
                        </Text>
                        <CloseButton size='sm' />
                      </Flex>
                      <HStack justify='space-between'>
                        <Badge colorScheme={"green"} size='sm'>
                          {issue.type}
                        </Badge>
                        <HStack spacing='3'>
                          <Text
                            fontSize='xs'
                            color='subtle'
                            fontWeight='medium'
                          >
                            {issue.author.name}
                          </Text>
                          <Avatar
                            src={issue.author.avatarUrl}
                            name={issue.author.name}
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
