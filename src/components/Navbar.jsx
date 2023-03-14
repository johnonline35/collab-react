import { UnlockIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Spacer,
  HStack,
  useToast,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { signout } from "../supabase/clientapp";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();

  const showToast = () => {
    toast({
      title: "Logged out",
      description: "Successfully logged out",
      duration: 5000,
      isClosable: true,
      status: "success",
      position: "top",
      icon: <UnlockIcon />,
    });
  };

  return (
    <Flex as='nav' p='10px' mb='40px' alignItems='center'>
      <Heading as='h1'>Collab</Heading>
      <Spacer />

      <HStack spacing='20px'>
        <Box bg='gray.200' p='10px'>
          <Text>Help?</Text>
        </Box>
        {/* <Avatar name='John' src='/img/mario.png'>
          <AvatarBadge width='1.3em' bg='red.500'>
            <Text fontSize='xs' color='white'>
              3
            </Text>
          </AvatarBadge>
        </Avatar> */}
        <Text>John Childs-Eddy: Account</Text>
        <Button
          colorScheme='blue'
          onClick={() =>
            signout()
              .then(
                toast({
                  position: "top",
                  title: "Log out successful.",
                  description: "You have been logged out.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                })
              )
              .then(() => navigate("/"))
          }
        >
          Logout
        </Button>
      </HStack>
    </Flex>
  );
}
