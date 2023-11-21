import {
  Box,
  Container,
  Stack,
  StackDivider,
  Switch,
  Spinner,
  Text,
} from "@chakra-ui/react";

export const CollabWorkspaceSettings = ({
  emailLink,
  setEmailLink,
  updateEmailToggle,
  loadingToggle,
  workspace_id,
}) => {
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
          // p={{
          //   base: "4",
          //   md: "6",
          // }}
        >
          <Stack spacing='5' divider={<StackDivider />}>
            <Stack justify='space-between' direction='row' spacing='4'>
              <Stack spacing='0.5' fontSize='sm'>
                <Text color='emphasized' fontWeight='medium'>
                  Calendar links
                </Text>
                <Text color='muted'>
                  Automatically add a collab space link into your calendar
                  invitations with the team from this workspace
                </Text>
              </Stack>
              {loadingToggle ? ( // Add this conditional rendering block
                <Spinner />
              ) : (
                <Switch isChecked={emailLink} onChange={updateEmailToggle} />
              )}
            </Stack>
            {/* <Stack justify='space-between' direction='row' spacing='4'>
              <Stack spacing='0.5' fontSize='sm'>
                <Text color='emphasized' fontWeight='medium'>
                  Your team
                </Text>
                <Text color='muted'>Add your team to this workspace</Text>
              </Stack>
              <Switch defaultChecked={true} />
            </Stack> */}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
