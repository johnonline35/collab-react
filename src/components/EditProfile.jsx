import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Dropzone } from "./Dropzone";

export default function EditProfile() {
  return (
    <Container
      py={{
        base: "4",
        md: "8",
      }}
    >
      <Stack spacing='5'>
        <Stack
          spacing='4'
          direction={{
            base: "column",
            sm: "row",
          }}
          justify='space-between'
        >
          <Box>
            <Text color='muted' fontSize='sm'>
              Tell your customers who you are and how to contact you
            </Text>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing='5' divider={<StackDivider />}>
          <FormControl id='name'>
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              spacing={{
                base: "1.5",
                md: "8",
              }}
              justify='space-between'
            >
              <FormLabel variant='inline'>Name</FormLabel>
              <Input
                maxW={{
                  md: "3xl",
                }}
                defaultValue='John Childs-Eddy'
              />
            </Stack>
          </FormControl>
          <FormControl id='email'>
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              spacing={{
                base: "1.5",
                md: "8",
              }}
              justify='space-between'
            >
              <FormLabel variant='inline'>Email</FormLabel>
              <Input
                type='email'
                maxW={{
                  md: "3xl",
                }}
                defaultValue='john@instantcollab.co'
              />
            </Stack>
          </FormControl>
          <FormControl id='phone'>
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              spacing={{
                base: "1.5",
                md: "8",
              }}
              justify='space-between'
            >
              <FormLabel variant='inline'>Phone</FormLabel>
              <Input
                type='phone'
                maxW={{
                  md: "3xl",
                }}
                preview='+1 (555) 555-5555'
              />
            </Stack>
          </FormControl>
          <FormControl id='picture'>
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              spacing={{
                base: "1.5",
                md: "8",
              }}
              justify='space-between'
            >
              <FormLabel variant='inline'>Photo</FormLabel>
              <Stack
                spacing={{
                  base: "3",
                  md: "5",
                }}
                direction={{
                  base: "column",
                  sm: "row",
                }}
                width='full'
                maxW={{
                  md: "3xl",
                }}
              >
                <Avatar
                  size='lg'
                  name='John Childs-Eddy'
                  src='https://lh3.googleusercontent.com/a/AGNmyxb7QUWBr69-91RRmDn276lrbHDfnbZoMwpwNlavYw=s96'
                />
                <Dropzone width='full' />
              </Stack>
            </Stack>
          </FormControl>
          <FormControl id='website'>
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              spacing={{
                base: "1.5",
                md: "8",
              }}
              justify='space-between'
            >
              <FormLabel variant='inline'>LinkedIn</FormLabel>
              <InputGroup
                maxW={{
                  md: "3xl",
                }}
              >
                <InputLeftAddon>https://</InputLeftAddon>
                <Input defaultValue='www.linkedin.com/yourprofileURL' />
              </InputGroup>
            </Stack>
          </FormControl>
          <FormControl id='bio'>
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              spacing={{
                base: "1.5",
                md: "8",
              }}
              justify='space-between'
            >
              <Box>
                <FormLabel variant='inline'>Bio</FormLabel>
                <FormHelperText mt='0' color='muted'>
                  Write a short introduction about you
                </FormHelperText>
              </Box>
              <Textarea
                maxW={{
                  md: "3xl",
                }}
                rows={5}
                resize='none'
              />
            </Stack>
          </FormControl>

          <Flex direction='row-reverse'>
            <Button colorScheme='blue'>Save</Button>
          </Flex>
        </Stack>
      </Stack>
    </Container>
  );
}
