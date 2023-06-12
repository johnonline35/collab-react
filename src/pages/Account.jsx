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
} from "@chakra-ui/react";
import EditProfile from "../components/EditProfile";
import { SessionContext } from "../privateRoute";

export default function Account() {
  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [socialUrl, setSocialUrl] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [bio, setBio] = useState(null);

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return;
    }

    setSession(data); // Set the session with the received data
  };

  useEffect(() => {
    getSession(); // Fetch the session when the component is mounted
  }, []);

  useEffect(() => {
    if (session) {
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

      let { data, error, status } = await supabase
        .from("collab_users")
        .select(
          `collab_user_name, collab_user_job_title, collab_user_avatar_url, collab_user_socials, phone_number, bio`
        )
        .eq("collab_user_email", user.email)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.collab_user_name);
        setJobTitle(data.collab_user_job_title);
        setAvatarUrl(data.collab_user_avatar_url);
        setSocialUrl(data.collab_user_socials.linkedin);
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
        id: user.id,
        collab_user_name: username,
        collab_user_job_title: jobTitle,
        collab_user_avatar_url: avatarUrl,
        collab_user_socials: { linkedin: socialUrl },
        phone_number: phoneNumber,
        bio: bio,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("collab_users").upsert(updates);

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
      <EditProfile />

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
