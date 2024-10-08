import React, { Suspense } from "react";
import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Tabs,
  TabList,
  Tab,
  Text,
} from "@chakra-ui/react";

const LazyLoadDashboard = React.lazy(() => import("./Dashboard"));

export function DashboardLoader() {
  const noOfCards = Array(10).fill(0);

  // Some comment

  return (
    <>
      {" "}
      <Text fontSize='xl' as='b'>
        Dashboard
      </Text>
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
          <Box mb='20px' minW='xs' mr='10px' mt='20px'>
            <SkeletonCircle size='10' />
            <SkeletonText
              mt='4'
              noOfLines={8}
              spacing='4'
              mb='250px'
              skeletonHeight='2'
            />
            <SkeletonText noOfLines={1} spacing='4' skeletonHeight='2' />
          </Box>
        ))}
      </Box>
    </>
  );
}

function Dashboard({ userId }) {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <LazyLoadDashboard userId={userId} />
    </Suspense>
  );
}

export default Dashboard;
