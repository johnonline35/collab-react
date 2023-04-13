import { Divider, Stack, Text } from "@chakra-ui/react";
import { StepCircle } from "./StepCircle";

export const Step = (props) => {
  const {
    isActive,
    isCompleted,
    isLastStep,
    title,
    description,
    ...stackProps
  } = props;
  return (
    <Stack spacing='4' direction='row' {...stackProps}>
      <Stack spacing='0' align='center'>
        <StepCircle isActive={isActive} isCompleted={isCompleted} />
        <Divider
          orientation='vertical'
          borderWidth='1px'
          borderColor={
            isCompleted ? "accent" : isLastStep ? "transparent" : "inherit"
          }
        />
      </Stack>
      <Stack spacing='0.5' pb={isLastStep ? "0" : "18"}>
        <Text color='emphasized' fontWeight='medium'>
          {title}
        </Text>
        <Text color='muted'>{description}</Text>
      </Stack>
    </Stack>
  );
};
