import {
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase/clientapp";

export default function CollabPageHome() {
  const params = useParams();
  const [emailLink, setEmailLink] = useState();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const getEmailLinkState = async () => {
    const { data, error } = await supabase
      .from("customer_table")
      .select()
      .eq("customer_id", params.customer_id);

    setEmailLink(data[0].enable_calendar_link);
    setCustomerName(data[0].customer_name);

    setLoadingToggle(false);
  };

  useEffect(() => {
    setLoadingToggle(true);
    getEmailLinkState();
  }, []);

  const updateEmailToggle = async () => {
    // console.log("toggle");
    const { data, error } = await supabase
      .from("customer_table")
      .update({ enable_calendar_link: !emailLink })
      .eq("customer_id", params.customer_id)
      .select();

    // console.log(data);

    setEmailLink(data[0].enable_calendar_link);
  };
  // console.log(companyInfoState);
  return (
    <>
      <Flex mb={5}>
        <Text>Home & Settings Page for: {customerName}</Text>
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
      </FormControl>
    </>
  );
}
