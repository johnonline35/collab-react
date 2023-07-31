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
import { useParams } from "react-router-dom";

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

const TeamMemberStack = (
  isAttendeeChecked,
  handleAttendeeCheckboxChange,
  { workspace_id }
) => {
  const [members, setMembers] = useState([]);
  const [info, dispatch] = useReducer(infoReducer, {});
  const [isChecked, setIsChecked] = useState([]);
  // const { workspace_id } = useParams();

  useEffect(() => {
    if (!workspace_id) {
      return null; // Or replace with <Loading /> component
    }
    const fetchAttendees = async () => {
      console.log("fetchAttendees called");

      if (!workspace_id) {
        console.error("Invalid or missing parameters: workspace_id'");
        return;
      }

      const { data, error } = await supabase
        .from("attendees")
        .select("*")
        .eq("workspace_id", workspace_id);

      if (error) {
        console.error(error);
      } else {
        setMembers(data);
      }
    };

    fetchAttendees();
  }, [workspace_id]);

  const updateAttendee = async (id, updates) => {
    const { data, error } = await supabase
      .from("attendees")
      .update(updates)
      .eq("attendee_id", id);

    if (error) {
      console.error("Error updating attendee info:", error);
    }
  };

  function getLocationByUTCOffset(offset) {
    const timeZoneLocations = {
      "-12": "Baker Island",
      "-11": "Niue",
      "-10": "Honolulu",
      "-9": "Anchorage",
      "-8": "San Francisco",
      "-7": "Denver",
      "-6": "Chicago",
      "-5": "New York",
      "-4": "Santiago",
      "-3": "Buenos Aires",
      "-2": "Fernando de Noronha",
      "-1": "Azores",
      0: "London",
      1: "Paris",
      2: "Cairo",
      3: "Istanbul",
      4: "Dubai",
      5: "Karachi",
      6: "Dhaka",
      7: "Jakarta",
      8: "Singapore",
      9: "Seoul",
      10: "Sydney",
      11: "Noumea",
      12: "Auckland",
      13: "Apia",
      14: "Kiritimati",
    };

    return timeZoneLocations[offset.toString()] || "Unknown";
  }

  function getTimeWithLocation(timeString) {
    const [time, offsetString] = timeString.split("+");
    const date = new Date(`1970-01-01T${time}Z`);

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;

    const offset = parseInt(offsetString, 10);
    const location = getLocationByUTCOffset(offset);

    return {
      time: `${hours12.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`,
      location,
    };
  }

  function capitalizeFirstLetterOfEachWord(str) {
    if (str) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    } else {
      return "";
    }
  }

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
                  isChecked={isChecked.includes(member.attendee_id)}
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

export const MemoizedTeamMemberStack = React.memo(TeamMemberStack);

//             return (
//               <HStack key={member.attendee_id} alignItems='flex-start'>
//                 {/* <Checkbox position='relative' left='-40px' /> */}
//                 <Stack fontSize='sm' px='4' spacing='4'>
//                   <Stack direction='row' justify='space-between' spacing='4'>
//                     <HStack spacing='3'>
//                       <Avatar
//                         src={
//                           member.attendee_avatar ||
//                           "/images/custom/blue-avatar.jpeg"
//                         }
//                         boxSize='10'
//                         // name={displayName}
//                       >
//                         {/* <AvatarBadge
//                           boxSize='4'
//                           bg={
//                             member.workingHours === "yes"
//                               ? "green.500"
//                               : "red.500"
//                           }
//                         /> */}
//                       </Avatar>
//                       <Box>
//                         <Flex direction='row' justify='space-between'>
//                           <Editable
//                             fontSize='sm'
//                             onChange={handleNameChange}
//                             onSubmit={handleNameSubmit}
//                             defaultValue={capitalizeFirstLetterOfEachWord(
//                               displayName
//                             )}
//                           >
//                             <EditablePreview />
//                             <EditableInput />
//                           </Editable>
//                           {/* <Badge
//                             size='sm'
//                             colorScheme={
//                               member.status === "lead" ? "green" : null
//                             }
//                           >
//                             {member.status}
//                           </Badge> */}
//                         </Flex>
//                         {/* <Text color='muted'>{member.attendee_job_title}</Text> */}
//                         <Editable
//                           color='muted'
//                           fontSize='sm'
//                           onChange={handleJobTitleChange}
//                           onSubmit={handleJobTitleSubmit}
//                           defaultValue={capitalizeFirstLetterOfEachWord(
//                             displayTitle
//                           )}
//                         >
//                           <EditablePreview />
//                           <EditableInput />
//                         </Editable>
//                       </Box>
//                     </HStack>
//                     {/* <Text color='muted'>{member.lastSeen}</Text> */}
//                   </Stack>
//                   <Text
//                     color='muted'
//                     sx={{
//                       "-webkit-box-orient": "vertical",
//                       "-webkit-line-clamp": "2",
//                       overflow: "hidden",
//                       display: "-webkit-box",
//                     }}
//                   >
//                     {/* Current Time: {time} {location} <br /> */}
//                     {/* Email: {member.attendee_email} */}
//                     <Editable
//                       fontSize='sm'
//                       // onChange={handleEmailChange}
//                       // onSubmit={handleEmailSubmit}
//                       isDisabled
//                       defaultValue={member.attendee_email}
//                     >
//                       <EditablePreview />
//                       <EditableInput />
//                     </Editable>
//                   </Text>
//                 </Stack>
//               </HStack>
//             );
//           })}
//         </Stack>
//       </Box>
//     </Center>
//   );
// };
