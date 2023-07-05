import {
  AtSignIcon,
  AttachmentIcon,
  ChatIcon,
  CalendarIcon,
  EditIcon,
  ArrowRightIcon,
  SunIcon,
  QuestionOutlineIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { List, ListIcon, ListItem } from "@chakra-ui/react";
import { NavLink, useParams } from "react-router-dom";
import { FiDollarSign, FiUsers, FiShare, FiHome } from "react-icons/fi";
import { SlRocket } from "react-icons/sl";
import { GoFileDirectoryFill } from "react-icons/go";

export default function Sidebar() {
  const params = useParams();
  return (
    <List color='white' fontSize='1.2em' spacing={4}>
      <ListItem>
        <NavLink to='/dashboard'>
          <ListIcon as={HamburgerIcon} color='white' /> Dashboard
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          to={`/collabs/${params.workspace_id}/${params.workspace_name}`}
        >
          <ListIcon as={FiHome} color='white' /> Overview
        </NavLink>
      </ListItem>
      {/* <ListItem>
        <NavLink to={`/collabs/${params.attendee_company_id}/team`}>
          <ListIcon as={FiUsers} color='white' />
          Team
        </NavLink>
      </ListItem> */}
      <ListItem>
        <NavLink
          to={`/collabs/${params.workspace_id}/${params.workspace_name}/notes`}
        >
          <ListIcon as={EditIcon} color='white' />
          Workspace AI
        </NavLink>
      </ListItem>
      {/* <ListItem>
        <NavLink to={`/collabs/${params.attendee_company_id}/nextsteps`}>
          <ListIcon as={ArrowRightIcon} color='white' />
          Next Steps
        </NavLink>
      </ListItem> */}
      {/* <ListItem>
        <NavLink
          to={`/collabs/${params.workspace_id}/${params.workspace_name}/journey`}
        >
          <ListIcon as={SlRocket} color='white' />
          Journey
        </NavLink>
      </ListItem> */}
      {/* <ListItem>
        <NavLink to={`/collabs/${params.attendee_company_id}/proposals`}>
          <ListIcon as={SunIcon} color='white' />
          Proposals
        </NavLink>
      </ListItem> */}
      {/* <ListItem>
        <NavLink to={`/collabs/${params.attendee_company_id}/currentstate`}>
          <ListIcon as={InfoOutlineIcon} color='white' />
          Current State
        </NavLink>
      </ListItem> */}
      {/* <ListItem>
        <NavLink to={`/collabs/${params.attendee_company_id}/legaldocuments`}>
          <ListIcon as={AtSignIcon} color='white' />
          Legal Documents
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink to={`/collabs/${params.attendee_company_id}/pricing`}>
          <ListIcon as={FiDollarSign} color='white' />
          Pricing
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink to={`/collabs/${params.attendee_company_id}/timeline`}>
          <ListIcon as={CalendarIcon} color='white' />
          Timeline(s)
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink to={`/collabs/${params.attendee_company_id}/questions`}>
          <ListIcon as={ChatIcon} color='white' />
          Realtime Q&A
        </NavLink>
      </ListItem> */}

      <ListItem>
        <NavLink
          to={`/collabs/${params.workspace_id}/${params.workspace_name}/showcase`}
        >
          <ListIcon as={FiShare} color='white' />
          Collab Show Page
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink
          to={`/collabs/${params.workspace_id}/${params.workspace_name}/files`}
        >
          <ListIcon as={GoFileDirectoryFill} color='white' />
          Files
        </NavLink>
      </ListItem>
    </List>
  );
}
