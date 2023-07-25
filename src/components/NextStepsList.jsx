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
  const [info, dispatch] = useReducer(infoReducer, {});

  const fetchNextSteps = useCallback(async () => {
    console.log("fetchNextSteps called");
    if (!workspace_id) {
      console.error("Invalid or missing workspace_id'");
      return;
    }

    const { data, error } = await supabase
      .from("collab_users_next_steps")
      .select("*")
      .eq("workspace_id", workspace_id);

    if (error) {
      console.error(error);
    } else {
      setNextSteps(data);
      console.log(nextSteps);
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
                mr={3} // Add some margin to the right of the checkbox
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

//   return (
//     <Center
//       maxW='sm'
//       mx='auto'
//       py={{
//         base: "4",
//         md: "8",
//       }}
//     >
//       <Box bg='bg-surface' py='4' w='100%'>
//         <Stack divider={<StackDivider />} spacing='4'>
//           {nextSteps.map((step) => (
//             <Stack
//               key={step.collab_user_next_steps_id}
//               fontSize='sm'
//               px='4'
//               spacing='0.5'
//               w='100%'
//             >
//               <Box>
//                 <Editable
//                   fontSize='sm'
//                   fontWeight='medium'
//                   color='emphasized'
//                   w='100%'
//                   onChange={(value) =>
//                     dispatch({
//                       type: "updateInfo",
//                       id: step.collab_user_next_steps_id,
//                       update: { nextstep_content: value },
//                     })
//                   }
//                   onSubmit={async (value) => {
//                     await updateNextStep(step.collab_user_next_steps_id, {
//                       nextstep_content: value,
//                     });
//                     setNextSteps(
//                       nextSteps.map((s) =>
//                         s.collab_user_next_steps_id ===
//                         step.collab_user_next_steps_id
//                           ? { ...s, nextstep_content: value }
//                           : s
//                       )
//                     );
//                   }}
//                   defaultValue={step.nextstep_content}
//                 >
//                   <EditablePreview w='100%' />
//                   <EditableTextarea w='100%' resize='none' />
//                 </Editable>
//               </Box>
//               <Text
//                 color='subtle'
//                 sx={{
//                   "-webkit-box-orient": "vertical",
//                   "-webkit-line-clamp": "2",
//                   overflow: "hidden",
//                   display: "-webkit-box",
//                 }}
//               >
//                 {step.collab_user_next_steps_id && (
//                   <>Next step created {formatDate(step.created_at)}</>
//                 )}
//               </Text>
//             </Stack>
//           ))}
//         </Stack>
//       </Box>
//     </Center>
//   );
// };

// LATEST BEFORE CHANGE

// import { useState, useEffect, useCallback } from "react";
// import { Box, Center, Stack, StackDivider, Text } from "@chakra-ui/react";
// import { supabase } from "../supabase/clientapp";

// export const NextStepsList = ({ workspace_id }) => {
//   const [nextSteps, setNextSteps] = useState([]);

//   const fetchNextSteps = useCallback(async () => {
//     const { data, error } = await supabase
//       .from("collab_users_next_steps")
//       .select("*")
//       .eq("workspace_id", workspace_id);

//     if (error) {
//       console.error(error);
//     } else {
//       setNextSteps(data);
//       console.log(nextSteps);
//     }
//   }, [workspace_id]);

//   useEffect(() => {
//     fetchNextSteps();
//   }, [fetchNextSteps]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       month: "long",
//       day: "2-digit",
//       year: "numeric",
//     }).format(date);
//   };

//   return (
//     <Center
//       maxW='sm'
//       mx='auto'
//       py={{
//         base: "4",
//         md: "8",
//       }}
//     >
//       <Box bg='bg-surface' py='4'>
//         <Stack divider={<StackDivider />} spacing='4'>
//           {nextSteps.map((step) => (
//             <Stack
//               key={step.collab_user_next_steps_id}
//               fontSize='sm'
//               px='4'
//               spacing='0.5'
//             >
//               <Box>
//                 <Text fontWeight='medium' color='emphasized'>
//                   {step.nextstep_content}
//                 </Text>
//               </Box>
//               <Text
//                 color='subtle'
//                 sx={{
//                   "-webkit-box-orient": "vertical",
//                   "-webkit-line-clamp": "2",
//                   overflow: "hidden",
//                   display: "-webkit-box",
//                 }}
//               >
//                 {step.collab_user_next_steps_id && (
//                   <>Next step created {formatDate(step.created_at)}</>
//                 )}
//               </Text>
//             </Stack>
//           ))}
//         </Stack>
//       </Box>
//     </Center>
//   );
// };

// OLDER VERSION

// export default NextStepsList;

// import { Box, Center, Stack, StackDivider, Text } from "@chakra-ui/react";
// import { posts } from "./listdata";

// export const NextStepsList = () => (
//   <Center
//     maxW='sm'
//     mx='auto'
//     py={{
//       base: "4",
//       md: "8",
//     }}
//   >
//     <Box bg='bg-surface' py='4'>
//       <Stack divider={<StackDivider />} spacing='4'>
//         {posts.map((post) => (
//           <Stack key={post.id} fontSize='sm' px='4' spacing='0.5'>
//             <Box>
//               <Text fontWeight='medium' color='emphasized'>
//                 {post.title}
//               </Text>
//             </Box>
//             <Text
//               color='muted'
//               sx={{
//                 "-webkit-box-orient": "vertical",
//                 "-webkit-line-clamp": "2",
//                 overflow: "hidden",
//                 display: "-webkit-box",
//               }}
//             >
//               {post.text}
//             </Text>
//             <Text color='subtle'>
//               {post.id && <>Next step agreed on {post.publishedAt}</>}
//             </Text>
//           </Stack>
//         ))}
//       </Stack>
//     </Box>
//   </Center>
// );
