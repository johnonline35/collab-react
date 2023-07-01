import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabase/clientapp";
import {
  ChatIcon,
  CheckCircleIcon,
  EmailIcon,
  StarIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  List,
  ListIcon,
  ListItem,
  Tab,
  Text,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  StackDivider,
  Textarea,
} from "@chakra-ui/react";
import { Dropzone } from "../components/Dropzone";
import EditProfile from "../components/EditProfile";
import { useSession } from "../hooks/useSession";

export default function Account() {
  const session = useSession();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [companyname, setCompanyname] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [socialUrl, setSocialUrl] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [bio, setBio] = useState(null);

  useEffect(() => {
    if (session) {
      setEmail(session.user?.email);
      getProfile(); // Only call getProfile if session is not null
    }
  }, [session]);

  const getProfile = async () => {
    console.log("Session user:", session?.user);

    try {
      setLoading(true);
      if (!session || !session.user) {
        throw new Error("Not logged in");
      }
      const { user } = session;
      console.log("user:", user);

      let { data, error } = await supabase
        .from("collab_users")
        .select(
          `collab_user_name, collab_user_email, company_name, collab_user_job_title, collab_user_avatar_url, collab_user_socials, phone_number, bio`
        )
        .eq("collab_user_email", user.email)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setUsername(data.collab_user_name);

        setCompanyname(data.company_name);
        setJobTitle(data.collab_user_job_title);
        setAvatarUrl(data.collab_user_avatar_url);
        setSocialUrl(data.collab_user_socials?.linkedin);
        setPhoneNumber(data.phone_number);
        setBio(data.bio);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        collab_user_name: username,
        company_name: companyname,
        collab_user_job_title: jobTitle,
        collab_user_avatar_url: avatarUrl,
        collab_user_socials: socialUrl ? { linkedin: socialUrl } : null,
        phone_number: phoneNumber,
        bio: bio,
        updated_at: new Date(),
      };

      let { error } = await supabase
        .from("collab_users")
        .update(updates)
        .eq("collab_user_email", user.email);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs mt='10px' p='20px' colorScheme='blue' variant='enclosed'>
      <TabList>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>
          Account Settings
        </Tab>
        {/* <Tab _selected={{ color: "white", bg: "blue.400" }}>Team Settings</Tab> */}
      </TabList>
      <Container
        py={{
          base: "4",
          md: "8",
        }}
      >
        <Stack spacing='5'>
          <Stack
            spacing='4'
            direction={{
              base: "column",
              sm: "row",
            }}
            justify='space-between'
          >
            <Box>
              <Text color='muted' fontSize='sm'>
                Tell your partners who you are and how to contact you
              </Text>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing='5' divider={<StackDivider />}>
            <FormControl id='name'>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify='space-between'
              >
                <FormLabel variant='inline'>Name</FormLabel>
                <Input
                  maxW={{
                    md: "3xl",
                  }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Stack>
            </FormControl>
            <FormControl id='email'>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify='space-between'
              >
                <FormLabel variant='inline'>Email</FormLabel>
                <Input
                  type='email'
                  maxW={{
                    md: "3xl",
                  }}
                  value={email}
                />
              </Stack>
            </FormControl>
            <FormControl id='companyName'>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify='space-between'
              >
                <FormLabel variant='inline'>Company Name</FormLabel>
                <Input
                  type='companyName'
                  maxW={{
                    md: "3xl",
                  }}
                  value={companyname}
                  onChange={(e) => setCompanyname(e.target.value)}
                />
              </Stack>
            </FormControl>
            <FormControl id='phone'>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify='space-between'
              >
                <FormLabel variant='inline'>Phone</FormLabel>
                <Input
                  type='phone'
                  maxW={{
                    md: "3xl",
                  }}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Stack>
            </FormControl>
            <FormControl id='picture'>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify='space-between'
              >
                <FormLabel variant='inline'>Photo</FormLabel>
                <Stack
                  spacing={{
                    base: "3",
                    md: "5",
                  }}
                  direction={{
                    base: "column",
                    sm: "row",
                  }}
                  width='full'
                  maxW={{
                    md: "3xl",
                  }}
                >
                  <Avatar
                    size='lg'
                    name='John Childs-Eddy'
                    src='https://lh3.googleusercontent.com/a/AGNmyxb7QUWBr69-91RRmDn276lrbHDfnbZoMwpwNlavYw=s96'
                  />
                  <Dropzone width='full' />
                </Stack>
              </Stack>
            </FormControl>
            <FormControl id='website'>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify='space-between'
              >
                <FormLabel variant='inline'>LinkedIn</FormLabel>
                <InputGroup
                  maxW={{
                    md: "3xl",
                  }}
                >
                  <InputLeftAddon>https://</InputLeftAddon>
                  <Input
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                  />
                </InputGroup>
              </Stack>
            </FormControl>
            <FormControl id='bio'>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify='space-between'
              >
                <Box>
                  <FormLabel variant='inline'>Bio</FormLabel>
                  <FormHelperText mt='0' color='muted'>
                    Write a short introduction
                  </FormHelperText>
                </Box>
                <Textarea
                  maxW={{
                    md: "3xl",
                  }}
                  rows={5}
                  resize='none'
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Stack>
            </FormControl>

            <Flex direction='row-reverse'>
              <Button colorScheme='blue' onClick={updateProfile}>
                Save
              </Button>
            </Flex>
          </Stack>
        </Stack>
      </Container>

      {/* <TabPanels>
        <TabPanel>
          <Text>Edit Profile</Text>
          <EditProfile />
        </TabPanel>
        <TabPanel>
          <Text>Add Profile</Text>
          <EditProfile />
        </TabPanel>
      </TabPanels> */}
    </Tabs>
  );
}
