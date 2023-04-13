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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/clientapp";

import { DashboardLoader } from "./LazyLoadDashboard";
import { useImageLoaded } from "../hooks/useImageLoaded";

export default function Dashboard() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const imageLoaded = useImageLoaded(
    companyInfo,
    loadedImages,
    setLoadedImages
  );

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
    getCompanyTileInfo();
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
    <SimpleGrid spacing={10} minChildWidth='300px'>
      {companyInfo &&
        companyInfo.map((info) => {
          const isLoading = !imageLoaded[info.workspace_avatar.logo];
          return (
            <Card
              key={info.workspace_id}
              borderTop='8px'
              borderColor='blue.400'
              bg='white'
              loading={loadingCards}
            >
              <CardHeader minHeight='140px'>
                <Flex gap={5}>
                  <Box position='relative'>
                    {isLoading ? (
                      <Spinner mt='5px' ml='5px' size='md' />
                    ) : (
                      <Avatar src={info.workspace_avatar.logo} />
                    )}
                  </Box>
                  <Box>
                    <Link
                      href={`/collabs/${info.workspace_id}/${info.workspace_name}`}
                    >
                      <Heading as='h3' size='sm'>
                        {info.workspace_name}
                        <Badge mt='-20px' size='sm' colorScheme='gray'>
                          2 Next Steps
                        </Badge>
                      </Heading>
                    </Link>
                    <Text>Led by {info.collab_user_name}</Text>
                  </Box>
                </Flex>
              </CardHeader>
              <CardBody color='gray.500'>
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
                      Notes
                    </Button>
                  </Link>
                </Flex>
              </CardBody>
              <Divider borderColor='gray.200' />

              {/* <CardFooter>
              <HStack>
                <Button
                  onClick={() => {}}
                  variant='ghost'
                  leftIcon={<ViewIcon />}
                >
                  View
                </Button>
              </HStack>
            </CardFooter> */}
            </Card>
          );
        })}
    </SimpleGrid>
  );
}
