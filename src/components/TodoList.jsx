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
  Flex,
  Checkbox,
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

export const ToDoList = ({
  isChecked,
  handleCheckboxChange,
  toDoList,
  setToDoList,
  updateToDoList,
}) => {
  const [info, dispatch] = useReducer(infoReducer, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
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
          {toDoList.map((list) => (
            <Flex
              key={list.collab_user_todo_id}
              fontSize='sm'
              px='4'
              spacing='0.5'
              w='100%'
              alignItems='center'
            >
              <Checkbox
                isChecked={isChecked.includes(list.collab_user_todo_id)}
                onChange={() => handleCheckboxChange(list.collab_user_todo_id)}
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
                      id: list.collab_user_todo_id,
                      update: { todo_content: value },
                    })
                  }
                  onSubmit={async (value) => {
                    await updateToDoList(list.collab_user_todo_id, {
                      todo_content: value,
                    });
                    setToDoList(
                      toDoList.map((l) =>
                        l.collab_user_todo_id === list.collab_user_todo_id
                          ? { ...l, todo_content: value }
                          : l
                      )
                    );
                  }}
                  defaultValue={list.todo_content}
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
                  {list.collab_user_todo_id && (
                    <>Todo created {formatDate(list.created_at)}</>
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
