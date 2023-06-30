import {
  Box,
  Circle,
  Flex,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import {
  BiBuoy,
  BiCog,
  BiCommentAdd,
  BiCreditCard,
  BiEnvelope,
  BiHome,
  BiNews,
  BiPurchaseTagAlt,
  BiRecycle,
  BiRedo,
  BiUserCircle,
  BiWallet,
} from "react-icons/bi";
import { AccountSwitcher } from "./AccountSwitcher";
import { NavGroup } from "./NavGroup";
import { NavItem } from "./NavItem";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiCheckCircle } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export function NewApp() {
  return (
    <Box height='100vh' overflow='hidden' position='relative'>
      <Flex h='full' id='app-container'>
        <Box w='64' bg='blue.400' color='white' fontSize='md'>
          <Flex h='full' direction='column' px='4' py='4'>
            <AccountSwitcher />
            <Stack spacing='8' flex='1' overflow='auto' pt='8'>
              <Stack spacing='1'>
                <NavLink to='/dashboard'>
                  <NavItem active icon={<HamburgerIcon />} label='Dashboard' />
                </NavLink>
                {/* <NavItem icon={<FiCheckCircle />} label='Master ToDo List' /> */}
              </Stack>
              {/* <NavGroup label='Your Accounts'>
                <NavItem icon={<BiCreditCard />} label='Transactions' />
                <NavItem icon={<BiUserCircle />} label='Customers' />
                <NavItem icon={<BiWallet />} label='Income' />
                <NavItem icon={<BiRedo />} label='Transfer' />
              </NavGroup> */}

              <NavGroup label='Team & Settings'>
                <NavLink to='/dashboard/account'>
                  <NavItem icon={<BiNews />} label='Your Account' />
                </NavLink>
                {/* <NavItem icon={<BiEnvelope />} label='Your Team Members' />
                <NavItem
                  icon={<BiPurchaseTagAlt />}
                  label='Workspace Settings'
                />
                <NavItem icon={<BiRecycle />} label='Subscription' /> */}
              </NavGroup>
            </Stack>
            <Box>
              <Stack spacing='1'>
                <NavItem subtle icon={<BiCog />} label='Settings' />
                <NavItem
                  subtle
                  icon={<BiBuoy />}
                  label='Help & Support'
                  endElement={<Circle size='2' bg='blue.400' />}
                />
              </Stack>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
