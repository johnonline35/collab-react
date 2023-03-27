import { Box, Flex, HStack, Img, useMenuButton } from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";

export const AccountSwitcherButton = (props) => {
  const buttonProps = useMenuButton(props);
  return (
    <Flex
      as='button'
      {...buttonProps}
      w='full'
      display='flex'
      alignItems='center'
      rounded='lg'
      bg='blue.300'
      px='3'
      py='2'
      fontSize='sm'
      userSelect='none'
      cursor='pointer'
      outline='0'
      transition='all 0.2s'
      _active={{
        bg: "blue.400",
      }}
      _focus={{
        shadow: "outline",
      }}
    >
      <HStack flex='1' spacing='3'>
        <Img
          w='8'
          h='8'
          rounded='md'
          objectFit='cover'
          src='/img/linkedin_profile.jpeg'
          alt='Chakra UI'
        />
        <Box textAlign='start'>
          <Box noOfLines={1} fontWeight='semibold'>
            Collab Inc.
          </Box>
          <Box fontSize='xs' color='blue.100'>
            John Childs-Eddy
          </Box>
        </Box>
      </HStack>
      <Box fontSize='lg' color='blue.100'>
        <HiSelector />
      </Box>
    </Flex>
  );
};
