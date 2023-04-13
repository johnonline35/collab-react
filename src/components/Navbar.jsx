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
  Image,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  Link,
} from "@chakra-ui/react";
import { signout } from "../supabase/clientapp";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <Flex as='nav' p='0px' mb='20px' alignItems='center'>
      <Link href={`/dashboard`}>
        <Image src='/img/collablogo-removebg.png' height='40px' />
      </Link>
      <Spacer />

      <HStack spacing='20px'>
        <InputGroup maxW='xs'>
          <InputLeftElement pointerEvents='none' mr='30px'>
            <Icon as={FiSearch} color='muted' boxSize='5' />
          </InputLeftElement>
          <Input placeholder='Search' />
        </InputGroup>
        <Spacer />
        <Box bg='gray.200' p='10px'>
          <Text>Help?</Text>
        </Box>
        {/* <Box>
          <Text>John Childs-Eddy: Account</Text>
        </Box> */}
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
