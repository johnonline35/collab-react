import React, { Suspense } from "react";
import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const LazyLoadDashboard = React.lazy(() => import("./Dashboard"));

export function DashboardLoader() {
  const noOfCards = Array(20).fill(0);

  return (
    <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
      {noOfCards.map(() => (
        <Box mb='20px' width='300px' mr='10px' mt='20px'>
          <SkeletonCircle size='10' />
          <SkeletonText
            mt='4'
            noOfLines={8}
            spacing='4'
            mb='60px'
            skeletonHeight='2'
          />
          <SkeletonText noOfLines={1} spacing='4' skeletonHeight='2' />
        </Box>
      ))}
    </Box>
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
