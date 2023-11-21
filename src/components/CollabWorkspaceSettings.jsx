import {
  Box,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  Stack,
  StackDivider,
  Switch,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { supabase } from "../supabase/clientapp";

export const CollabWorkspaceSettings = ({
  customerName,
  handleCustomerNameChange,
  emailLink,
  setEmailLink,
  updateEmailToggle,
  loadingToggle,
  workspace_id,
}) => {
  // const [name, setName] = useState(customerName);

  // useEffect(() => {
  //   setName(customerName);
  // }, [customerName]);

  // const handleNameChange = (value) => {
  //   setName(value);
  // };

  // const handleNameSubmit = async (value) => {
  //   await updateWorkspaceName(value); // Call updateWorkspaceName function
  //   handleCustomerNameChange(value);
  // };

  // const updateWorkspaceName = async (newName) => {
  //   const { data, error } = await supabase
  //     .from("workspaces")
  //     .update({ workspace_name: newName })
  //     .eq("workspace_id", workspace_id);

  //   if (error) {
  //     console.error("Error updating workspace name:", error);
  //   }
  // };

  return (
    <Box
      as='section'
      py={{
        base: "4",
        md: "8",
      }}
    >
      <Container maxW='3xl'>
        <Box
          bg='bg-surface'
          borderRadius='lg'
          // p={{
          //   base: "4",
          //   md: "6",
          // }}
        >
          <Stack spacing='5' divider={<StackDivider />}>
            {/* <Stack spacing='1'>
              <Text fontSize='md' fontWeight='medium'>
                Edit Workspace Name:
              </Text>
              
              <Editable
                fontSize='md'
                color='muted'
                onChange={handleNameChange} // handle input changes
                onSubmit={handleNameSubmit} // update parent state when editing is finished
                value={name}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
            </Stack> */}
            <Stack justify='space-between' direction='row' spacing='4'>
              <Stack spacing='0.5' fontSize='sm'>
                <Text color='emphasized' fontWeight='medium'>
                  Calendar links
                </Text>
                <Text color='muted'>
                  Automatically add a collab space link into your calendar
                  invitations with the team from this workspace
                </Text>
              </Stack>
              {loadingToggle ? ( // Add this conditional rendering block
                <Spinner />
              ) : (
                <Switch isChecked={emailLink} onChange={updateEmailToggle} />
              )}
            </Stack>
            {/* <Stack justify='space-between' direction='row' spacing='4'>
              <Stack spacing='0.5' fontSize='sm'>
                <Text color='emphasized' fontWeight='medium'>
                  Your team
                </Text>
                <Text color='muted'>Add your team to this workspace</Text>
              </Stack>
              <Switch defaultChecked={true} />
            </Stack> */}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
