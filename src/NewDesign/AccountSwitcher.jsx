import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AccountSwitcherButton } from "./AccountSwitcherButton";
import { useSession } from "../hooks/useSession";
import { useEffect, useState } from "react";

export const AccountSwitcher = () => {
  const [email, setEmail] = useState();
  const session = useSession();

  useEffect(() => {
    if (!session) return;
    const { user } = session;
    setEmail(user.email);
  }, [session]);

  return (
    <Menu>
      <AccountSwitcherButton />
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
        {/* <MenuDivider />
        <MenuItem rounded='md'>Workspace settings</MenuItem>
        <MenuItem rounded='md'>Add an account</MenuItem>
        <MenuDivider /> */}
        <MenuItem rounded='md'>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};
