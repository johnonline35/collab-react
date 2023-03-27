import {
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Text,
  Image,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { signInWithGoogle } from "../supabase/clientapp";

export default function Login() {
  return (
    <>
      <Flex height='100vh' alignItems='center' justifyContent='center'>
        <Flex direction='column' bg='gray.100' p={12} rounded={6}>
          <Text decoration='bold' fontSize='4xl' mb={6}>
            Login to your account
          </Text>
          <Flex direction='column' width='100%' mb={4}>
            <Button
              height='34px'
              border='1px solid'
              borderColor='gray.300'
              _hover={{
                bg: "gray.50",
              }}
              mb={2}
              // isLoading={loading}
              onClick={() => signInWithGoogle()}
            >
              <Image src='/img/googlelogo.png' height='20px' mr={4} />
              Continue with Google
            </Button>
          </Flex>
          <Input
            placeholder='email address'
            variant='filled'
            mb={3}
            type='email'
          />
          <Input
            placeholder='password'
            variant='filled'
            mb={6}
            type='password'
          />
          <Button colorScheme='blue'>Continue with email</Button>
          <Flex algin='center' justify='center' direction='row' p={5}>
            <NavLink style={{ marginRight: "2em" }} to='/privacy'>
              Privacy
            </NavLink>
            <NavLink to='/termsofservice'>Terms of Service</NavLink>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

// import {
//   Button,
//   Divider,
//   Flex,
//   Heading,
//   Input,
//   List,
//   ListItem,
//   Text,
// } from "@chakra-ui/react";
// import { NavLink } from "react-router-dom";

// export default function Login() {
//   return (
//     <>
//       <Flex height='100vh' alignItems='center' justifyContent='center'>
//         <Flex direction='column' bg='gray.100' p={12} rounded={6}>
//           <Heading mb={6}>Log in</Heading>
//           <Input
//             placeholder='name@email.com'
//             variant='filled'
//             mb={3}
//             type='email'
//           />
//           <Input
//             placeholder='password'
//             variant='filled'
//             mb={6}
//             type='password'
//           />
//           <Button colorScheme='blue'>Log in</Button>
//           <Flex textAlign='center' direction='row' p={5}>
//             <NavLink style={{ marginRight: "2em" }} to='/privacy'>
//               Privacy
//             </NavLink>
//             <NavLink to='/termsofservice'>Terms of Service</NavLink>
//           </Flex>
//         </Flex>
//       </Flex>
//     </>
//   );
// }
