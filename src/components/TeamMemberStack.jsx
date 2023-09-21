import { useReducer } from "react";
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

import {
  getTimeWithLocation,
  capitalizeFirstLetterOfEachWord,
} from "../util/timeAndCapitalize";

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

export const TeamMemberStack = ({
  handleAttendeeCheckboxChange,
  attendeeIsChecked,
  members,
  setMembers,
}) => {
  const [info, dispatch] = useReducer(infoReducer, {});

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
      <Box bg='bg-surface' py='4' w='100%'>
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

            const { time, location } = getTimeWithLocation(
              member.attendee_timezone
            );

            const displayName = member.attendee_name || "Enter Name";
            const displayTitle = member.attendee_job_title || "Enter Title";

            return (
              <Flex
                key={member.attendee_id}
                fontSize='sm'
                px='4'
                spacing='0.5'
                w='100%'
                alignItems='center'
              >
                <Checkbox
                  isChecked={attendeeIsChecked.includes(member.attendee_id)}
                  onChange={() =>
                    handleAttendeeCheckboxChange(member.attendee_id)
                  }
                  mr={5} // Add some margin to the right of the checkbox
                />
                <Stack w='100%'>
                  <HStack alignItems='flex-start'>
                    <Stack fontSize='sm' px='4' spacing='4'>
                      <Stack
                        direction='row'
                        justify='space-between'
                        spacing='4'
                      >
                        <HStack spacing='3'>
                          <Avatar
                            src={
                              member.attendee_avatar ||
                              "/images/custom/blue-avatar.jpeg"
                            }
                            boxSize='10'
                          ></Avatar>
                          <Box>
                            <Flex direction='row' justify='space-between'>
                              <Editable
                                fontSize='sm'
                                onChange={handleNameChange}
                                onSubmit={handleNameSubmit}
                                defaultValue={capitalizeFirstLetterOfEachWord(
                                  displayName
                                )}
                              >
                                <EditablePreview />
                                <EditableInput />
                              </Editable>
                              {member.attendee_is_workspace_lead === true && (
                                <Badge
                                  size='sm'
                                  // fontSize='0.4em'
                                  colorScheme='green'
                                >
                                  Lead
                                </Badge>
                              )}
                            </Flex>
                            <Editable
                              color='muted'
                              fontSize='sm'
                              onChange={handleJobTitleChange}
                              onSubmit={handleJobTitleSubmit}
                              defaultValue={capitalizeFirstLetterOfEachWord(
                                displayTitle
                              )}
                            >
                              <EditablePreview />
                              <EditableInput />
                            </Editable>
                          </Box>
                        </HStack>
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
                        <Editable
                          fontSize='sm'
                          isDisabled
                          defaultValue={member.attendee_email}
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </Text>
                    </Stack>
                  </HStack>
                </Stack>
              </Flex>
            );
          })}
        </Stack>
      </Box>
    </Center>
  );
};
