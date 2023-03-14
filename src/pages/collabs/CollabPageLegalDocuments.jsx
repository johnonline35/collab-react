import { Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageLegalDocuments() {
  const params = useParams();

  return (
    <>
      <Flex mb='20px'>
        <Text>Legal Documents for {params.customer_id}</Text>
      </Flex>
      <Flex direction='column' mb='20px'>
        <Text mb='10px'>
          This page will pull any legal documents sent through email and nest
          those attachments on this page. To get an attachment listed on this
          page we will find it by getting the user to type "#l" in any email
          message body that they send to designate that the attachment to that
          email is a legal document that should be listed here.
        </Text>
        <Text mb='5px'>
          (Or they can just drag and drop the correct document(s) from the "All
          Attachments" component into this menu.)
        </Text>
      </Flex>
    </>
  );
}
