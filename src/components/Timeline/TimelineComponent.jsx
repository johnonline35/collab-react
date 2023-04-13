import { Box, Center, Container, Stack } from "@chakra-ui/react";
import { steps } from "./data";
import { Step } from "./Step";
import { useStep } from "./useStep";

export const TimelineComponent = () => {
  const [currentStep, { setStep }] = useStep({
    maxStep: steps.length,
    initialStep: 4,
  });
  return (
    <Box bg='bg-surface'>
      <Container
        py={{
          base: "4",
          md: "8",
        }}
      >
        <Center>
          <Stack spacing='0'>
            {steps.map((step, id) => (
              <Step
                key={id}
                cursor='pointer'
                onClick={() => setStep(id)}
                title={step.title}
                description={step.description}
                isActive={currentStep === id}
                isCompleted={currentStep > id}
                isLastStep={steps.length === id + 1}
              />
            ))}
          </Stack>
        </Center>
      </Container>
    </Box>
  );
};
