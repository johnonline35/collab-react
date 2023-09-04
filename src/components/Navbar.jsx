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
import { useSession } from "../hooks/useSession";

export default function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();
  const session = useSession();

  return (
    <Flex as='nav' p='0px' mb='20px' alignItems='center'>
      <Link href={`/dashboard`}>
        <Image src='/img/collablogo-removebg.png' height='40px' />
      </Link>
      <Spacer />

      <HStack spacing='20px'>
        {/* <InputGroup maxW='xs'>
          <InputLeftElement pointerEvents='none' mr='30px'>
            <Icon as={FiSearch} color='muted' boxSize='5' />
          </InputLeftElement>
          <Input placeholder='Search' />
        </InputGroup>
        <Spacer />
        <Box bg='gray.200' p='10px'>
          <Text>Help?</Text>
        </Box> */}
        {/* <Box>
          <Text>John Childs-Eddy: Account</Text>
        </Box> */}
        <Button
          colorScheme='blue'
          onClick={() => {
            if (!session) {
              console.error("No session found");
              return;
            }

            const userId = session.user.id; // Access user id from the session.

            // First, stop the Google Calendar watch.
            fetch("/stop-google-calendar-watch", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId,
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Failed to stop Google Calendar watch.");
                }
                // Once that's done, sign out the user.
                return signout();
              })
              .then(() => {
                toast({
                  position: "top",
                  title: "Log out successful.",
                  description: "You have been logged out.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                // Finally, navigate to home.
                navigate("/");
              })
              .catch((error) => {
                // Handle any errors that occurred during the process.
                console.error("Error during the logout process:", error);
              });
          }}
        >
          Logout
        </Button>
        {/* <Button
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
        </Button> */}
      </HStack>
    </Flex>
  );
}
