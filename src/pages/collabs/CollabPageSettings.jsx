import { useParams } from "react-router-dom";
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

export default function CollabPageSettings({
  customerName,
  handleCustomerNameChange,
  emailLink,
  setEmailLink,
  updateEmailToggle,
  loadingToggle,
  workspace_id,
}) {
  const params = useParams();
  console.log(params);

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
            <Card p='20px'>
              <List>
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
