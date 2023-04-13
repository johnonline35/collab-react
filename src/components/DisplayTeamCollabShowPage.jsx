import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Link,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { members } from "./data";
import { AttachmentIcon } from "@chakra-ui/icons";

const Card = (props) => (
  <Box minH='36' bg='bg-surface' boxShadow='sm' borderRadius='lg' {...props} />
);

export default function DisplayTeamCollabShowPage() {
  return (
    <Container
      py={{
        base: "0",
        md: "0",
      }}
      mb={{
        base: "10",
        md: "35",
      }}
    >
      <Stack
        spacing={{
          base: "12",
          md: "16",
        }}
      >
        <Stack
          spacing={{
            base: "8",
            md: "10",
          }}
        >
          <Stack spacing='3' align='center' textAlign='center'>
            {/* <Text
              fontSize={{
                base: "sm",
                md: "md",
              }}
              color='accent'
              fontWeight='semibold'
            >
              Blue Text
            </Text> */}
            <Stack
              spacing={{
                base: "4",
                md: "5",
              }}
            >
              <Heading
                size={{
                  base: "sm",
                  md: "md",
                }}
              >
                Meet your support team
              </Heading>
              <Text
                fontSize={{
                  base: "lg",
                  md: "xl",
                }}
                color='muted'
              >
                We are here to help whenever you need us - our contact details
                are below.
              </Text>
            </Stack>
          </Stack>
          {/* <Stack
            direction={{
              base: "column-reverse",
              md: "row",
            }}
            spacing='3'
            justify='center'
          >
            <Button variant='secondary' size='lg'>
              Reschedule Meeting
            </Button>
            <Button variant='primary' size='lg'>
              Book a meeting
            </Button>
          </Stack> */}
        </Stack>
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
          columnGap='8'
          rowGap={{
            base: "6",
            md: "8",
            lg: "16",
          }}
        >
          {members.map((member) => (
            <Box
              key={member.name}
              bg='bg-surface'
              p='6'
              boxShadow='sm'
              borderRadius='md'
            >
              <Stack spacing='4' align='center' textAlign='center'>
                <Stack>
                  <Stack
                    spacing={{
                      base: "4",
                      md: "5",
                    }}
                    align='center'
                  >
                    <Avatar
                      src={member.image}
                      boxSize={{
                        base: "16",
                        md: "20",
                      }}
                    />
                    <Box>
                      <Text fontWeight='medium' fontSize='lg'>
                        {member.name}
                      </Text>
                      <Text color='accent'>{member.role}</Text>
                    </Box>
                  </Stack>
                  <Text color='muted'>{member.description}</Text>

                  <Text color='muted'>{member.phone}</Text>
                </Stack>
                <HStack spacing='4' color='subtle'>
                  {[FaGithub, FaLinkedin, FaTwitter].map((item, id) => (
                    <Link href='#' key={id}>
                      <Icon as={item} boxSize='5' />
                    </Link>
                  ))}
                </HStack>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
        <Card p='12px' minH='xs'>
          <List>
            <ListItem>
              <ListIcon as={AttachmentIcon} color='black' />
              All Attachments
            </ListItem>
          </List>
        </Card>
      </Stack>
    </Container>
  );
}
