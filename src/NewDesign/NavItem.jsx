import { Box, HStack } from "@chakra-ui/react";
import { BsCaretRightFill } from "react-icons/bs";

export const NavItem = (props) => {
  const { active, subtle, icon, children, label, endElement, href } = props;
  return (
    <HStack
      as='a'
      href={href}
      w='full'
      px='3'
      py='2'
      cursor='pointer'
      userSelect='none'
      rounded='md'
      transition='all 0.2s'
      bg={active ? "blue.300" : undefined}
      _hover={{
        bg: "blue.300",
      }}
      _active={{
        bg: "blue.300",
      }}
    >
      <Box fontSize='lg' color={active ? "currentcolor" : "blue.100"}>
        {icon}
      </Box>
      <Box
        flex='1'
        fontWeight='inherit'
        color={subtle ? "blue.100" : undefined}
      >
        {label}
      </Box>
      {endElement && !children && <Box>{endElement}</Box>}
      {children && <Box fontSize='xs' flexShrink={0} as={BsCaretRightFill} />}
    </HStack>
  );
};
