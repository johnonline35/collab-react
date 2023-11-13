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
  Tab,
  Tabs,
  TabList,
  TabIndicator,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useNavigate, useLocation, useParams, Outlet } from "react-router-dom";

import { useState, useEffect, useCallback, useContext } from "react";
import { supabase } from "../../supabase/clientapp";
import {
  FiCheck,
  FiCheckCircle,
  FiDribbble,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { FaListAlt } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { IoDocumentText } from "react-icons/io5";

import { TeamMemberStack } from "../../components/TeamMemberStack";
import { NextStepsList } from "../../components/NextStepsList";
import { ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";

import PreviousMeetings from "../../components/CollabPreviousMeetings";
import CollabPageSettings from "../collabs/CollabPageSettings";
import { SessionContext } from "../../privateRoute";

export default function CollabPageHome() {
  const { workspace_id } = useParams();
  const session = useContext(SessionContext);
  const userId = session?.user.id;
  const [emailLink, setEmailLink] = useState();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [isChecked, setIsChecked] = useState([]);
  const [attendeeIsChecked, setAttendeeIsChecked] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [members, setMembers] = useState([]);
  const [nextSteps, setNextSteps] = useState([]);
  const [isNextStepsLoading, setIsNextStepsLoading] = useState(true);
  const [toDoList, setToDoList] = useState([]);
  const [notes, setNotes] = useState([]);
  const [meetingsNotes, setMeetingsNotes] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [showNotesTab, setShowNotesTab] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   // Check the URL and update the tabIndex state accordingly
  //   if (location.pathname.endsWith("settings")) {
  //     setTabIndex(1);
  //   } else if (location.pathname.includes("notes")) {
  //     setTabIndex(2);
  //   } else {
  //     setTabIndex(0);
  //   }
  // }, [location]);

  // useEffect(() => {
  //   // Check the URL and update the tabIndex state accordingly
  //   const pathSegments = location.pathname.split("/");
  //   // Assuming the path is like '/collabs/:workspace_id/:collab_user_note_id'
  //   if (pathSegments[2] && pathSegments[3]) {
  //     // If there is a collab_user_note_id in the URL, switch to the Notes tab
  //     setTabIndex(2); // Index of the Notes tab
  //   } else if (pathSegments[2]) {
  //     // If there is only a workspace_id in the URL, switch to the Overview tab
  //     setTabIndex(0); // Index of the Overview tab
  //   }
  // }, [location, workspace_id]);

  // const handleTabsChange = (index) => {
  //   setTabIndex(index);
  //   switch (index) {
  //     case 0:
  //       // Navigate to the Overview tab URL
  //       navigate(`/collabs/${workspace_id}`);
  //       break;
  //     case 1:
  //       // Navigate to the Settings tab URL (You'll need to define this)
  //       navigate(`/collabs/${workspace_id}/settings`);
  //       break;
  //     case 2:
  //       // Navigate to the Notes tab URL (This should automatically be handled by the Outlet)
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const fetchNextSteps = async (bypassCache = false) => {
    setIsNextStepsLoading(true);

    if (!bypassCache) {
      const cachedData = sessionStorage.getItem(
        `nextSteps-${workspace_id}-${userId}`
      );
      if (cachedData) {
        setNextSteps(JSON.parse(cachedData));
      }
    }

    const { data, error } = await supabase
      .from("collab_users_next_steps")
      .select("*")
      .match({ workspace_id, collab_user_id: userId })
      .neq("ignore", true);

    if (error) {
      console.error(error);
    } else {
      sessionStorage.setItem(
        `nextSteps-${workspace_id}-${userId}`,
        JSON.stringify(data)
      );
      setNextSteps(data);
    }

    setIsNextStepsLoading(false);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // Set the showNotesTab state to true if the URL indicates a specific note is selected
    setShowNotesTab(pathSegments.length > 2);

    if (tab === "settings") {
      setTabIndex(1); // Index for the Settings tab
    } else if (pathSegments.length > 2) {
      setTabIndex(2); // Index for the Notes tab
    } else {
      setTabIndex(0); // Default to the Overview tab
    }
  }, [location]);

  const handleTabsChange = (index) => {
    setTabIndex(index);
    switch (index) {
      case 0:
        navigate(`/collabs/${workspace_id}`);
        fetchNextSteps(true);
        break;
      case 1:
        navigate(`/collabs/${workspace_id}?tab=settings`);
        break;
      case 2:
        // If the Notes tab requires specific navigation, handle it here
        // otherwise, if it's handled by clicking on individual notes, you may not need to navigate
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log("Session state has changed:", session);

    if (!workspace_id) {
      console.error("Invalid, or missing workspace_id'");
      return;
    }

    const fetchData = async (key, supabaseQuery, setState) => {
      // Attempt to get cached data
      const cachedData = sessionStorage.getItem(key);

      if (cachedData) {
        setState(JSON.parse(cachedData));
      }

      // Fetch from the database
      const { data, error } = await supabaseQuery;

      if (error) {
        console.error(error);
      } else {
        // Cache the new data and update state
        sessionStorage.setItem(key, JSON.stringify(data));
        setState(data);
      }
    };

    if (userId) {
      fetchNextSteps();
      // setIsNextStepsLoading(true);
      // fetchData(
      //   `nextSteps-${workspace_id}-${userId}`,
      //   supabase
      //     .from("collab_users_next_steps")
      //     .select("*")
      //     .match({ workspace_id, collab_user_id: userId })
      //     .neq("ignore", true),
      //   setNextSteps
      // ).finally(() => setIsNextStepsLoading(false));

      fetchData(
        `toDos-${workspace_id}-${userId}`,
        supabase
          .from("collab_users_todos")
          .select("*")
          .match({ workspace_id, collab_user_id: userId })
          .neq("ignore", true),
        setToDoList
      );
    }

    fetchData(
      `meetings-${workspace_id}`,
      supabase
        .from("meetings")
        .select("*")
        .eq("workspace_id", workspace_id)
        .order('"start_dateTime"', { ascending: false }),
      setMeetings
    );

    fetchData(
      `attendees-${workspace_id}`,
      supabase.from("attendees").select("*").eq("workspace_id", workspace_id),
      setMembers
    );
  }, [workspace_id, userId, session]);

  // useEffect(() => {
  //   console.log("Session state has changed:", session);

  //   if (!workspace_id) {
  //     console.error("Invalid, or missing workspace_id'");
  //     return;
  //   }

  //   if (userId) {
  //     const fetchNextSteps = async () => {
  //       setIsNextStepsLoading(true);

  //       // Define a key for sessionStorage
  //       const nextStepsKey = `nextSteps-${workspace_id}-${userId}`;
  //       // Attempt to get cached data
  //       const cachedNextSteps = sessionStorage.getItem(nextStepsKey);

  //       if (cachedNextSteps) {
  //         setNextSteps(JSON.parse(cachedNextSteps));
  //       } else {
  //         const { data, error } = await supabase
  //           .from("collab_users_next_steps")
  //           .select("*")
  //           .match({
  //             workspace_id: workspace_id,
  //             collab_user_id: userId,
  //           })
  //           .neq("ignore", true);

  //         if (error) {
  //           console.error(error);
  //         } else {
  //           // Cache the data and update state
  //           sessionStorage.setItem(nextStepsKey, JSON.stringify(data));
  //           setNextSteps(data);
  //         }
  //       }

  //       setIsNextStepsLoading(false);
  //     };

  //     const fetchToDos = async () => {
  //       console.log("fetchToDos called");

  //       // Define a key for sessionStorage
  //       const toDosKey = `toDos-${workspace_id}-${userId}`;
  //       // Attempt to get cached data
  //       const cachedToDos = sessionStorage.getItem(toDosKey);

  //       if (cachedToDos) {
  //         setToDoList(JSON.parse(cachedToDos));
  //       } else {
  //         const { data, error } = await supabase
  //           .from("collab_users_todos")
  //           .select("*")
  //           .match({
  //             workspace_id: workspace_id,
  //             collab_user_id: userId,
  //           })
  //           .neq("ignore", true);

  //         if (error) {
  //           console.error(error);
  //         } else {
  //           // Cache the data and update state
  //           sessionStorage.setItem(toDosKey, JSON.stringify(data));
  //           setToDoList(data);
  //         }
  //       }
  //     };

  //     fetchToDos();
  //     fetchNextSteps();
  //   }

  //   const fetchMeetings = async () => {
  //     // Define a key for sessionStorage
  //     const meetingsKey = `meetings-${workspace_id}`;
  //     // Attempt to get cached data
  //     const cachedMeetings = sessionStorage.getItem(meetingsKey);

  //     if (cachedMeetings) {
  //       setMeetings(JSON.parse(cachedMeetings));
  //     } else {
  //       try {
  //         let { data, error } = await supabase
  //           .from("meetings")
  //           .select("*")
  //           .eq("workspace_id", workspace_id)
  //           .order('"start_dateTime"', { ascending: false });

  //         if (error) {
  //           console.error("Error fetching meetings: ", error);
  //           return;
  //         }

  //         // Cache the data and update state
  //         sessionStorage.setItem(meetingsKey, JSON.stringify(data));
  //         setMeetings(data);
  //       } catch (error) {
  //         console.error("Exception caught while fetching meetings: ", error);
  //       }
  //     }
  //   };

  //   fetchMeetings();
  //   const fetchAttendees = async () => {
  //     // Define a key for sessionStorage
  //     const attendeesKey = `attendees-${workspace_id}`;
  //     // Attempt to get cached data
  //     const cachedAttendees = sessionStorage.getItem(attendeesKey);

  //     if (cachedAttendees) {
  //       setMembers(JSON.parse(cachedAttendees));
  //     } else {
  //       const { data, error } = await supabase
  //         .from("attendees")
  //         .select("*")
  //         .eq("workspace_id", workspace_id);

  //       if (error) {
  //         console.error(error);
  //       } else {
  //         // Cache the data and update state
  //         sessionStorage.setItem(attendeesKey, JSON.stringify(data));
  //         setMembers(data);
  //       }
  //     }
  //   };

  //   fetchAttendees();
  // }, [workspace_id, userId, session]);

  useEffect(() => {
    if (!userId || !workspace_id) {
      return;
    }

    const fetchCollabUserNotes = async () => {
      const { data: collabUserNotes, error } = await supabase
        .from("collab_users_notes")
        .select("*")
        .eq("workspace_id", workspace_id);

      if (error) {
        console.error(error);
      } else {
        console.log({ collabUserNotes: collabUserNotes });
        setNotes(collabUserNotes);
      }
    };

    fetchCollabUserNotes();
  }, [workspace_id, userId]);

  useEffect(() => {
    if (!meetings || !notes) {
      return;
    }
    const mergedArray = meetings.map((meeting) => {
      const note = notes.find((n) => n.meeting_id === meeting.id);
      return {
        ...meeting,
        ...note,
      };
    });

    setMeetingsNotes(mergedArray);
  }, [meetings, notes]);

  useEffect(() => {
    if (!meetingsNotes) {
      return;
    }

    console.log({ meetingsNotes: meetingsNotes });
  }, [meetingsNotes]);

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
    let tableName;
    let matchIdName;
    let setStateFunction;

    if (type === "nextSteps") {
      tableName = "collab_users_next_steps";
      matchIdName = "collab_user_next_steps_id";
      setStateFunction = setNextSteps;
    } else if (type === "todo") {
      tableName = "collab_users_todos";
      matchIdName = "collab_user_todo_id";
      setStateFunction = setToDoList;
    }

    for (const id of isChecked) {
      const { error } = await supabase
        .from(tableName)
        .update({ ignore: true })
        .match({ [matchIdName]: id });

      if (error) {
        console.log(error);
        return;
      }
    }

    setStateFunction((prevItems) =>
      prevItems.filter((item) => !isChecked.includes(item[matchIdName]))
    );

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
      // console.log("Lead", attendeeIsChecked[0]);

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
    const cacheKey = `customerName-${workspace_id}`;

    // Try to get the name from sessionStorage and set it for immediate display
    const cachedName = sessionStorage.getItem(cacheKey);
    if (cachedName) {
      setCustomerName(cachedName);
    }

    try {
      // Fetch the new data
      const { data, error } = await supabase
        .from("workspaces")
        .select()
        .eq("workspace_id", workspace_id);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setEmailLink(data[0].workspace_attendee_enable_calendar_link);

        // Cache the new name and update the state
        sessionStorage.setItem(cacheKey, data[0].workspace_name);
        setCustomerName(data[0].workspace_name);
      }
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      // Handle the error accordingly
    }

    // Finish loading
    setLoadingToggle(false);
  };
  useEffect(() => {
    setLoadingToggle(true);
    getEmailLinkStateAndName();
  }, []);

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

  const updateNextStep = async (id, updates) => {
    const { data, error } = await supabase
      .from("collab_users_next_steps")
      .update(updates)
      .eq("collab_user_next_steps_id", id);

    if (error) {
      console.error("Error updating next step info:", error);
    }
  };

  const updateToDoList = async (id, updates) => {
    const { data, error } = await supabase
      .from("collab_users_todos")
      .update(updates)
      .eq("collab_user_todo_id", id);

    if (error) {
      console.error("Error updating next step info:", error);
    }
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

  const boxSize = "20px";
  //
  return (
    <>
      {" "}
      <Text fontSize='xl' as='b'>
        {customerName}
      </Text>
      <Tabs variant='unstyled' index={tabIndex} onChange={handleTabsChange}>
        <TabList>
          <Tab>Overview</Tab>

          <Tab>Settings</Tab>
          {showNotesTab && <Tab>Notes</Tab>}
        </TabList>
        <TabIndicator
          mt='-1.5px'
          height='2px'
          bg='blue.400'
          borderRadius='1px'
        />
        <TabPanels>
          <TabPanel>
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
                  <Card p='12px' minH='lg'>
                    <List>
                      <ListItem fontSize='xl' fontWeight='bold'>
                        <Flex direction='row' justify='space-between'>
                          <Flex>
                            <ListIcon
                              mt='5px'
                              as={IoDocumentText}
                              color='black'
                              boxSize={boxSize}
                            />
                            Meeting Notes
                          </Flex>
                        </Flex>
                      </ListItem>
                      <PreviousMeetings
                        meetingsNotes={meetingsNotes}
                        workspace_id={workspace_id}
                        customerName={customerName}
                      />
                    </List>
                  </Card>

                  <Card p='12px'>
                    <List>
                      <Flex direction='row' justify='space-between'>
                        <ListItem fontSize='xl' fontWeight='bold'>
                          <ListIcon
                            mt='0px'
                            as={FaListAlt}
                            color='black'
                            boxSize={boxSize}
                          />
                          Next Steps
                        </ListItem>

                        <Flex pr='10px' gap='2'>
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
                        nextSteps={nextSteps}
                        setNextSteps={setNextSteps}
                        isChecked={isChecked}
                        handleCheckboxChange={handleCheckboxChange}
                        updateNextStep={updateNextStep}
                        isLoading={isNextStepsLoading}
                      />

                      <Flex direction='row' justify='space-between'>
                        {/* <ListItem>
                  <ListIcon as={FiCheckCircle} color='black' />
                  Todo List
                </ListItem> */}
                        <Flex pr='10px' gap='2'>
                          {/* <Button variant='secondary' size='sm'>
                    Create Briefing Doc
                  </Button> */}
                          <Spacer />
                          {/* <IconButton
                    size='sm'
                    variant='secondary'
                    icon={<FiCheck />}
                    onClick={() => handleCheckClick("todo")}
                  /> */}
                        </Flex>
                      </Flex>

                      {/* <ToDoList
                toDoList={toDoList}
                setToDoList={setToDoList}
                isChecked={isChecked}
                handleCheckboxChange={handleCheckboxChange}
                updateToDoList={updateToDoList}
              /> f */}
                    </List>
                  </Card>
                  <Card p='12px'>
                    <List>
                      <Flex direction='row' justify='space-between'>
                        <ListItem mb='0px' fontSize='xl' fontWeight='bold'>
                          <ListIcon
                            mt='0px'
                            as={HiUsers}
                            color='black'
                            boxSize={boxSize}
                          />
                          Team
                        </ListItem>
                        <Flex pr='10px' gap='2'>
                          <Button
                            variant='secondary'
                            size='sm'
                            onClick={() => handleSetLead()}
                            disabled={attendeeIsChecked.length !== 1}
                          >
                            Set Main
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
                          members={members}
                          setMembers={setMembers}
                          workspace_id={workspace_id}
                          handleAttendeeCheckboxChange={
                            handleAttendeeCheckboxChange
                          }
                          attendeeIsChecked={attendeeIsChecked}
                        />
                      )}
                      {/* <TeamMemberStack mt='0px' workspace_id={workspace_id_memo} /> */}
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
          </TabPanel>
          <TabPanel>
            <CollabPageSettings
              customerName={customerName}
              handleCustomerNameChange={handleCustomerNameChange}
              emailLink={emailLink}
              setEmailLink={setEmailLink}
              updateEmailToggle={updateEmailToggle}
              loadingToggle={loadingToggle}
              workspace_id={workspace_id}
            />
          </TabPanel>
          {showNotesTab && (
            <TabPanel>
              <Outlet />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  );
}
