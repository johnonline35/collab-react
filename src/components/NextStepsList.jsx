import { useState, useEffect, useCallback, useReducer } from "react";
import {
  Box,
  Center,
  Editable,
  EditablePreview,
  EditableTextarea,
  Stack,
  StackDivider,
  Text,
  Checkbox,
  IconButton,
  ListItem,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";
import { supabase } from "../supabase/clientapp";
import { useParams } from "react-router-dom";
import { FiCheck } from "react-icons/fi";

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

export const NextStepsList = ({
  isChecked,
  handleCheckboxChange,
  workspace_id,
}) => {
  const [nextSteps, setNextSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [info, dispatch] = useReducer(infoReducer, {});

  const fetchNextSteps = useCallback(async () => {
    setIsLoading(true); // set loading state to true before fetching data
    console.log("fetchNextSteps called");
    if (!workspace_id) {
      console.error("Invalid or missing workspace_id'");
      return;
    }

    const { data, error } = await supabase
      .from("collab_users_next_steps")
      .select("*")
      .eq("workspace_id", workspace_id)
      .neq("ignore", true);

    if (error) {
      console.error(error);
    } else {
      setNextSteps(data);
      setIsLoading(false); // set loading state to false after fetching data
    }
  }, [workspace_id]);

  useEffect(() => {
    fetchNextSteps();
  }, [fetchNextSteps]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const updateNextStep = async (id, updates) => {
    const { data, error } = await supabase
      .from("collab_users_next_steps")
      .update(updates)
      .eq("collab_user_next_steps_id", id);

    if (error) {
      console.error("Error updating next step info:", error);
    }
  };

  if (isLoading) {
    return <div style={{ marginBottom: "200px" }}></div>;
  }

  if (nextSteps.length === 0) {
    return (
      <ListItem mt='0px'>
        <Alert
          status='success'
          variant='subtle'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height='200px'
          bg='white'
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            Nothing to see here!
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            There is nothing here to do. Keep up the good work!
          </AlertDescription>
        </Alert>
      </ListItem>
    );
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
          {nextSteps.map((step) => (
            <Flex
              key={step.collab_user_next_steps_id}
              fontSize='sm'
              px='4'
              spacing='0.5'
              w='100%'
              alignItems='center'
            >
              <Checkbox
                isChecked={isChecked.includes(step.collab_user_next_steps_id)}
                onChange={() =>
                  handleCheckboxChange(step.collab_user_next_steps_id)
                }
                mr={5} // Add some margin to the right of the checkbox
              />
              <Stack w='100%'>
                <Editable
                  fontSize='sm'
                  fontWeight='medium'
                  color='emphasized'
                  w='100%'
                  onChange={(value) =>
                    dispatch({
                      type: "updateInfo",
                      id: step.collab_user_next_steps_id,
                      update: { nextstep_content: value },
                    })
                  }
                  onSubmit={async (value) => {
                    await updateNextStep(step.collab_user_next_steps_id, {
                      nextstep_content: value,
                    });
                    setNextSteps(
                      nextSteps.map((s) =>
                        s.collab_user_next_steps_id ===
                        step.collab_user_next_steps_id
                          ? { ...s, nextstep_content: value }
                          : s
                      )
                    );
                  }}
                  defaultValue={step.nextstep_content}
                >
                  <EditablePreview w='100%' />
                  <EditableTextarea w='100%' resize='none' />
                </Editable>
                <Text
                  color='subtle'
                  sx={{
                    "-webkit-box-orient": "vertical",
                    "-webkit-line-clamp": "2",
                    overflow: "hidden",
                    display: "-webkit-box",
                  }}
                >
                  {step.collab_user_next_steps_id && (
                    <>Next step created {formatDate(step.created_at)}</>
                  )}
                </Text>
              </Stack>
            </Flex>
          ))}
        </Stack>
      </Box>
    </Center>
  );
};
