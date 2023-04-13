import { Box, Center, Stack, StackDivider, Text } from "@chakra-ui/react";
import { posts } from "./listdata";

export const TodoList = () => (
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
        {posts.map((post) => (
          <Stack key={post.todo_id} fontSize='sm' px='4' spacing='0.5'>
            <Box>
              <Text fontWeight='medium' color='emphasized'>
                {post.todo_title}
              </Text>
              <Text color='subtle'>
                {post.todo_id && (
                  <>Target completion date {post.todo_target_date}</>
                )}
              </Text>
            </Box>
            <Text
              color='muted'
              sx={{
                "-webkit-box-orient": "vertical",
                "-webkit-line-clamp": "2",
                overflow: "hidden",
                display: "-webkit-box",
              }}
            >
              {post.todo_text}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Box>
  </Center>
);
