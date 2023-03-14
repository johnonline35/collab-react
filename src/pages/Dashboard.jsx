import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Link,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/clientapp";
import { useRecoilState } from "recoil";
import { companyInfoState } from "../atoms/authAtom";
import { FetchWrapper } from "../util/helper";
import { DashboardLoader } from "./LazyLoadDashboard";

export default function Dashboard() {
  // const tasks = useLoaderData();
  // const params = useParams();
  const [companyInfo, setCompanyInfo] = useRecoilState(companyInfoState);
  const [loadingCards, setLoadingCards] = useState();

  // console.log(companyInfo);

  const getCompanyTileInfo = async () => {
    FetchWrapper(
      supabase.from("customer_table").select(),
      supabase.from("rep_table").select()
    ).then((results) => {
      // console.log("Check this one:", results);
      const [value1, value2] = results;
      const companyObject = value1.data;
      const reps = value2.data;
      for (let i = 0; i < companyObject.length; i++) {
        companyObject[i].rep = reps[0];
      }
      // console.log(data);
      setCompanyInfo(companyObject);
      setLoadingCards(false);
    });
  };
  // const { data, error } = await supabase.from("customer_table").select();
  // const { data: reps } = await supabase.from("rep_table").select();

  // TODO: Find rep based on ID

  // .eq("customer_id", params.customer_id);

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
            key={info.customer_id}
            borderTop='8px'
            borderColor='blue.400'
            bg='white'
            loading={loadingCards}
          >
            <CardHeader>
              <Flex gap={5}>
                {/* <Avatar src={info.img} /> */}
                <Box>
                  <Link href={`/collabs/${info.customer_id}`}>
                    <Heading as='h3' size='sm'>
                      {info.customer_name}
                    </Heading>
                  </Link>
                  <Text>Led by {info.rep.rep_name}</Text>
                </Box>
              </Flex>
            </CardHeader>
            <CardBody color='gray.500'>
              <Text>{info.lorem}</Text>
            </CardBody>

            <Divider borderColor='gray.200' />

            <CardFooter>
              <HStack>
                <Button
                  onClick={() => {}}
                  variant='ghost'
                  leftIcon={<ViewIcon />}
                >
                  View
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        ))}
    </SimpleGrid>
  );
}
