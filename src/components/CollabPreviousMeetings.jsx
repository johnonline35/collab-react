import {
  Stack,
  StackDivider,
  Text,
  Box,
  Flex,
  ListItem,
  ListIcon,
  Container,
} from "@chakra-ui/react";
import { MdCheckCircle, MdSettings } from "react-icons/md";

const PreviousMeetings = () => {
  return (
    <Box
      as='section'
      py={{
        base: "4",
        md: "8",
      }}
    >
      <Container maxW='3xl'>
        <Box
          bg='bg-surface'
          borderRadius='lg'
          p={{
            base: "4",
            md: "6",
          }}
        >
          <Stack spacing='5' divider={<StackDivider />}>
            <Stack spacing='1'>
              <Text fontSize='md' fontWeight='medium'>
                Previous Meetings
              </Text>
              <Box>
                <Flex direction='column'>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color='green.500' />
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color='green.500' />
                    Assumenda, quia temporibus eveniet a libero incidunt
                    suscipit
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color='green.500' />
                    Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdSettings} color='green.500' />
                    Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
                  </ListItem>
                </Flex>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PreviousMeetings;
