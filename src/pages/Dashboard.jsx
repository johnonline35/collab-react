import { EditIcon } from "@chakra-ui/icons";
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

import { DashboardLoader } from "./LazyLoadDashboard";
import { useImageLoaded } from "../hooks/useImageLoaded";
import { FiLink } from "react-icons/fi";
// import { FaLinkedin } from "react-icons/fa";
import { SiCrunchbase } from "react-icons/si";
import { IoMdPeople } from "react-icons/io";
// import { AiFillFacebook } from "react-icons/ai";
import { GrFacebook, GrLinkedin, GrTwitter } from "react-icons/gr";
import { formatTime } from "../hooks/useFormatTime";

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

  const getWorkspaceData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("collab_user_id", userId);

      if (error) {
        console.error("Error fetching workspace data:", error);
        return null;
      }

      console.log("Workspace data:", data);
      return data;
    } catch (error) {
      console.error("Unexpected error fetching workspace data:", error);
      return null;
    }
  };

  // Fetch Google Calendar via Server and process the response

  const getCompanyTileInfo = async (userId) => {
    try {
      const { data, error } = await supabase.rpc("new_test_dashboard", {
        _userid: userId,
      });

      if (error) {
        console.error("Error fetching data:", error);
      }

      console.log("datanewtestdasboard:", data);
      setCompanyInfo(data);

      // Update the Redis cache with the new company info
      // const response = await fetch("/api/redisSetCompanyInfo", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ userId, data }),
      // });

      // if (!response.ok) {
      //   throw new Error(`Server error: ${response.statusText}`);
      // }
    } catch (error) {
      console.error("Error in test_dashboard:", error);
    } finally {
      // Always run this last after the async operation above finishes
      // setLoadingCards(false);
    }
  };

  // Fetch user session and set the userId
  useEffect(() => {
    setLoadingCards(true);

    const getMeetings = async (userId) => {
      console.log("NEWuserId:", userId);
      console.log("Starting getMeetings");
      if (!userId) return; // Do not proceed if there's no user ID
      console.log("Passed userId check");

      // Fetch and load the local workspace data first, if any
      // let workspaceData = await getWorkspaceData(userId);
      // if (workspaceData) {
      //   console.log("Loaded workspace data:", workspaceData);
      //   // Call getCompanyTileInfo with userId when workspace data is present
      //   getCompanyTileInfo(userId);
      // }

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

        getCompanyTileInfo(userId);
      } else {
        console.error("Error getting meetings:", response.status);
      }
    };

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

  useEffect(() => {
    if (companyInfo !== null) {
      setLoadingCards(false);
    }
  }, [companyInfo]);

  if (loadingCards) {
    return <DashboardLoader />;
  }

  // function formatTime(timeString) {
  //   // Create a date object from the timeString
  //   const utcDate = new Date(timeString);

  //   // Get the timezone offset in minutes for the current locale
  //   const timezoneOffsetMinutes = new Date().getTimezoneOffset();

  //   // Convert the offset to milliseconds and subtract it from the UTC time to get the local time
  //   const localDate = new Date(
  //     utcDate.getTime() - timezoneOffsetMinutes * 60 * 1000
  //   );

  //   const options = { month: "long", day: "numeric" };
  //   const dayMonth = new Intl.DateTimeFormat("en-US", options).format(
  //     localDate
  //   );

  //   const timeOptions = {
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true,
  //     // timeZoneName: "short",
  //   };
  //   const time = new Intl.DateTimeFormat("en-US", timeOptions).format(
  //     localDate
  //   );

  //   return `${dayMonth} at ${time}`;
  // }

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
            <p>Group</p>
          </TabPanel>
          <TabPanel>
            <p>Individual</p>
          </TabPanel>
          <TabPanel>
            <p>All</p>
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
        </TabPanels> */}
      </Tabs>
      <SimpleGrid mt={6} spacing={10} minChildWidth='300px'>
        {companyInfo &&
          companyInfo
            .sort((a, b) => {
              // Check if next_meeting_date is present in both items
              if (a.next_meeting_date && b.next_meeting_date) {
                return (
                  new Date(a.next_meeting_date) - new Date(b.next_meeting_date)
                );
              }
              // If next_meeting_date is only present in one of the items, that item should come first
              else if (a.next_meeting_date) {
                return -1;
              } else if (b.next_meeting_date) {
                return 1;
              }
              // If next_meeting_date is not present in either item, sort by last_meeting_date in descending order
              else {
                return (
                  new Date(b.last_meeting_date) - new Date(a.last_meeting_date)
                );
              }
            })
            .map((info) => {
              const displayName = info.attendee_name || "Enter Name";
              const displayTitle = info.attendee_job_title || "Enter Title";
              {
                /* console.log("companyInfo:", companyInfo);
              console.log(
                "Does start_dateTime exist?",
                "start_dateTime" in info
              );
              console.log("rawDate", info.next_meeting_date); */
              }
              return (
                <Card
                  key={info.workspace_id}
                  borderTop='2px'
                  borderColor='blue.400'
                  bg='white'
                  loading={loadingCards}
                  minW='xs'
                  maxW='lg'
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
                          src={
                            info.icon_src ||
                            info.image ||
                            "images/custom/blue-avatar.jpeg"
                          }
                          name={info.workspace_name}
                        />
                      </Box>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Box>
                      <Link href={`/collabs/${info.workspace_id}`} mb={1}>
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
                      <Stack
                        direction='row'
                        justify='space-between'
                        spacing='4'
                      >
                        <HStack spacing='3'>
                          {/* <Checkbox /> */}
                          <Avatar
                            src={
                              info
                                ? info.image
                                : "https://i.ibb.co/2662rGf/blue-avatar.jpg"
                            }
                            // src={info ? info.image : undefined}
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
                      <Link href={`/collabs/${info.workspace_id}/notes`}>
                        <Button
                          leftIcon={<EditIcon />}
                          variant='secondary'
                          width='250px'
                        >
                          Workspace AI
                        </Button>
                        {/* {info.workspace_id} */}
                      </Link>
                    </Flex>
                  </CardBody>
                  <Divider borderColor='gray.200' />

                  <CardFooter>
                    <HStack>
                      {info.next_meeting_date ? (
                        <Text size='xs' color='gray.400'>
                          Next meeting: {formatTime(info.next_meeting_date)}
                        </Text>
                      ) : (
                        <Text size='xs' color='gray.400'>
                          Last meeting: {formatTime(info.last_meeting_date)}
                        </Text>
                      )}
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
