import React from "react";
import { useState, useEffect, useReducer } from "react";
import { Box, Center, Stack, StackDivider } from "@chakra-ui/react";
import { supabase } from "../supabase/clientapp";
import { useParams } from "react-router-dom";
import Member from "./MemberForMemberStack";

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

const TeamMemberStack = ({
  handleAttendeeCheckboxChange,
  attendeeIsChecked,
}) => {
  const [members, setMembers] = useState([]);
  const [info, dispatch] = useReducer(infoReducer, {});
  const { workspace_id } = useParams();

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
          {members.map((member) => (
            <Member
              key={member.attendee_id}
              member={member}
              dispatch={dispatch}
              handleAttendeeCheckboxChange={handleAttendeeCheckboxChange}
              attendeeIsChecked={attendeeIsChecked}
            />
          ))}
        </Stack>
      </Box>
    </Center>
  );
};

export const MemoizedTeamMemberStack = React.memo(TeamMemberStack);
