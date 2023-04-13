import {
  Avatar,
  AvatarBadge,
  Box,
  Badge,
  Center,
  HStack,
  Flex,
  Stack,
  StackDivider,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { members } from "./olddata";

export const TeamMemberStack = () => (
  <Center
    maxW='sm'
    mx='auto'
    py={{
      base: "4",
      md: "8",
    }}
  >
    <Box bg='bg-surface' py='4'>
      <Stack divider={<StackDivider />} spacing='4'>
        {members.map((member) => (
          <Stack key={member.id} fontSize='sm' px='4' spacing='4'>
            <Stack direction='row' justify='space-between' spacing='4'>
              <HStack spacing='3'>
                {/* <Checkbox /> */}
                <Avatar src={member.avatarUrl} boxSize='10'>
                  <AvatarBadge
                    boxSize='4'
                    bg={member.workingHours === "yes" ? "green.500" : "red.500"}
                  />
                </Avatar>
                <Box>
                  <Flex direction='row' justify='space-between'>
                    <Text fontWeight='medium' color='emphasized'>
                      {member.name}
                    </Text>
                    <Badge
                      size='sm'
                      colorScheme={member.status === "lead" ? "green" : null}
                    >
                      {member.status}
                    </Badge>
                  </Flex>

                  <Text color='muted'>{member.role}</Text>
                </Box>
              </HStack>
              <Text color='muted'>{member.lastSeen}</Text>
            </Stack>
            <Text
              color='muted'
              sx={{
                "-webkit-box-orient": "vertical",
                "-webkit-line-clamp": "2",
                overflow: "hidden",
                display: "-webkit-box",
              }}
            >
              Current Time: {member.localtime} <br />
              Email: {member.email}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Box>
  </Center>
);
