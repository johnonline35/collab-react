import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  dispatch,
} from "react";
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
import { getTimeWithLocation } from "../utils/timeAndCapitalize";
import { updateAttendee } from "../utils/database";

const Member = React.memo(
  ({ member, handleAttendeeCheckboxChange, attendeeIsChecked, dispatch }) => {
    const { time, location } = getTimeWithLocation(member.attendee_timezone);

    const displayName = member.attendee_name || "Enter Name";
    const displayTitle = member.attendee_job_title || "Enter Title";

    const handleNameChange = useCallback(
      (value) => {
        dispatch({
          type: "updateInfo",
          id: member.attendee_id,
          update: { attendee_name: value },
        });
      },
      [dispatch, member]
    );

    const handleJobTitleChange = useCallback(
      (value) => {
        dispatch({
          type: "updateInfo",
          id: member.attendee_id,
          update: { attendee_job_title: value },
        });
      },
      [dispatch, member]
    );

    const handleNameSubmit = useCallback(
      async (value) => {
        await updateAttendee(member.attendee_id, { attendee_name: value });
        dispatch({
          type: "updateInfo",
          id: member.attendee_id,
          update: { attendee_name: value },
        });
      },
      [dispatch, member]
    );

    const handleJobTitleSubmit = useCallback(
      async (value) => {
        await updateAttendee(member.attendee_id, { attendee_job_title: value });
        dispatch({
          type: "updateInfo",
          id: member.attendee_id,
          update: { attendee_job_title: value },
        });
      },
      [dispatch, member]
    );

    return (
      <Stack w='100%' divider={<StackDivider />} spacing='4'>
        <Flex fontSize='sm' px='4' spacing='0.5' w='100%' alignItems='center'>
          <Checkbox
            isChecked={attendeeIsChecked.includes(member.attendee_id)}
            onChange={() => handleAttendeeCheckboxChange(member.attendee_id)}
            mr={5}
          />
          <Box w='100%'>
            <Flex justifyContent='space-between'>
              <Editable
                value={displayName}
                onChange={handleNameChange}
                onSubmit={handleNameSubmit}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
              <Text color='neutral.500'>{time}</Text>
            </Flex>
            <HStack spacing='1'>
              <Avatar
                size='xs'
                name={displayName}
                src={member.attendee_avatar_url}
              />
              <Editable
                value={displayTitle}
                onChange={handleJobTitleChange}
                onSubmit={handleJobTitleSubmit}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
              <Badge variant='subtle' colorScheme='yellow'>
                {location}
              </Badge>
            </HStack>
          </Box>
        </Flex>
      </Stack>
    );
  }
);

export default React.memo(Member);
