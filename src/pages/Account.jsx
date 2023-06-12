import { useState, useEffect } from "react";
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

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [job_title, setJobTitle] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("collab_users")
        .select(
          `collab_user_name, collab_user_job_title, collab_user_avatar_url`
        )
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setJobTitle(data.job_title);
        setAvatarUrl(data.avatar_url);
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
        username,
        job_title,
        avatar_url,
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
        <Tab _selected={{ color: "white", bg: "blue.400" }}>Team Settings</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Text>Edit Profile</Text>
          <EditProfile />
        </TabPanel>
        <TabPanel>
          <Text>Add Profile</Text>
          <EditProfile />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
