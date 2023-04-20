import { useState, useEffect, useCallback } from "react";
import { Box, Center, Stack, StackDivider, Text } from "@chakra-ui/react";
import { supabase } from "../supabase/clientapp";

export const NextStepsList = ({ workspace_id }) => {
  const [nextSteps, setNextSteps] = useState([]);

  const fetchNextSteps = useCallback(async () => {
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
          {nextSteps.map((step) => (
            <Stack
              key={step.collab_user_next_steps_id}
              fontSize='sm'
              px='4'
              spacing='0.5'
            >
              <Box>
                <Text fontWeight='medium' color='emphasized'>
                  {step.nextstep_content}
                </Text>
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
                {step.collab_user_next_steps_id && (
                  <>Next step created {formatDate(step.created_at)}</>
                )}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Center>
  );
};

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
