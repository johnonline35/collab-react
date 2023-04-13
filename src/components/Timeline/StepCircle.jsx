import { Circle, Icon } from "@chakra-ui/react";
import { HiCheck } from "react-icons/hi";

export const StepCircle = (props) => {
  const { isCompleted, isActive } = props;
  return (
    <Circle
      size='8'
      bg={isCompleted ? "accent" : "inherit"}
      borderWidth={isCompleted ? "0" : "2px"}
      borderColor={isActive ? "accent" : "inherit"}
      {...props}
    >
      {isCompleted ? (
        <Icon as={HiCheck} color='inverted' boxSize='5' />
      ) : (
        <Circle bg={isActive ? "accent" : "border"} size='3' />
      )}
    </Circle>
  );
};
