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

  const getSession = async () => {
    const session = supabase.auth.session;

    if (!session) {
      console.log("No active session found.");
      return;
    }

    console.log("session data:", session);

    const refreshToken = session.provider_token;

    if (!refreshToken) {
      console.log("No refresh token found in session.");
      return;
    }

    const user = supabase.auth.user;

    if (!user) {
      console.log("No user found.");
      return;
    }

    const { data, error } = await supabase
      .from("collab_users")
      .update({ refresh_token: refreshToken })
      .match({ id: user.id });

    if (error) {
      console.error("Error updating refresh token:", error);
    } else {
      console.log("Successfully updated refresh token for user", user.id);
    }
  };

  const getCompanyTileInfo = async () => {
    try {
      const { data, error } = await supabase.rpc("get_dashboard");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Fetched data:", data);
      }

      setCompanyInfo(data);
      setLoadingCards(false);
    } catch (error) {
      console.error("Error in get_dashboard:", error);
    }
  };

  useEffect(() => {
    setLoadingCards(true);
    getSession();
    getCompanyTileInfo();

    // Set up an event listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);

        // If the event is USER_UPDATED, it means the user's session has been refreshed,
        // so we can try to get the session again
        if (event === "USER_UPDATED") {
          getSession();
        }
      }
    );

    // Clean up the event listener when the component is unmounted
    return () => {
      authListener.unsubscribe();
    };
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

  console.log("cookie", document.cookie);

  return (
    <>
      {" "}
      <Tabs>
        <TabList>
          <Tab>Upcoming Meetings</Tab>
          <Tab>Recently Viewed</Tab>
          <Tab>Custom Search</Tab>
          <Tab>Alerts</Tab>
        </TabList>

        <TabPanels>
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
        </TabPanels>
      </Tabs>
      <SimpleGrid spacing={10} minChildWidth='300px'>
        {companyInfo &&
          companyInfo.map((info) => {
            const isLoading = !imageLoaded[info.workspace_avatar.logo];
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
                          src={info.workspace_avatar.logo}
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
                          src={info.attendee_avatar.headshot}
                          boxSize='10'
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
