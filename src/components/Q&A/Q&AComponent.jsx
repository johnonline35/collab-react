import { Box, Center, Stack, StackDivider, Text } from "@chakra-ui/react";
import { posts } from "./data";

export const QandAComponent = () => (
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
          <Stack key={post.id} fontSize='sm' px='4' spacing='0.5'>
            <Box>
              <Text fontWeight='medium' color='emphasized'>
                {post.title}
              </Text>
              <Text color='subtle'>{post.id && <> {post.publishedAt}</>}</Text>
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
              {post.text}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Box>
  </Center>
);
