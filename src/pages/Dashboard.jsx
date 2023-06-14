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
import { useEffect, useState } from "react";
import { supabase } from "../supabase/clientapp";

import { DashboardLoader } from "./LazyLoadDashboard";
import { useImageLoaded } from "../hooks/useImageLoaded";
import { FiLink } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { RiTwitterFill, RiTwitterLine } from "react-icons/ri";
import { MdOutlineAttachMoney, MdAttachMoney } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";

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
      // handle response here
    } else {
      console.error("Error getting meetings:", response.status);
    }
  };

  // Real time function that waits for the background jobs then calls the frontend loading function
  useEffect(() => {
    if (!userId) {
      console.log("userId is not set, returning early");
      return; // Don't set up subscription if userId is not set yet
    }

    console.log("Setting up subscription for userId:", userId);

    // Initialize the job counter and the timeout ID to null
    let jobCounter = 0;
    let timeoutId = null;

    // Set up a Realtime subscription
    const subscription = supabase
      .channel("job_queue:collab_user_id=eq." + userId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public" },
        (payload) => {
          console.log("Received INSERT event:", payload);

          // Increment the job counter when a new job is added
          jobCounter++;
          console.log("Job counter:", jobCounter);

          // Clear the existing timeout
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
          }

          // Set a new timeout
          timeoutId = setTimeout(() => {
            if (jobCounter === 0) {
              console.log("All jobs have completed!");
              // Call the next step in your process here
            }
          }, 2000); // Wait for 2 seconds of inactivity before checking if all jobs have completed
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public" },
        (payload) => {
          console.log("Received UPDATE event:", payload);

          // Check if the job status is "job_complete"
          if (payload.new.job_complete === true) {
            console.log("Job completed, jobId:", payload.new.job_id);

            // Decrement the job counter when a job is completed
            jobCounter--;
            console.log("Job counter:", jobCounter);
          }
        }
      )
      .subscribe();

    console.log("Subscription created:", subscription);

    // Return a cleanup function to remove the subscription and the timeout when they are no longer needed
    return () => {
      console.log("Cleaning up subscription for userId:", userId);
      supabase.removeSubscription(subscription);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [userId]); // Rerun this hook whenever userId changes

  const getCompanyTileInfo = async (userId) => {
    try {
      const { data, error } = await supabase.rpc("new_dashboard", {
        _userid: userId,
      });

      if (error) {
        console.error("Error fetching data:", error);
      }

      setCompanyInfo(data);
      setLoadingCards(false);
    } catch (error) {
      console.error("Error in get_dashboard:", error);
    }
  };

  // Fetch user session and set the userId
  useEffect(() => {
    setLoadingCards(true);
    getSession();
  }, []);

  // When userId state changes, fetch company tile info
  useEffect(() => {
    if (userId) {
      getCompanyTileInfo(userId);
    }
  }, [userId]);

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

  return (
    <>
      {" "}
      <Tabs>
        <TabList pb={3}>
          <Tab>Upcoming Meetings</Tab>
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
      <SimpleGrid spacing={10} minChildWidth='300px'>
        {companyInfo &&
          companyInfo.map((info) => {
            const isLoading =
              info.workspace_avatar &&
              info.workspace_avatar.logo &&
              !imageLoaded[info.workspace_avatar.logo];

            {
              /* const isLoading = !imageLoaded[info.workspace_avatar.logo]; */
            }
            return (
              <Card
                key={info.workspace_id}
                borderTop='2px'
                borderColor='blue.400'
                bg='white'
                loading={loadingCards}
              >
                <CardHeader p='0'>
                  <Flex
                    justifyContent='center'
                    alignItems='center'
                    maxHeight='70px'
                    overflow='hidden'
                  >
                    <Image
                      src='https://asset.brandfetch.io/idtTJnlm_T/idI_ebYyhw.jpeg'
                      maxHeight='100%'
                      width='auto'
                      height='auto'
                    />
                  </Flex>
                  <Flex gap={5}>
                    <Box position='relative'>
                      {isLoading ? (
                        <Spinner mt='5px' ml='5px' size='md' />
                      ) : (
                        <Avatar
                          position='absolute'
                          z-index='10px'
                          left='20px'
                          top='-50px'
                          bg='white'
                          transform='translateY(50%)'
                          src={info?.workspace_avatar?.logo || undefined}
                          name={info?.workspace_name}
                        />
                      )}
                    </Box>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box>
                    <Link
                      href={`/collabs/${info.workspace_id}/${info.workspace_name}`}
                    >
                      <Heading as='h3' size='sm'>
                        {info.workspace_name}
                        {/* <Badge marginTop='-15px' size='sm' colorScheme='green'>
                          2 Next Steps
                        </Badge> */}
                      </Heading>
                    </Link>
                    <Flex>
                      <Link href='https://secoda.co' isExternal>
                        <Icon
                          mr='3px'
                          style={{
                            transform: "translateY(2px)",
                          }}
                          as={FiLink}
                        />
                        secoda.co
                      </Link>
                      <Link>
                        <Icon
                          ml='3px'
                          mr='3px'
                          style={{
                            transform: "translateY(2px)",
                          }}
                          as={FaLinkedin}
                        ></Icon>
                      </Link>
                      <Link>
                        <Icon
                          ml='3px'
                          mr='3px'
                          style={{
                            transform: "translateY(2px)",
                          }}
                          as={RiTwitterFill}
                        ></Icon>
                      </Link>
                    </Flex>
                    {/* <Text>Led by {info.collab_user_name}</Text> */}
                    <Flex mt='10px' gap='1'>
                      <Icon
                        // ml='3px'

                        style={{
                          transform: "translateY(4px)",
                        }}
                        as={MdAttachMoney}
                      />
                      <Text>2.7m</Text>

                      <Icon
                        ml='3px'
                        mr='1px'
                        style={{
                          transform: "translateY(4px)",
                        }}
                        as={IoMdPeople}
                      />
                      <Text>11-20</Text>
                    </Flex>
                    <Box py='4'>
                      <Flex>
                        <Text fontWeight='medium' size='xs'>
                          Secoda is the fastest way to discover data. Get the
                          data catalog and lineage portal built for analytics
                          engineers and modern data teams.
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                  <Box bg='bg-surface' py='4'>
                    <Stack direction='row' justify='space-between' spacing='4'>
                      <HStack spacing='3'>
                        {/* <Checkbox /> */}
                        <Avatar
                          src={
                            info.attendee_avatar
                              ? info.attendee_avatar.headshot
                              : undefined
                          }
                          boxSize='10'
                          name={info.attendee_name}
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
                              {info.attendee_name}
                            </Text>
                            {/* <Badge
                          size='sm'
                          colorScheme={info.status === "lead" ? "green" : null}
                        >
                          {info.status}
                        </Badge> */}
                          </Flex>

                          <Text color='muted'>{info.attendee_job_title}</Text>
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
                      Current Time: {formatTime(info.attendee_timezone)}
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
                      Meeting Scheduled: {formatTime(info.attendee_timezone)}
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
