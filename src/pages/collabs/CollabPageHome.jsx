import {
  Box,
  SimpleGrid,
  Stack,
  ListIcon,
  ListItem,
  List,
  Alert,
  AlertIcon,
  AlertTitle,
  IconButton,
  AlertDescription,
  CloseButton,
  Button,
  Flex,
  Spacer,
  Select,
  Editable,
  EditablePreview,
  EditableInput,
  Text,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase/clientapp";
import {
  FiCheck,
  FiCheckCircle,
  FiDribbble,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { MemoizedTeamMemberStack as TeamMemberStack } from "../../components/TeamMemberStack";
import { NextStepsList } from "../../components/NextStepsList";
import { ArrowRightIcon, AttachmentIcon, DeleteIcon } from "@chakra-ui/icons";
import { CollabWorkspaceSettings } from "../../components/CollabWorkspaceSettings";
import { ToDoList } from "../../components/TodoList";

export default function CollabPageHome() {
  console.log("Parent component rendering"); // Add this line
  const params = useParams();
  const [emailLink, setEmailLink] = useState();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const { workspace_id } = useParams();

  const getSupabaseData = async () => {
    const { data, error } = await supabase
      .from("collab_users")
      .select("*, workspaces(*)");

    if (error) {
      console.log(error);
    }

    console.log("Different log:", data);
  };

  const getEmailLinkStateAndName = async () => {
    const { data, error } = await supabase
      .from("workspaces")
      .select()
      .eq("workspace_id", params.workspace_id);

    setEmailLink(data[0].workspace_attendee_enable_calendar_link);
    setCustomerName(data[0].workspace_name);

    setLoadingToggle(false);
  };

  useEffect(() => {
    setLoadingToggle(true);
    getEmailLinkStateAndName();
    getSupabaseData();
  }, []);

  // useEffect(() => {
  //   console.log(customerName);
  // }, [customerName]);

  const handleCustomerNameChange = useCallback((value) => {
    setCustomerName(value);
  }, []);

  const updateEmailToggle = async () => {
    // console.log("toggle");
    const { data, error } = await supabase
      .from("workspaces")
      .update({ workspace_attendee_enable_calendar_link: !emailLink })
      .eq("workspace_id", params.workspace_id)
      .select();

    setEmailLink(data[0].workspace_attendee_enable_calendar_link);
  };

  const Card = (props) => (
    <Box
      minH='36'
      bg='bg-surface'
      boxShadow='sm'
      borderRadius='lg'
      {...props}
    />
  );

  return (
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
          <Card p='20px'>
            <List>
              <ListItem>
                <ListIcon as={FiSettings} color='black' />
                Settings for <Text as='b'>{customerName}</Text>
              </ListItem>
              <CollabWorkspaceSettings
                customerName={customerName}
                handleCustomerNameChange={handleCustomerNameChange}
                emailLink={emailLink}
                setEmailLink={setEmailLink}
                updateEmailToggle={updateEmailToggle}
                loadingToggle={loadingToggle}
                workspace_id={params.workspace_id}
              />
              <ListItem>
                <Flex direction='row' justify='space-between'>
                  <Flex>
                    <ListIcon as={FiDribbble} color='black' mt='5px' />
                    Momentum
                  </Flex>
                  <CloseButton />
                </Flex>
              </ListItem>

              <ListItem mt='20px'>
                <Alert
                  status='success'
                  variant='subtle'
                  flexDirection='column'
                  alignItems='center'
                  justifyContent='center'
                  textAlign='center'
                  height='200px'
                >
                  <AlertIcon boxSize='40px' mr={0} />
                  <AlertTitle mt={4} mb={1} fontSize='lg'>
                    Momentum is rolling!
                  </AlertTitle>
                  <AlertDescription maxWidth='sm'>
                    Momentum has been building with this customer recently. Keep
                    up the good work!
                  </AlertDescription>
                </Alert>
              </ListItem>
            </List>
          </Card>
          <Card p='12px'>
            <List>
              <Flex direction='row' justify='space-between'>
                <ListItem mb='0px'>
                  <ListIcon as={FiUsers} color='black' />
                  Customer Team
                </ListItem>
                <Flex pr='10px' gap='2'>
                  {/* <Button variant='secondary' size='sm'>
                    Display on Dashboard
                  </Button>

                  <Spacer />
                  <IconButton
                    size='sm'
                    variant='secondary'
                    icon={<DeleteIcon />}
                  /> */}
                </Flex>
              </Flex>
              <TeamMemberStack mt='0px' />
            </List>
          </Card>
          <Card p='12px'>
            <List>
              <Flex direction='row' justify='space-between'>
                <ListItem>
                  <ListIcon as={ArrowRightIcon} color='black' />
                  Next Steps
                </ListItem>
                <Flex pr='10px' gap='2'>
                  {/* <Button variant='secondary' size='sm'>
                    Create Briefing Doc
                  </Button> */}
                  <Spacer />
                  <IconButton
                    size='sm'
                    variant='secondary'
                    icon={<FiCheck />}
                  />
                </Flex>
              </Flex>
              <NextStepsList workspace_id={workspace_id} />
              <ListItem>
                <ListIcon as={FiCheckCircle} color='black' />
                Todo List
              </ListItem>
              <ToDoList workspace_id={workspace_id} />
            </List>
          </Card>
        </SimpleGrid>
      </Stack>
      <Card p='12px' minH='xs'>
        <List>
          <ListItem>
            <ListIcon as={AttachmentIcon} color='black' />
            All Attachments
          </ListItem>
        </List>
      </Card>
    </Stack>
  );
}
