import {
  Box,
  Flex,
  HStack,
  Img,
  useMenuButton,
  Spinner,
} from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";

import { SessionContext } from "../privateRoute";

import { supabase } from "../supabase/clientapp";
import React, { useEffect, useState, useContext } from "react";
import { useRecoilState } from "recoil";
import {
  avatarState,
  companyNameState,
  userNameState,
} from "../atoms/avatarAtom";

export const AccountSwitcherButton = ({ userId, ...otherProps }) => {
  const buttonProps = useMenuButton(otherProps);
  const [avatar, setAvatar] = useRecoilState(avatarState);
  const [userName, setUserName] = useRecoilState(userNameState);
  const [companyName, setCompanyName] = useRecoilState(companyNameState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("collab_users")
          .select("collab_user_avatar_url, collab_user_name, company_name")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        if (data) {
          setAvatar(data.collab_user_avatar_url); // Update Recoil state
          setUserName(data.collab_user_name);
          setCompanyName(data.company_name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, setAvatar, setCompanyName, setUserName]);

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
          <Box noOfLines={1} fontWeight='semibold' color='blue.100'>
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
