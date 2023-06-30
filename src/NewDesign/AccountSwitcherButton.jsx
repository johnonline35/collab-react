import { Box, Flex, HStack, Img, useMenuButton } from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";
import { supabase } from "../supabase/clientapp";
import { useEffect, useState } from "react";

export const AccountSwitcherButton = (props) => {
  const buttonProps = useMenuButton(props);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = supabase.auth.user();
      const { data, error } = await supabase
        .from("collab_users")
        .select("collab_user_avatar_url, collab_user_name")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setAvatarUrl(data.collab_user_avatar_url);
        setUserName(data.collab_user_name);
      }
    };

    fetchUserData();
  }, []);

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
          src={avatarUrl}
          alt='Chakra UI'
        />
        <Box textAlign='start'>
          <Box noOfLines={1} fontWeight='semibold'>
            Collab Inc.
          </Box>
          <Box fontSize='xs' color='blue.100'>
            {userName}
          </Box>
        </Box>
      </HStack>
      <Box fontSize='lg' color='blue.100'>
        <HiSelector />
      </Box>
    </Flex>
  );
};
