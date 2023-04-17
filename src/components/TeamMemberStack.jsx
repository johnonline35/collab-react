import React from "react";
import { useState, useEffect, useReducer } from "react";
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
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import { supabase } from "../supabase/clientapp";

const infoReducer = (state, action) => {
  switch (action.type) {
    case "updateInfo":
      return {
        ...state,
        [action.id]: { ...state[action.id], ...action.update },
      };
    default:
      return state;
  }
};

const TeamMemberStack = () => {
  const [members, setMembers] = useState([]);
  const [info, dispatch] = useReducer(infoReducer, {});

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    console.log("fetchAttendees called"); // Add this line
    const { data, error } = await supabase.from("attendees").select("*");
    if (error) {
      console.error(error);
    } else {
      setMembers(data);
    }
  };

  const updateAttendee = async (id, updates) => {
    const { data, error } = await supabase
      .from("attendees")
      .update(updates)
      .eq("attendee_id", id);

    if (error) {
      console.error("Error updating attendee info:", error);
    }
  };

  return (
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
          {members.map((member) => {
            const handleNameChange = (value) => {
              dispatch({
                type: "updateInfo",
                id: member.attendee_id,
                update: { attendee_name: value },
              });
            };

            const handleJobTitleChange = (value) => {
              dispatch({
                type: "updateInfo",
                id: member.attendee_id,
                update: { attendee_job_title: value },
              });
            };

            const handleEmailChange = (value) => {
              dispatch({
                type: "updateInfo",
                id: member.attendee_id,
                update: { attendee_email: value },
              });
            };

            const handleNameSubmit = async (value) => {
              await updateAttendee(member.attendee_id, {
                attendee_name: value,
              });
              setMembers(
                members.map((m) =>
                  m.attendee_id === member.attendee_id
                    ? { ...m, attendee_name: value }
                    : m
                )
              );
            };

            const handleJobTitleSubmit = async (value) => {
              await updateAttendee(member.attendee_id, {
                attendee_job_title: value,
              });
              setMembers(
                members.map((m) =>
                  m.attendee_id === member.attendee_id
                    ? { ...m, attendee_job_title: value }
                    : m
                )
              );
            };

            const handleEmailSubmit = async (value) => {
              await updateAttendee(member.attendee_id, {
                attendee_email: value,
              });
              setMembers(
                members.map((m) =>
                  m.attendee_id === member.attendee_id
                    ? { ...m, attendee_email: value }
                    : m
                )
              );
            };

            return (
              <HStack key={member.attendee_id} alignItems='center'>
                <Checkbox position='relative' left='-40px' />
                <Stack fontSize='sm' px='4' spacing='4'>
                  <Stack direction='row' justify='space-between' spacing='4'>
                    <HStack spacing='3'>
                      <Avatar
                        src={member.attendee_avatar.headshot}
                        boxSize='10'
                      >
                        <AvatarBadge
                          boxSize='4'
                          bg={
                            member.workingHours === "yes"
                              ? "green.500"
                              : "red.500"
                          }
                        />
                      </Avatar>
                      <Box>
                        <Flex direction='row' justify='space-between'>
                          <Editable
                            fontSize='sm'
                            onChange={handleNameChange}
                            onSubmit={handleNameSubmit}
                            defaultValue={member.attendee_name}
                          >
                            <EditablePreview />
                            <EditableInput />
                          </Editable>
                          {/* <Badge
                            size='sm'
                            colorScheme={
                              member.status === "lead" ? "green" : null
                            }
                          >
                            {member.status}
                          </Badge> */}
                        </Flex>
                        {/* <Text color='muted'>{member.attendee_job_title}</Text> */}
                        <Editable
                          color='muted'
                          fontSize='sm'
                          onChange={handleJobTitleChange}
                          onSubmit={handleJobTitleSubmit}
                          defaultValue={member.attendee_job_title}
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
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
                    Current Time: {member.attendee_timezone} <br />
                    {/* Email: {member.attendee_email} */}
                    <Editable
                      fontSize='sm'
                      onChange={handleEmailChange}
                      onSubmit={handleEmailSubmit}
                      defaultValue={member.attendee_email}
                    >
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </Text>
                </Stack>
              </HStack>
            );
          })}
        </Stack>
      </Box>
    </Center>
  );
};

export const MemoizedTeamMemberStack = React.memo(TeamMemberStack);
