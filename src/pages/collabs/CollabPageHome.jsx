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
  useToast,
  Container,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../supabase/clientapp";
import {
  FiCheck,
  FiCheckCircle,
  FiDribbble,
  FiSettings,
  FiUsers,
  FiArchive,
} from "react-icons/fi";
import { MdCheckCircle, MdSettings } from "react-icons/md";
import { AiOutlineFolder } from "react-icons/ai";
import { MemoizedTeamMemberStack as TeamMemberStack } from "../../components/TeamMemberStack";
import { NextStepsList } from "../../components/NextStepsList";
import { ArrowRightIcon, AttachmentIcon, DeleteIcon } from "@chakra-ui/icons";
import { CollabWorkspaceSettings } from "../../components/CollabWorkspaceSettings";
import { ToDoList } from "../../components/TodoList";
import { Dropzone } from "../../components/Dropzone";
import PreviousMeetings from "../../components/CollabPreviousMeetings";

export default function CollabPageHome() {
  const params = useParams();
  const [emailLink, setEmailLink] = useState();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const { workspace_id } = useParams();
  const workspace_id_memo = useMemo(() => workspace_id, [workspace_id]);
  const [isChecked, setIsChecked] = useState([]);
  const [attendeeIsChecked, setAttendeeIsChecked] = useState([]);
  const toast = useToast();

  const handleCheckboxChange = (id) => {
    setIsChecked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((e) => e !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAttendeeCheckboxChange = (attendeeId) => {
    if (attendeeIsChecked.includes(attendeeId)) {
      // If the attendee is currently checked, remove them from the array
      setAttendeeIsChecked(attendeeIsChecked.filter((id) => id !== attendeeId));
    } else {
      // If the attendee is not currently checked, add them to the array
      setAttendeeIsChecked([...attendeeIsChecked, attendeeId]);
    }
  };

  const handleCheckClick = async (type) => {
    console.log("Tick icon pressed", isChecked);
    // Loop over the isChecked array and update each entry
    for (const id of isChecked) {
      let tableName;
      let matchIdName;

      if (type === "nextSteps") {
        tableName = "collab_users_next_steps";
        matchIdName = "collab_user_next_steps_id";
      } else if (type === "todo") {
        tableName = "collab_users_todos";
        matchIdName = "collab_user_todo_id";
      }

      // Supabase update
      const { error } = await supabase
        .from(tableName)
        .update({ ignore: true })
        .match({ [matchIdName]: id });

      if (error) {
        console.log(error);
        return;
      }
    }
    setIsChecked([]);
  };

  const handleSetLead = async () => {
    if (attendeeIsChecked.length === 1) {
      console.log("Lead", attendeeIsChecked[0]);

      try {
        // First, set all attendees for this workspace to not be the lead
        const { error: errorRemoveLead } = await supabase
          .from("attendees")
          .update({ attendee_is_workspace_lead: false })
          .match({ workspace_id: workspace_id });

        if (errorRemoveLead) throw errorRemoveLead;

        // Then set the selected attendee to be the lead
        const { error: errorSetLead } = await supabase
          .from("attendees")
          .update({ attendee_is_workspace_lead: true })
          .eq("attendee_id", attendeeIsChecked[0])
          .match({ workspace_id: workspace_id });

        if (errorSetLead) throw errorSetLead;

        // Once operation is successful, uncheck the checkbox
        setAttendeeIsChecked([]);

        // Show a success toast
        toast({
          title: "Lead Set.",
          description: "The workspace lead has been successfully set.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        console.log("Successfully set the lead");
      } catch (error) {
        console.error("Error setting the lead:", error);

        // Show an error toast
        toast({
          title: "An error occurred.",
          description: "Unable to set the workspace lead.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

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
                    Previous Meetings
                  </Flex>
                </Flex>
              </ListItem>
              <PreviousMeetings />
            </List>
          </Card>
          <Card p='12px'>
            <List>
              <Flex direction='row' justify='space-between'>
                <ListItem mb='0px'>
                  <ListIcon as={FiUsers} color='black' />
                  Team
                </ListItem>
                <Flex pr='10px' gap='2'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => handleSetLead()}
                    disabled={attendeeIsChecked.length !== 1}
                  >
                    Set Lead
                  </Button>

                  <Spacer />
                  <IconButton
                    size='sm'
                    variant='secondary'
                    icon={<DeleteIcon />}
                  />
                </Flex>
              </Flex>
              {workspace_id && (
                <TeamMemberStack
                  workspace_id={workspace_id}
                  handleAttendeeCheckboxChange={handleAttendeeCheckboxChange}
                  attendeeIsChecked={attendeeIsChecked}
                />
              )}
              {/* <TeamMemberStack mt='0px' workspace_id={workspace_id_memo} /> */}
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
                    onClick={() => handleCheckClick("nextSteps")}
                  />
                </Flex>
              </Flex>
              <NextStepsList
                workspace_id={workspace_id}
                isChecked={isChecked}
                handleCheckboxChange={handleCheckboxChange}
              />

              <Flex direction='row' justify='space-between'>
                <ListItem>
                  <ListIcon as={FiCheckCircle} color='black' />
                  Todo List
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
                    onClick={() => handleCheckClick("todo")}
                  />
                </Flex>
              </Flex>

              <ToDoList
                workspace_id={workspace_id}
                isChecked={isChecked}
                handleCheckboxChange={handleCheckboxChange}
              />
            </List>
          </Card>
        </SimpleGrid>
      </Stack>
      {/* <Card p='12px' minH='xs'>
        <List>
          <ListItem>
            <ListIcon as={FiArchive} color='black' />
            Files
          </ListItem>
        </List>
        <Box
          as='section'
          bg='bg.surface'
          py={{
            base: "4",
            md: "8",
          }}
        >
          <Container maxW='lg'>
            
          </Container>
        </Box>
      </Card> */}
    </Stack>
  );
}
{
  /* <ListItem mt='20px'>
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
              </ListItem> */
}
