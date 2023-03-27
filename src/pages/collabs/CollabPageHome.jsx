import {
  Flex,
  FormControl,
  FormLabel,
  Switch,
  EditablePreview,
  Editable,
  EditableInput,
  Spinner,
  Heading,
  Text,
  Card,
  SimpleGrid,
  Stack,
  Container,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase/clientapp";
import { FiDownloadCloud } from "react-icons/fi";

export default function CollabPageHome() {
  const params = useParams();
  const [emailLink, setEmailLink] = useState();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const getEmailLinkStateAndName = async () => {
    const { data, error } = await supabase
      .from("attendee_companies")
      .select()
      .eq("attendee_company_id", params.attendee_company_id);

    setEmailLink(data[0].attendee_company_enable_calendar_link);
    setCustomerName(data[0].attendee_company_name);

    setLoadingToggle(false);
  };

  useEffect(() => {
    setLoadingToggle(true);
    getEmailLinkStateAndName();
  }, []);

  useEffect(() => {
    console.log(customerName);
  }, [customerName]);

  const updateEmailToggle = async () => {
    // console.log("toggle");
    const { data, error } = await supabase
      .from("attendee_companies")
      .update({ attendee_company_enable_calendar_link: !emailLink })
      .eq("attendee_company_id", params.attendee_company_id)
      .select();

    setEmailLink(data[0].attendee_company_enable_calendar_link);
  };

  return (
    <>
      <Flex
        as='section'
        direction={{
          base: "column",
          lg: "row",
        }}
        height='400vh'
        bg='bg-canvas'
        overflowY='auto'
      >
        <Container py='8' flex='1'>
          <Stack
            spacing={{
              base: "8",
              lg: "6",
            }}
          >
            <Stack
              spacing='4'
              direction={{
                base: "column",
                lg: "row",
              }}
              justify='space-between'
              align={{
                base: "start",
                lg: "center",
              }}
            >
              <Stack spacing='1'>
                <Heading
                  size={{
                    base: "xs",
                    lg: "sm",
                  }}
                  fontWeight='medium'
                >
                  Dashboard
                </Heading>
                <Text color='muted'>All important metrics at a glance</Text>
              </Stack>
              <HStack spacing='3'></HStack>
            </Stack>
            <Stack
              spacing={{
                base: "5",
                lg: "6",
              }}
            >
              <SimpleGrid
                columns={{
                  base: 1,
                  md: 3,
                }}
                gap='6'
              >
                <Card />
                <Card />
                <Card />
              </SimpleGrid>
            </Stack>
            <Card minH='lg' />
          </Stack>
        </Container>
      </Flex>
    </>
  );
}

{
  /* <Flex direction='column' mb={5}> */
}
{
  /* <Text>{customerName}</Text> */
}
{
  /* <Text fontSize='2xl'>
          <Editable maxWidth='400px' value={customerName}>
            <EditablePreview />
            <EditableInput
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Editable>
        </Text>
      </Flex>

      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='email-alerts' mb='0'>
          Enable calendar links?
        </FormLabel>
        {loadingToggle ? (
          <Spinner />
        ) : (
          <Switch
            id='email-alerts'
            isChecked={emailLink}
            onChange={() => updateEmailToggle()}
            loading={loadingToggle}
          />
        )}
      </FormControl> */
}
