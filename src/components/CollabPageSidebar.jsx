import { EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Text, List, ListIcon, ListItem } from "@chakra-ui/react";
import { NavLink, useParams } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";

export default function Sidebar() {
  const params = useParams();
  return (
    <List color='white' fontSize='1.2em' spacing={4}>
      <ListItem>
        <NavLink to='/dashboard'>
          <ListIcon as={HamburgerIcon} color='white' /> Dashboard
        </NavLink>
      </ListItem>

      <Box my={1} pl='40px'>
        <Text fontSize='l' fontWeight='bold'>
          Heading
        </Text>
        <Box pl='10px'>
          <ListItem>
            <NavLink to={`/collabs/${params.workspace_id}`}>
              <ListIcon as={FiHome} color='white' /> Overview
            </NavLink>
          </ListItem>

          <ListItem>
            <NavLink to={`/collabs/${params.workspace_id}/notes`}>
              <ListIcon as={EditIcon} color='white' />
              Workspace AI
            </NavLink>
          </ListItem>

          <ListItem>
            <NavLink to={`/collabs/${params.workspace_id}/share`}>
              <ListIcon as={CgWebsite} color='white' />
              Collab Space
            </NavLink>
          </ListItem>
        </Box>
      </Box>
    </List>
  );
}

// import { EditIcon, HamburgerIcon } from "@chakra-ui/icons";
// import { List, ListIcon, ListItem } from "@chakra-ui/react";
// import { NavLink, useParams } from "react-router-dom";
// import { FiHome } from "react-icons/fi";

// import { CgWebsite } from "react-icons/cg";

// export default function Sidebar() {
//   const params = useParams();
//   return (
//     <List color='white' fontSize='1.2em' spacing={4}>
//       <ListItem>
//         <NavLink to='/dashboard'>
//           <ListIcon as={HamburgerIcon} color='white' /> Dashboard
//         </NavLink>
//       </ListItem>
//       <ListItem>
//         <NavLink to={`/collabs/${params.workspace_id}`}>
//           <ListIcon as={FiHome} color='white' /> Overview
//         </NavLink>
//       </ListItem>

//       <ListItem>
//         <NavLink to={`/collabs/${params.workspace_id}/notes`}>
//           <ListIcon as={EditIcon} color='white' />
//           Workspace AI
//         </NavLink>
//       </ListItem>

//       <ListItem>
//         <NavLink to={`/collabs/${params.workspace_id}/share`}>
//           <ListIcon as={CgWebsite} color='white' />
//           Collab Space
//         </NavLink>
//       </ListItem>
//     </List>
//   );
// }
