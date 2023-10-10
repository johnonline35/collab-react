import { Grid, GridItem } from "@chakra-ui/react";
import { Outlet, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import CollabPageSidebar from "../components/CollabPageSidebar";
import { fetchWorkspaceName } from "../util/database";
import { useSession } from "../hooks/useSession";
import { useEffect } from "react";

export default async function CollabPageLayout() {
  const { workspace_id } = useParams();
  const session = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    console.log("SESSION FFS:", session);
  }, [session]);

  const workspaceName = await fetchWorkspaceName(userId, workspace_id);

  return (
    <Grid templateColumns='repeat(6, 1fr)' bg='gray.50'>
      <GridItem
        as='aside'
        colSpan={{ base: 6, lg: 2, xl: 1 }}
        bg='blue.400'
        minHeight={{ lg: "100vh" }}
        p={{ base: "20px", lg: "30px" }}
      >
        <CollabPageSidebar
          userId={userId}
          workspace_id={workspace_id}
          workspaceName={workspaceName}
        />
      </GridItem>
      <GridItem as='main' colSpan={{ base: 6, lg: 4, xl: 5 }} p='40px'>
        <Navbar userId={userId} />
        <Outlet />
      </GridItem>
    </Grid>
  );
}
