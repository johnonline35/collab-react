import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Link,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Avatar,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/clientapp";
import { FetchWrapper } from "../util/helper";
import { DashboardLoader } from "./LazyLoadDashboard";

export default function Dashboard() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loadingCards, setLoadingCards] = useState(false);

  const getCompanyTileInfo = async () => {
    FetchWrapper(
      supabase.from("attendee_companies").select(),
      supabase.from("collab_users").select(),
      supabase.from("collab_user_workspaces").select()
    ).then((results) => {
      // console.log("Check this one:", results);
      const [value1, value2] = results;
      const companyObject = value1.data;
      const collabUser = value2.data;
      for (let i = 0; i < companyObject.length; i++) {
        companyObject[i].collabUser = collabUser[0];
      }
      console.log(results);
      setCompanyInfo(companyObject);
      setLoadingCards(false);
    });
  };

  // TODO: Find rep based on ID

  useEffect(() => {
    setLoadingCards(true);
    getCompanyTileInfo();
  }, []);

  if (loadingCards) {
    return <DashboardLoader />;
  }

  return (
    <SimpleGrid spacing={10} minChildWidth='300px'>
      {companyInfo &&
        companyInfo.map((info) => (
          <Card
            key={info.attendee_company_id}
            borderTop='8px'
            borderColor='blue.400'
            bg='white'
            loading={loadingCards}
          >
            <CardHeader>
              <Flex gap={5}>
                <Avatar src={info.attendee_company_avatar_url} />
                <Box>
                  <Link href={`/collabs/${info.attendee_company_id}`}>
                    <Heading as='h3' size='sm'>
                      {info.attendee_company_name}
                    </Heading>
                  </Link>
                  <Text>Led by {info.collabUser.collab_user_name}</Text>
                </Box>
              </Flex>
            </CardHeader>
            <CardBody color='gray.500'>
              <Text>{info.lorem}</Text>
            </CardBody>

            <Divider borderColor='gray.200' />

            {/* <CardFooter>
              <HStack>
                <Button
                  onClick={() => {}}
                  variant='ghost'
                  leftIcon={<ViewIcon />}
                >
                  View
                </Button>
              </HStack>
            </CardFooter> */}
          </Card>
        ))}
    </SimpleGrid>
  );
}
