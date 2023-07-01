import React, { Suspense } from "react";
import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";

const LazyLoadDashboard = React.lazy(() => import("./Dashboard"));

export function DashboardLoader() {
  const noOfCards = Array(20).fill(0);

  return (
    <>
      {" "}
      <Tabs>
        <TabList pb={3}>
          <Tab>Workspaces</Tab>
          {/* <Tab>Recently Viewed</Tab>
          <Tab>Custom Search</Tab>
          <Tab>Alerts</Tab> */}
        </TabList>

        {/* <TabPanels>
          <TabPanel>
            <p>Group</p>
          </TabPanel>
          <TabPanel>
            <p>Individual</p>
          </TabPanel>
          <TabPanel>
            <p>All</p>
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
        </TabPanels> */}
      </Tabs>
      <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
        {noOfCards.map(() => (
          <Box mb='20px' minW='sm' mr='10px' mt='20px'>
            <SkeletonCircle size='10' />
            <SkeletonText
              mt='4'
              noOfLines={8}
              spacing='4'
              mb='160px'
              skeletonHeight='2'
            />
            <SkeletonText noOfLines={1} spacing='4' skeletonHeight='2' />
          </Box>
        ))}
      </Box>
    </>
  );
}

function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <LazyLoadDashboard />
    </Suspense>
  );
}

export default Dashboard;
