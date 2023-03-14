import { Flex, Text, Avatar, Badge, Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CollabPageTeam() {
  const params = useParams();

  return (
    <>
      <Flex ml='150px' mb='60px'>
        <Text>Team Page for: {params.customer_id}</Text>
      </Flex>
      <Flex borderStyle='1px solid gray.200' width='550px' ml='150px'>
        <Avatar src='https://lh3.googleusercontent.com/a/AGNmyxb7QUWBr69-91RRmDn276lrbHDfnbZoMwpwNlavYw=s96' />
        <Box ml='3'>
          <Text fontWeight='bold'>
            John Childs-Eddy
            <Badge ml='1' colorScheme='green'>
              Primary
            </Badge>
          </Text>
          <Text fontSize='sm'>Account Director</Text>
          <Text fontSize='sm'>johnchildseddy@gmail.com</Text>
          <Text fontSize='sm'>Ph: +61 434 145 075</Text>
          <Text fontSize='xs'>Local time: 13:22 </Text>
        </Box>
      </Flex>
    </>
  );
}
