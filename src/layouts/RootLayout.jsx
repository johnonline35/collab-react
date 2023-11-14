import { Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RootLayout({ userEmail, userId }) {
  return (
    <Grid templateColumns='repeat(6, 1fr)' bg='gray.50'>
      <GridItem as='main' colSpan={6} p='20px' bg='blue.400' w='100%'>
        {" "}
        {/* Span the full width for the Navbar */}
        <Navbar userEmail={userEmail} userId={userId} />
      </GridItem>
      <GridItem as='main' colSpan={6} pt='10px' pl='40px' pr='40px' pb='40px'>
        {" "}
        {/* Span the full width for the Outlet */}
        <Outlet />
      </GridItem>
    </Grid>
  );
}
