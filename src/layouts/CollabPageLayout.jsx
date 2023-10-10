import { Grid, GridItem } from "@chakra-ui/react";
import { Outlet, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import CollabPageSidebar from "../components/CollabPageSidebar";

export default async function CollabPageLayout() {
  return (
    <Grid templateColumns='repeat(6, 1fr)' bg='gray.50'>
      <GridItem
        as='aside'
        colSpan={{ base: 6, lg: 2, xl: 1 }}
        bg='blue.400'
        minHeight={{ lg: "100vh" }}
        p={{ base: "20px", lg: "30px" }}
      >
        <CollabPageSidebar />
      </GridItem>
      <GridItem as='main' colSpan={{ base: 6, lg: 4, xl: 5 }} p='40px'>
        <Navbar />
        <Outlet />
      </GridItem>
    </Grid>
  );
}
