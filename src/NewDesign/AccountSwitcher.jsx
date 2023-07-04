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
import { useSession } from "../hooks/useSession";
import { useEffect, useState } from "react";
import { signout } from "../supabase/clientapp";
import { useNavigate } from "react-router-dom";

export const AccountSwitcher = () => {
  const [email, setEmail] = useState();
  const session = useSession();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!session) return;
    const { user } = session;
    setEmail(user.email);
  }, [session]);

  return (
    <Menu>
      <AccountSwitcherButton session={session} />
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
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
