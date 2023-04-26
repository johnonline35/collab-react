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

export const ToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  const [info, dispatch] = useReducer(infoReducer, {});
  const { workspace_id } = useParams();

  const fetchToDos = useCallback(async () => {
    console.log("fetchToDos called");
    if (!workspace_id) {
      console.error("Invalid or missing workspace_id'");
      return;
    }

    const { data, error } = await supabase
      .from("collab_users_todos")
      .select("*")
      .eq("workspace_id", workspace_id);

    if (error) {
      console.error(error);
    } else {
      setToDoList(data);
      console.log(toDoList);
    }
  }, [workspace_id]);

  useEffect(() => {
    fetchToDos();
  }, [fetchToDos]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const updateToDoList = async (id, updates) => {
    const { data, error } = await supabase
      .from("collab_users_todos")
      .update(updates)
      .eq("collab_user_todo_id", id);

    if (error) {
      console.error("Error updating next step info:", error);
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
          {toDoList.map((list) => (
            <Stack
              key={list.collab_user_todo_id}
              fontSize='sm'
              px='4'
              spacing='0.5'
            >
              <Box>
                <Editable
                  fontSize='sm'
                  fontWeight='medium'
                  color='emphasized'
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
                      list.map((l) =>
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
              </Box>
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
          ))}
        </Stack>
      </Box>
    </Center>
  );
};
