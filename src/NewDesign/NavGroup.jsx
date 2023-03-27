import { Box, Stack, Text } from "@chakra-ui/react";

export const NavGroup = (props) => {
  const { label, children } = props;
  return (
    <Box>
      <Text
        px='3'
        fontSize='xs'
        fontWeight='semibold'
        textTransform='uppercase'
        letterSpacing='widest'
        color='white'
        mb='3'
      >
        {label}
      </Text>
      <Stack spacing='1'>{children}</Stack>
    </Box>
  );
};
