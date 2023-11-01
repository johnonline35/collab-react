import {
  SimpleGrid,
  Stack,
  ListIcon,
  ListItem,
  List,
  Text,
  Card,
} from "@chakra-ui/react";
import { CollabWorkspaceSettings } from "../../components/CollabWorkspaceSettings";
import { FiSettings } from "react-icons/fi";

export default function CollabPageSettings({
  customerName,
  handleCustomerNameChange,
  emailLink,
  setEmailLink,
  updateEmailToggle,
  loadingToggle,
  workspace_id,
}) {
  return (
    <>
      <Stack
        spacing={{
          base: "8",
          lg: "6",
        }}
      >
        <Stack
          spacing='4'
          direction={{
            base: "column",
            lg: "row",
          }}
          justify='space-between'
        ></Stack>
        <Stack
          spacing={{
            base: "5",
            lg: "6",
          }}
        >
          <SimpleGrid
            columns={{
              base: 1,
              md: 3,
            }}
            gap='6'
          >
            {/* *pl='20px' pr='20px' pb='20px' */}
            <Card p='5px' minH='lg'>
              <List>
                {/* <ListItem fontSize='xl' fontWeight='bold'>
                  <ListIcon as={FiSettings} color='black' boxSize='24px' />
                  Settings for <Text as='b'>{customerName}</Text>
                </ListItem> */}
                <CollabWorkspaceSettings
                  customerName={customerName}
                  handleCustomerNameChange={handleCustomerNameChange}
                  emailLink={emailLink}
                  setEmailLink={setEmailLink}
                  updateEmailToggle={updateEmailToggle}
                  loadingToggle={loadingToggle}
                  workspace_id={workspace_id}
                />
              </List>
            </Card>
          </SimpleGrid>
        </Stack>
      </Stack>
    </>
  );
}
