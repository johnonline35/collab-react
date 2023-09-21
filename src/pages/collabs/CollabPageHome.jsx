import {
  Box,
  SimpleGrid,
  Stack,
  ListIcon,
  ListItem,
  List,
  IconButton,
  Button,
  Flex,
  Spacer,
  Text,
  useToast,
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
} from "react-icons/fi";

import { MemoizedTeamMemberStack as TeamMemberStack } from "../../components/TeamMemberStack";
import { NextStepsList } from "../../components/NextStepsList";
import { ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";
import { CollabWorkspaceSettings } from "../../components/CollabWorkspaceSettings";
import { ToDoList } from "../../components/TodoList";

import PreviousMeetings from "../../components/CollabPreviousMeetings";

export default function CollabPageHome() {
  const { workspace_id } = useParams();
  const [emailLink, setEmailLink] = useState();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [isChecked, setIsChecked] = useState([]);
  const [attendeeIsChecked, setAttendeeIsChecked] = useState([]);
  const toast = useToast();

  // These functions are used by the Next Steps List and Todo List components:
  const handleCheckboxChange = (id) => {
    setIsChecked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((e) => e !== id);
      } else {
        return [...prev, id];
      }
    });
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

  // These functions are used by the TeamMemberStack:
  const handleAttendeeCheckboxChange = (attendeeId) => {
    if (attendeeIsChecked.includes(attendeeId)) {
      // If the attendee is currently checked, remove them from the array
      setAttendeeIsChecked(attendeeIsChecked.filter((id) => id !== attendeeId));
    } else {
      // If the attendee is not currently checked, add them to the array
      setAttendeeIsChecked([...attendeeIsChecked, attendeeId]);
    }
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

        // Fetch the updated attendee data
        const { data: leadAttendee, error: errorFetchAttendee } = await supabase
          .from("attendees")
          .select("*")
          .eq("attendee_id", attendeeIsChecked[0]);

        if (errorFetchAttendee) throw errorFetchAttendee;

        const attendee = leadAttendee[0];

        // Fetch the list of public domains
        const publicEmailDomains = await fetchPublicEmailDomains();

        // Check if the domain of attendee's email is public
        const isPublicDomain = publicEmailDomains.includes(
          attendee.attendee_email.split("@")[1]
        );

        // Depending on whether the domain is public, update the workspace accordingly
        const updateData = isPublicDomain
          ? { domain: null, meeting_attendee_email: attendee.attendee_email }
          : {
              domain: attendee.attendee_email.split("@")[1],
              meeting_attendee_email: null,
            };

        const { error: errorUpdateWorkspace } = await supabase
          .from("workspaces")
          .update(updateData)
          .eq("workspace_id", workspace_id);

        if (errorUpdateWorkspace) throw errorUpdateWorkspace;

        // Once operation is successful, uncheck the checkbox
        setAttendeeIsChecked([]);

        // Show a success toast
        toast({
          title: "Lead Set.",
          description: "The workspace lead has been successfully set.",
          status: "success",
          position: "top",
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
          position: "top",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteAttendees = async () => {
    // First check if there is only one attendee in the workspace
    const { data, error } = await supabase
      .from("attendees")
      .select("*")
      .eq("workspace_id", workspace_id);

    if (error) {
      console.log("Error fetching attendees: ", error);
      // Show an error toast
      toast({
        title: "An error occurred.",
        description: `Unable to fetch the attendee(s). Error: ${error.message}`, // including error message in the description
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });

      return; // stop execution in case of error
    }

    console.log("attendeeIsChecked", attendeeIsChecked);
    console.log("data", data);

    const leadToBeDeleted = attendeeIsChecked.find(
      (id) => id === data[0].attendee_id && data[0].attendee_is_workspace_lead
    );

    if (leadToBeDeleted) {
      console.log("Lead to be deleted:", leadToBeDeleted);
      // Show an error toast
      toast({
        title: "Cannot delete workspace lead.",
        description:
          "Please assign a new workspace lead before deleting attendee.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });

      // Uncheck the lead by removing them from the attendeeIsChecked array
      setAttendeeIsChecked(
        attendeeIsChecked.filter((attendeeId) => attendeeId !== leadToBeDeleted)
      );

      return; // stop execution
    }

    if (data.length === attendeeIsChecked.length) {
      // Show an error toast
      toast({
        title: "Cannot delete all attendees.",
        description: "A workspace must have at least one attendee.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });

      return; // stop execution
    }

    // Loop over each checked attendee
    for (const attendeeId of attendeeIsChecked) {
      // Perform the updates for each attendee
      try {
        const { data, error } = await supabase
          .from("attendees")
          .update({
            ignore: true,
            workspace_id: null,
            attendee_is_workspace_lead: false,
          })
          .eq("workspace_id", workspace_id)
          .eq("attendee_id", attendeeId);

        if (error) {
          throw error;
        } else {
          console.log("Successfully updated attendee ", attendeeId);
        }
      } catch (error) {
        console.log("Error updating attendee: ", error);

        // Show an error toast
        toast({
          title: "An error occurred.",
          description: `Unable to delete the attendee(s). Error: ${error.message}`,
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });

        return; // stop execution in case of error
      }
    }

    // Clear the checked attendees state
    setAttendeeIsChecked([]);

    // Show a success toast
    toast({
      title: "Deletion Successful.",
      description: "The attendee(s) were successfully deleted",
      status: "success",
      position: "top",
      duration: 5000,
      isClosable: true,
    });
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

  const fetchPublicEmailDomains = async () => {
    const { data, error } = await supabase
      .from("public_email_domains")
      .select("domain");

    if (error) {
      console.error("Error fetching domains: ", error);
      return [];
    }

    // Assuming 'domain' is a column in your table
    const publicEmailDomains = data.map((row) => row.domain);

    return publicEmailDomains;
  };

  const getEmailLinkStateAndName = async () => {
    const { data, error } = await supabase
      .from("workspaces")
      .select()
      .eq("workspace_id", workspace_id);

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
      .eq("workspace_id", workspace_id)
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
                workspace_id={workspace_id}
              />
              <ListItem>
                <Flex direction='row' justify='space-between'>
                  <Flex>
                    <ListIcon as={FiDribbble} color='black' mt='5px' />
                    All Meetings
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
                    onClick={handleDeleteAttendees}
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
