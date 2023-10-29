import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

// define custom styles for funky variant
const variants = {
  funky: definePartsStyle({
    container: {
      borderColor: "red",
      borderWidth: "3px",
    },
  }),
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({ variants });
