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
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

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
        .from("profiles")
        .select(`username, job_title, avatar_url`)
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

      let { error } = await supabase.from("profiles").upsert(updates);

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
    <Tabs mt='40px' p='20px' colorScheme='blue' variant='enclosed'>
      <TabList>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>
          Account Settings
        </Tab>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>Team Settings</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <List spacing={4}>
            <ListItem>
              <ListIcon as={EmailIcon} />
              Email: john@instantcollab.co
            </ListItem>
            <ListItem>
              <ListIcon as={ChatIcon} />
              Lorem ipsum dolor dit amet consectuor
            </ListItem>
            <ListItem>
              <ListIcon as={StarIcon} />
              Lorem ipsum dolor dit amet consectuor
            </ListItem>
          </List>
        </TabPanel>
        <TabPanel>
          <List spacing={4}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color='teal.400' />
              Lorem ipsum dolor dit amet consectuor
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color='teal.400' />
              Lorem ipsum dolor dit amet consectuor
            </ListItem>
            <ListItem>
              <ListIcon as={WarningIcon} color='red.400' />
              Lorem ipsum dolor dit amet consectuor
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color='teal.400' />
              Lorem ipsum dolor dit amet consectuor
            </ListItem>
            <ListItem>
              <ListIcon as={WarningIcon} color='red.400' />
              Lorem ipsum dolor dit amet consectuor
            </ListItem>
          </List>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
