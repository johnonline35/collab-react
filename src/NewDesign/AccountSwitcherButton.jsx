import {
  Box,
  Flex,
  HStack,
  Img,
  useMenuButton,
  Spinner,
} from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";
import { useSession } from "../hooks/useSession";
import { supabase } from "../supabase/clientapp";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  avatarState,
  companyNameState,
  userNameState,
} from "../atoms/avatarAtom";

export const AccountSwitcherButton = (props) => {
  const buttonProps = useMenuButton(props);
  const [avatar, setAvatar] = useRecoilState(avatarState);

  const session = useSession();

  const [userName, setUserName] = useRecoilState(userNameState);
  const [companyName, setCompanyName] = useRecoilState(companyNameState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      const { user } = session;

      const { data, error } = await supabase
        .from("collab_users")
        .select("collab_user_avatar_url, collab_user_name, company_name")
        .eq("collab_user_email", user.email)
        .single();

      console.log("avatar data", data);

      if (data && !error) {
        setAvatar(data.collab_user_avatar_url); // Update Recoil state
        setUserName(data.collab_user_name);
        setCompanyName(data.company_name);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, setAvatar]);

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
        {loading ? (
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.400'
            size='md'
          />
        ) : (
          <Img
            w='8'
            h='8'
            rounded='md'
            objectFit='cover'
            src={avatar}
            alt={userName}
          />
        )}
        <Box textAlign='start'>
          <Box noOfLines={1} fontWeight='semibold'>
            {companyName}
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
