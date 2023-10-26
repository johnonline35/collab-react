import {
  Flex,
  Text,
  Tabs,
  Tab,
  TabList,
  TabIndicator,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Lexical
import "../../../src/styles.css";
// import LexicalEditor from "../../LexcialEditor";
import PlaygroundApp from "../../v2LexicalPlayground/App";

import CollabPageHome from "./CollabPageHome";

export default function CollabPageNotes({ customerName }) {
  const params = useParams();
  console.log(params);

  return (
    <>
            <PlaygroundApp />
    </>
  );
}

//   return (
//     <>
//       {" "}
//       <Text fontSize='xl' as='b'>
//         {customerName}
//       </Text>
//       <Tabs variant='unstyled'>
//         <TabList>
//           <Tab>Overview</Tab>
//           <Tab>Notes</Tab>
//         </TabList>
//         <TabIndicator
//           mt='-1.5px'
//           height='2px'
//           bg='blue.400'
//           borderRadius='1px'
//         />
//         <TabPanels>
//           <TabPanel>
//             <CollabPageHome />
//           </TabPanel>
//           <TabPanel>
//             <PlaygroundApp />
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </>
//   );
// }
