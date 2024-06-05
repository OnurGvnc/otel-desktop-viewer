import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

import MainView, { mainLoader } from "./routes/main-view";
import TraceView, { traceLoader } from "./routes/trace-view";
import ErrorPage from "./error-page";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,

};
const theme = extendTheme({
  config,
  fonts: {
    body: "'MonospaceNeon', sans-serif",
    heading: "'MonospaceNeon', sans-serif",
    mono: "Menlo, monospace",
  },
  fontSizes: {
    xs: "10px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    "2xl": "20px",
    "3xl": "24px",
    "4xl": "28px",
    "5xl": "36px",
    "6xl": "48px",
  },
  lineHeights: {
    normal: "normal",
    none: "1",
    shorter: "1.25",
    short: "1.375",
    base: "1.5",
    tall: "1.625",
    taller: "2",
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
  fontWeights: {
    normal: 300,
    medium: 400,
    bold: 600,
  },
  styles: {
    global: {
      body: {
        fontFamily: 'MonospaceNeon, sans-serif',
        color: '#fff',
        backgroundColor: '#000',
        fontSize: '10px',
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainView />,
    loader: mainLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "traces/:traceID",
        element: <TraceView />,
        loader: traceLoader,
      },
    ],
  },
]);

const container = document.getElementById("root");
if (!!container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </React.StrictMode>,
  );
}
