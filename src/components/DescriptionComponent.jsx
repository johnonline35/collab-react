import React, { useState } from "react";
import { Box, Flex, Text, Link } from "@chakra-ui/react";

function DescriptionComponent({ info }) {
  const defaultDescription =
    "This is a personal email account workspace. Workspaces of personal email accounts are not automatically associated with a specific company. This workspace still functions the same way as other company specific workspaces.";
  const [isExpanded, setIsExpanded] = useState(false);
  const description = info.description ? info.description : defaultDescription;
  const shouldShowReadMore = description.length > 43 && !isExpanded;

  const displayText = isExpanded
    ? description
    : description.substring(0, 39) + "... ";

  return (
    <Box py='4' height={isExpanded ? "auto" : "100px"} maxHeight='200px'>
      <Flex height='200px' maxHeight='200px'>
        <Text
          fontWeight='medium'
          size='xs'
          overflow={isExpanded ? "visible" : "auto"}
          textOverflow='ellipsis'
          maxHeight='200px'
        >
          {displayText}
          {shouldShowReadMore && (
            <Link color='blue.400' onClick={() => setIsExpanded(true)}>
              read more
            </Link>
          )}
        </Text>
      </Flex>
    </Box>
  );
}

export default DescriptionComponent;

{
  /* <span
              style={{ color: "blue.400", cursor: "pointer" }}
              onClick={() => setIsExpanded(true)}
            >
              ... read more
            </span> */
}
