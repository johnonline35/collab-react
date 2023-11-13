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

// import { Grid, GridItem } from "@chakra-ui/react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import { NewApp } from "../NewDesign/NewApp";

// export default function RootLayout() {
//   return (
//     <Grid templateColumns='repeat(6, 1fr)' bg='gray.50'>
//       <GridItem
//         as='aside'
//         colSpan={{ base: 6, lg: 2, xl: 1 }}
//         bg='blue.400'
//         minHeight={{ lg: "100vh" }}
//         p={{ base: "20px", lg: "30px" }}
//       >
//         <NewApp />
//       </GridItem>
//       <GridItem as='main' colSpan={{ base: 6, lg: 4, xl: 5 }} p='40px'>
//         <Navbar />
//         <Outlet />
//       </GridItem>
//     </Grid>
//   );
// }
