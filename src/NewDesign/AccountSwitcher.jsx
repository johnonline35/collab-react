import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { AccountSwitcherButton } from "./AccountSwitcherButton";
import { SessionContext } from "../privateRoute";
import { useEffect, useState, useContext } from "react";
import { signout } from "../supabase/clientapp";
import { useNavigate } from "react-router-dom";

export const AccountSwitcher = ({ userId }) => {
  const [email, setEmail] = useState();
  // const session = useContext(SessionContext);
  const navigate = useNavigate();
  const toast = useToast();

  // useEffect(() => {
  //   if (!session) return;
  //   const { user } = session;
  //   setEmail(user.email);
  // }, [session]);

  return (
    <Menu>
      <AccountSwitcherButton userId={userId} />
      <MenuList
        shadow='lg'
        py='4'
        color={useColorModeValue("gray.900", "gray.200")}
        px='3'
      >
        <Text fontWeight='medium' mb='2'>
          {email}
        </Text>
        <MenuOptionGroup defaultValue='chakra-ui'>
          {/* <MenuItemOption value='chakra-ui' fontWeight='semibold' rounded='md'>
            Google Team
          </MenuItemOption>
          <MenuItemOption value='careerlyft' fontWeight='semibold' rounded='md'>
            Microsoft Team
          </MenuItemOption> */}
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem
          closeOnSelect='true'
          rounded='md'
          as='a'
          href='/dashboard/account'
        >
          Account settings
        </MenuItem>
        {/* <MenuItem closeOnSelect='true' rounded='md'>
          Add an account
        </MenuItem> */}
        <MenuDivider />
        <MenuItem
          closeOnSelect='true'
          rounded='md'
          onClick={() => {
            // if (!session) {
            //   console.error("No session found");
            //   return;
            // }

            // const userId = session.user.id;

            // First, try to stop the Google Calendar watch.
            fetch(
              "https://collab-express-production.up.railway.app/stop-google-calendar-watch",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: userId,
                }),
              }
            )
              .then((response) => {
                if (!response.ok) {
                  // Log the error and proceed with the signout.
                  console.error("Failed to stop Google Calendar watch.");
                }
                return;
              })
              .catch((error) => {
                // Log the error but continue with the logout process.
                console.error(
                  "Error stopping the Google Calendar watch:",
                  error
                );
              })
              .finally(() => {
                // Always sign out the user, regardless of previous errors.
                return signout();
              })
              .then(() => {
                // Show toast.
                toast({
                  position: "top",
                  title: "Log out successful.",
                  description: "You have been logged out.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                // Navigate to home.
                navigate("/");
              })
              .catch((error) => {
                // Handle any errors that occurred during the logout process.
                console.error("Error during the logout process:", error);
              });
          }}
          // onClick={() =>
          //   signout()
          //     .then(
          //       toast({
          //         position: "top",
          //         title: "Log out successful.",
          //         description: "You have been logged out.",
          //         status: "success",
          //         duration: 5000,
          //         isClosable: true,
          //       })
          //     )
          //     .then(() => navigate("/"))
          // }
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
