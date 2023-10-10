import { EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Text, List, ListIcon, ListItem } from "@chakra-ui/react";
import { NavLink, useParams } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import { useSession } from "../hooks/useSession";
import { fetchWorkspaceName } from "../util/database";
import { useEffect } from "react";

export default async function Sidebar(workspace_id) {
  const session = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    console.log("SESSION FFS:", session);
  }, [session]);

  const workspaceName = await fetchWorkspaceName(userId, workspace_id);
  return (
    <List color='white' fontSize='1.2em' spacing={4}>
      <ListItem>
        <NavLink to='/dashboard'>
          <ListIcon as={HamburgerIcon} color='white' /> Dashboard
        </NavLink>
      </ListItem>

      <Box pl='45px'>
        <Text mb='15px' fontSize='l'>
          {workspaceName}
        </Text>
        <Box pl='17px'>
          <List spacing={4}>
            <ListItem>
              <NavLink to={`/collabs/${workspace_id}`}>
                <ListIcon as={FiHome} color='white' /> Overview
              </NavLink>
            </ListItem>

            <ListItem>
              <NavLink to={`/collabs/${workspace_id}/notes`}>
                <ListIcon as={EditIcon} color='white' />
                Workspace AI
              </NavLink>
            </ListItem>

            <ListItem>
              <NavLink to={`/collabs/${workspace_id}/share`}>
                <ListIcon as={CgWebsite} color='white' />
                Collab Space
              </NavLink>
            </ListItem>
          </List>
        </Box>
      </Box>
    </List>
  );
}
