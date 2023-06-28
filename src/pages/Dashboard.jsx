import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Link,
  Button,
  Card,
  Badge,
  CardBody,
  CardHeader,
  Avatar,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  Spacer,
  Stack,
  Spinner,
  AvatarBadge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  CardFooter,
  Image,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase/clientapp";
import { useFullUrl } from "../hooks/useFullUrl";

import { DashboardLoader } from "./LazyLoadDashboard";
import { useImageLoaded } from "../hooks/useImageLoaded";
import { FiLink } from "react-icons/fi";
// import { FaLinkedin } from "react-icons/fa";
import { RiTwitterFill, RiTwitterLine } from "react-icons/ri";
import { SiCrunchbase } from "react-icons/si";
import { IoMdPeople } from "react-icons/io";
// import { AiFillFacebook } from "react-icons/ai";
import { GrFacebook, GrLinkedin, GrTwitter } from "react-icons/gr";

export default function Dashboard() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const imageLoaded = useImageLoaded(
    companyInfo,
    loadedImages,
    setLoadedImages
  );
  const [userId, setUserId] = useState(null);

  const getMeetingsEndpoint =
    "https://collab-express-production.up.railway.app/";

  // Fetch Google Calendar via Server and process the response
  const getMeetings = async (userId) => {
    console.log("NEWuserId:", userId);
    console.log("Starting getMeetings");
    if (!userId) return; // Do not proceed if there's no user ID
    console.log("Passed userId check");

    const response = await fetch(getMeetingsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    console.log("Sent fetch request");

    if (response.ok) {
      console.log("Got Meetings");
      const meetingsData = await response.json();
      console.log("meetingsData:", meetingsData);

      let workspaceIds = meetingsData.meetings
        .filter((meeting) => meeting.workspace_id !== undefined)
        .map((meeting) => meeting.workspace_id);

      // Remove duplicates
      workspaceIds = [...new Set(workspaceIds)];
      console.log("workspaceIds:", workspaceIds);

      const meetingIds = meetingsData.meetings.map((meeting) => meeting.id);
      console.log("meetingIds:", meetingIds);

      // handle response here
      // Loop over workspaceIds array to get info for each workspace
      for (const workspaceId of workspaceIds) {
        fetchAndCombineData(workspaceId, userId);
        // getCompanyTileInfo(userId, workspaceId);
        // getNextOrLastMeeting(workspaceId, userId);
      }
    } else {
      console.error("Error getting meetings:", response.status);
    }
  };

  const fetchAndCombineData = async (workspaceId, userId) => {
    console.log(
      `Fetching and combining data for workspaceId: ${workspaceId} and userId: ${userId}`
    );

    const result1 = await supabase.rpc("get_next_or_last_meeting", {
      p_workspace_id: workspaceId,
      p_collab_user_id: userId,
    });
    console.log("result1:", result1);

    const result2 = await supabase.rpc("test_dashboard", {
      _userid: userId,
    });
    console.log("result2:", result2);

    // Create a Map to hold combined data.
    const combinedData = new Map();

    // Iterate over the first result, adding each item to the Map.
    result1.data.forEach((item) => {
      combinedData.set(item.workspace_id, { ...item });
    });

    // Iterate over the second result, finding the corresponding item in the Map and merging the data.

    result2.data.forEach((item) => {
      const key = item.workspace_id;
      if (combinedData.has(key)) {
        // Merge the existing item with the new data.
        combinedData.set(key, { ...combinedData.get(key), ...item });
      } else {
        // If no matching item exists, add a new one.
        combinedData.set(key, { ...item });
      }
    });

    // Convert the Map back to an array.
    const combinedArray = Array.from(combinedData.values());
    console.log("combinedArray:", combinedArray[0]);

    // Create a final array with the first element from each iteration in combinedArray.
    const finalArray = combinedArray.map((item) => item[0]);
    console.log("finalArray:", finalArray);

    // Now you can set your state with the finalArray.
    setCompanyInfo(combinedArray);
    setLoadingCards(false);
  };

  // const fetchAndCombineData = async (workspaceId, userId) => {
  //   console.log(
  //     `Fetching and combining data for workspaceId: ${workspaceId} and userId: ${userId}`
  //   );

  //   const result1 = await supabase.rpc("get_next_or_last_meeting", {
  //     p_workspace_id: workspaceId,
  //     p_collab_user_id: userId,
  //   });
  //   console.log("result1:", result1);

  //   const result2 = await supabase.rpc("test_dashboard", {
  //     _userid: userId,
  //   });
  //   console.log("result2:", result2);

  //   // Create a Map to hold combined data.
  //   const combinedData = new Map();

  //   // Iterate over the first result, adding each item to the Map.
  //   result1.data.forEach((item) => {
  //     combinedData.set(item.workspace_id, { ...item });
  //   });

  //   // Iterate over the second result, finding the corresponding item in the Map and merging the data.
  //   result2.data.forEach((item) => {
  //     const key = item.workspace_id;
  //     if (combinedData.has(key)) {
  //       // Merge the existing item with the new data.
  //       combinedData.set(key, { ...combinedData.get(key), ...item });
  //     } else {
  //       // If no matching item exists, add a new one.
  //       combinedData.set(key, { ...item });
  //     }
  //   });

  //   // Convert the Map back to an array.
  //   const combinedArray = Array.from(combinedData.values());
  //   console.log("combinedArray:", combinedArray);

  //   // Now you can set your state with the combinedArray.
  //   setCompanyInfo(combinedArray);
  //   setLoadingCards(false);
  // };

  // console.log("Got Meetings");
  // const meetingsData = await response.json();
  // console.log("meetingsData:", meetingsData);

  // const workspaceId = meetingsData.workspace_id;
  // console.log("workspaceId:", workspaceId);
  // // handle response here
  // getCompanyTileInfo(userId);
  // getNextOrLastMeeting(workspaceId, userId);

  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [meetingInfo, setMeetingInfo] = useState(null);

  const getNextOrLastMeeting = async (workspaceId, userId) => {
    console.log("Invoked getNextOrLastMeeting with:", {
      workspaceId: workspaceId,
      userId: userId,
    });

    try {
      console.log("Sending request to get_next_or_last_meeting");
      const { data, error } = await supabase.rpc("get_next_or_last_meeting", {
        p_workspace_id: workspaceId,
        p_collab_user_id: userId,
      });

      console.log("Received response from get_next_or_last_meeting");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Data received from get_next_or_last_meeting:", data[0]);
      }

      setMeetingInfo(data[0]);

      setLoadingMeetings(false);
      console.log("Updated loadingMeetings state:", loadingMeetings);
    } catch (error) {
      console.error("Error in get_next_or_last_meeting:", error);
    }
  };

  useEffect(() => {
    console.log("Updated meetingInfo state:", meetingInfo);
  }, [meetingInfo]);

  // Real time function that waits for the background jobs then calls getCompanyTileInfo(userId)

  // const receivedUpdate = useRef(false);
  // const isSubscribed = useRef(false);

  // useEffect(() => {
  //   if (!userId) {
  //     console.log("userId is not set, returning early");
  //     return; // Don't set up subscription if userId is not set yet
  //   }

  //   console.log("Setting up subscription for userId:", userId);

  //   // Set up a Realtime subscription
  //   const subscription = supabase
  //     .channel("job_queue:collab_user_id=eq." + userId)
  //     .on(
  //       "postgres_changes",
  //       { event: "UPDATE", schema: "public" },
  //       (payload) => {
  //         console.log("Received UPDATE event:", payload);

  //         // Check if the job status is "job_complete"
  //         if (payload.new.job_complete === true) {
  //           console.log("Job completed, jobId:", payload.new.job_id);

  //           // Mark that an update was received
  //           receivedUpdate.current = true;

  //           getCompanyTileInfo(userId);

  //           // Unsubscribe from the subscription as it's no longer needed
  //           console.log("Unsubscribing from subscription for userId:", userId);
  //           subscription.unsubscribe();
  //           isSubscribed.current = false;
  //         }
  //       }
  //     )
  //     .subscribe();

  //   console.log("Subscription LIVE:", subscription);
  //   isSubscribed.current = true;

  //   // Check shortly after subscribing if an update was received
  //   setTimeout(() => {
  //     if (isSubscribed.current && !receivedUpdate.current) {
  //       console.log("No update received, calling getCompanyTileInfo.");
  //       getCompanyTileInfo(userId);

  //       // Unsubscribe as it's no longer needed
  //       console.log("Unsubscribing from subscription for userId:", userId);
  //       subscription.unsubscribe();
  //       isSubscribed.current = false;
  //     }
  //   }, 5000); // Check after 5 seconds for example, can be adjusted
  // }, [userId]); // Rerun this hook whenever userId changes

  const getCompanyTileInfo = async (userId) => {
    try {
      const { data, error } = await supabase.rpc("test_dashboard", {
        _userid: userId,
      });

      if (error) {
        console.error("Error fetching data:", error);
      }

      setCompanyInfo(data);
      setLoadingCards(false);
    } catch (error) {
      console.error("Error in test_dashboard:", error);
    }
  };

  // Fetch user session and set the userId
  useEffect(() => {
    setLoadingCards(true);

    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("session:", data.session);

      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      // Fetch user id from the collab_users table
      let { data: userData, error: userError } = await supabase
        .from("collab_users")
        .select("id")
        .eq("collab_user_email", data.session.user.email) // Assuming that the email is a unique identifier
        .single();

      if (userError) {
        console.error("Error getting user data:", userError);
        return;
      }

      const userId = userData.id;
      console.log("initialUserId:", userId);
      setUserId(userId); // Set the user ID in state

      // Get the refresh token from the session object
      const refreshToken = data.session.provider_refresh_token;

      // Upsert the userId and the refresh token
      const { error: upsertError } = await supabase
        .from("collab_users")
        .upsert([{ id: userId, refresh_token: refreshToken }], {
          onConflict: "id",
        });

      if (upsertError) {
        console.error("Error upserting refresh token:", upsertError);
      }

      // Call getMeetings after the userId state has been set
      getMeetings(userId);
    };

    getSession();
  }, []);

  if (loadingCards) {
    return <DashboardLoader />;
  }

  function formatTime(timeString) {
    const [time, timeZoneOffset] = timeString.split("+");
    const [hour, minute, second] = time.split(":");
    const timeZone = parseInt(timeZoneOffset);

    const date = new Date();
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    date.setSeconds(parseInt(second));

    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: `Etc/GMT${timeZone > 0 ? "-" : "+"}${Math.abs(timeZone)}`,
      timeZoneName: "short",
    });

    return formatter.format(date);
  }
  // COOKIE
  // console.log("cookie", document.cookie);
  function capitalizeFirstLetterOfEachWord(str) {
    if (str) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    } else {
      return "";
    }
  }

  return (
    <>
      {" "}
      <Tabs>
        <TabList pb={3}>
          <Tab>Workspaces</Tab>
          {/* <Tab>Recently Viewed</Tab>
          <Tab>Custom Search</Tab>
          <Tab>Alerts</Tab> */}
        </TabList>

        {/* <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
        </TabPanels> */}
      </Tabs>
      <SimpleGrid mt={6} spacing={10} minChildWidth='300px'>
        {companyInfo &&
          companyInfo.map((info) => {
            const displayName = info.attendee_name || "Enter Name";
            const displayTitle = info.attendee_job_title || "Enter Title";
            console.log("companyInfo:", companyInfo);
            console.log("Does start_dateTime exist?", "start_dateTime" in info);
            return (
              <Card
                key={info.workspace_id}
                borderTop='2px'
                borderColor='blue.400'
                bg='white'
                loading={loadingCards}
                minW='xs'
              >
                <CardHeader
                  p='0'
                  bg={info.banner_src ? "transparent" : "blue.400"}
                  style={{ height: "70px" }}
                >
                  <Flex
                    justifyContent='center'
                    alignItems='center'
                    maxHeight='70px'
                    overflow='hidden'
                  >
                    {info.banner_src ? (
                      <Image
                        src={info.banner_src}
                        maxHeight='100%'
                        width='auto'
                        height='auto'
                      />
                    ) : (
                      <Box width='100%' height='100%'></Box>
                    )}
                  </Flex>
                  <Flex gap={5}>
                    <Box position='relative'>
                      <Avatar
                        position='absolute'
                        zIndex='10'
                        left='20px'
                        top={info.banner_src ? "-50px" : "20px"}
                        bg='white'
                        transform='translateY(50%)'
                        src={info.icon_src || info.image || undefined}
                        name={info.workspace_name}
                      />
                    </Box>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box>
                    <Link
                      href={`/collabs/${info.workspace_id}/${info.workspace_name}`}
                      mb={1}
                    >
                      <Heading as='h3' size='sm'>
                        {info.workspace_name}
                        {/* <Badge marginTop='-15px' size='sm' colorScheme='green'>
                          2 Next Steps
                        </Badge> */}
                      </Heading>
                    </Link>
                    <Flex>
                      <Link
                        href={
                          info.domain
                            ? info.domain.startsWith("http://") ||
                              info.domain.startsWith("https://")
                              ? info.domain
                              : `https://${info.domain}`
                            : undefined
                        }
                        isExternal
                        target='_blank'
                        rel='noopener noreferrer'
                        mr={2}
                      >
                        <Icon
                          mr='3px'
                          style={{
                            transform: "translateY(2px)",
                            color: info.domain ? undefined : "white",
                          }}
                          as={FiLink}
                        />
                        {info.domain}
                      </Link>

                      {info.linkedin_url && (
                        <Link
                          href={info.linkedin_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Icon
                            ml='3px'
                            mr='3px'
                            style={{
                              transform: "translateY(2px)",
                            }}
                            as={GrLinkedin}
                          />
                        </Link>
                      )}

                      {info.twitter_url && (
                        <Link
                          href={info.twitter_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Icon
                            ml='3px'
                            mr='3px'
                            style={{
                              transform: "translateY(2px)",
                            }}
                            as={GrTwitter}
                          />
                        </Link>
                      )}

                      {info.crunchbase_url && (
                        <Link
                          href={info.crunchbase_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Icon
                            ml='3px'
                            mr='3px'
                            style={{
                              transform: "translateY(2px)",
                            }}
                            as={SiCrunchbase}
                          />
                        </Link>
                      )}

                      {info.facebook_url && (
                        <Link
                          href={info.facebook_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Icon
                            ml='3px'
                            mr='3px'
                            style={{
                              transform: "translateY(2px)",
                            }}
                            as={GrFacebook}
                          />
                        </Link>
                      )}
                    </Flex>
                    {/* <Text>Led by {info.collab_user_name}</Text> */}
                    <Flex mt='10px' gap='1'>
                      {/* <Icon
                        // ml='3px'

                        style={{
                          transform: "translateY(4px)",
                        }}
                        as={MdAttachMoney}
                      />
                      <Text>2.7m</Text> */}
                      {info.domain ? (
                        info.job_company_size ? (
                          <>
                            <Icon
                              ml='3px'
                              mr='1px'
                              style={{
                                transform: "translateY(4px)",
                              }}
                              as={IoMdPeople}
                            />
                            <Text>{info.job_company_size}</Text>
                          </>
                        ) : (
                          <>
                            <Icon
                              ml='3px'
                              mr='1px'
                              style={{
                                transform: "translateY(4px)",
                                color: "white",
                              }}
                              as={IoMdPeople}
                            />
                            <Text style={{ color: "white" }}>Undefined</Text>
                          </>
                        )
                      ) : (
                        <>
                          <Icon
                            ml='3px'
                            mr='1px'
                            style={{
                              transform: "translateY(4px)",
                            }}
                            as={IoMdPeople}
                          />
                          <Text>1</Text>
                        </>
                      )}
                    </Flex>
                    <Box py='4' height='200px' maxHeight='200px'>
                      <Flex height='200px' maxHeight='200px'>
                        <Text
                          fontWeight='medium'
                          size='xs'
                          overflow='auto'
                          textOverflow='ellipsis'
                          maxHeight='200px'
                        >
                          {info.description
                            ? info.description
                            : "This is a personal email account workspace. Workspaces of personal email accounts are not automatically associated with a specific company. This workspace still functions the same way as other company specific workspaces."}
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                  <Box bg='bg-surface' py='4'>
                    <Stack direction='row' justify='space-between' spacing='4'>
                      <HStack spacing='3'>
                        {/* <Checkbox /> */}
                        <Avatar
                          src={info ? info.image : undefined}
                          boxSize='10'
                          name={info.attendee_email}
                        />
                        {/* <AvatarBadge
                        boxSize='4'
                        bg={
                          member.workingHours === "yes"
                            ? "green.500"
                            : "red.500"
                        }
                      />
                    </Avatar> */}
                        <Box>
                          <Flex direction='row' justify='space-between'>
                            <Text fontWeight='medium' color='emphasized'>
                              {capitalizeFirstLetterOfEachWord(displayName)}
                            </Text>
                            {/* <Badge
                              size='sm'
                              colorScheme={
                                info.status === "lead" ? "green" : null
                              }
                            >
                              {info.status}
                            </Badge> */}
                          </Flex>

                          <Text color='muted'>
                            {capitalizeFirstLetterOfEachWord(displayTitle)}
                          </Text>
                        </Box>
                      </HStack>
                    </Stack>
                    <Text
                      color='muted'
                      sx={{
                        "-webkit-box-orient": "vertical",
                        "-webkit-line-clamp": "2",
                        overflow: "hidden",
                        display: "-webkit-box",
                      }}
                    >
                      {/* Current Time: {formatTime(info.attendee_timezone)} */}
                      <br />
                      Email: {info.attendee_email}
                    </Text>
                  </Box>

                  <Flex
                    direction='column'
                    justify='center'
                    align='center'
                    gap={10}
                  >
                    <Spacer />
                    <Link
                      href={`/collabs/${info.workspace_id}/${info.workspace_name}/notes`}
                    >
                      <Button
                        leftIcon={<EditIcon />}
                        variant='secondary'
                        width='250px'
                      >
                        Workspace AI
                      </Button>
                    </Link>
                  </Flex>
                </CardBody>
                <Divider borderColor='gray.200' />

                <CardFooter>
                  <HStack>
                    <Text size='xs' color='gray.400'>
                      Meeting Scheduled: (info.start_dateTime) and{" "}
                      {info.attendee_email}
                    </Text>
                    {/* <Button
                      // onClick={() => {}}
                      variant='ghost'
                      leftIcon={<ViewIcon />}
                    >
                      View
                    </Button> */}
                  </HStack>
                </CardFooter>
              </Card>
            );
          })}
      </SimpleGrid>
    </>
  );
}
