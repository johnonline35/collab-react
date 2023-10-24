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
import { AccountSwitcher } from "../NewDesign/AccountSwitcher";

export default function Navbar(user) {
  const navigate = useNavigate();
  const toast = useToast();
  const session = useSession();

  return (
    <Flex as='nav' p='0px' mb='20px' alignItems='center' width='100%'>
      <Link href={`/dashboard`}>
        <Image src='/img/collablogo-removebg-white.png' height='40px' />
      </Link>
      <Spacer />

      <HStack spacing='20px'>
        <AccountSwitcher />
      </HStack>
    </Flex>
  );
}

//   return (
//     <Flex as='nav' p='0px' mb='20px' alignItems='center'>
//       <Link href={`/dashboard`}>
//         <Image src='/img/collablogo-removebg.png' height='40px' />
//       </Link>
//       <Spacer />

//       <HStack spacing='20px'>
//         {/* <InputGroup maxW='xs'>
//           <InputLeftElement pointerEvents='none' mr='30px'>
//             <Icon as={FiSearch} color='muted' boxSize='5' />
//           </InputLeftElement>
//           <Input placeholder='Search' />
//         </InputGroup>
//         <Spacer />
//         <Box bg='gray.200' p='10px'>
//           <Text>Help?</Text>
//         </Box> */}
//         {/* <Box>
//           <Text>John Childs-Eddy: Account</Text>
//         </Box> */}
//         <Button
//           colorScheme='blue'
//           onClick={() => {
//             if (!session) {
//               console.error("No session found");
//               return;
//             }

//             const userId = session.user.id;

//             // First, try to stop the Google Calendar watch.
//             fetch(
//               "https://collab-express-production.up.railway.app/stop-google-calendar-watch",
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                   userId: userId,
//                 }),
//               }
//             )
//               .then((response) => {
//                 if (!response.ok) {
//                   // Log the error and proceed with the signout.
//                   console.error("Failed to stop Google Calendar watch.");
//                 }
//                 return;
//               })
//               .catch((error) => {
//                 // Log the error but continue with the logout process.
//                 console.error(
//                   "Error stopping the Google Calendar watch:",
//                   error
//                 );
//               })
//               .finally(() => {
//                 // Always sign out the user, regardless of previous errors.
//                 return signout();
//               })
//               .then(() => {
//                 // Show toast.
//                 toast({
//                   position: "top",
//                   title: "Log out successful.",
//                   description: "You have been logged out.",
//                   status: "success",
//                   duration: 5000,
//                   isClosable: true,
//                 });
//                 // Navigate to home.
//                 navigate("/");
//               })
//               .catch((error) => {
//                 // Handle any errors that occurred during the logout process.
//                 console.error("Error during the logout process:", error);
//               });
//           }}
//         >
//           Logout
//         </Button>
//       </HStack>
//     </Flex>
//   );
// }
