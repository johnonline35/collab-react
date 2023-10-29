import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  createMultiStyleConfigHelpers,
  ChakraProvider,
  extendTheme,
  theme as baseTheme,
} from "@chakra-ui/react";
import { theme as proTheme } from "@chakra-ui/pro-theme";
import { cardAnatomy } from "@chakra-ui/anatomy";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    backgroundColor: "#FF0000",
  },
  header: {
    paddingBottom: "2px",
  },
  body: {
    paddingTop: "2px",
  },
  footer: {
    paddingTop: "2px",
  },
});

const sizes = {
  md: definePartsStyle({
    container: {
      borderRadius: "0px",
    },
  }),
};

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes });

// extend the theme
const colors = {
  brand: {
    900: "#024fc9",
    800: "#146af5",
    700: "#2977f2",
    600: "#337df2",
    500: "#4287f5",
  },
};
const fonts = {
  body: "Tahoma",
  heading: "Courier New",
};

const theme = extendTheme(
  {
    colors: { ...baseTheme.colors, brand: baseTheme.colors.blue },
  },
  proTheme
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <ChakraProvider theme={theme}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </ChakraProvider>
  </RecoilRoot>
);
