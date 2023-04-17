import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/index";
import GeneNetworkPage from "./pages/gene/network";
import { loader as orthologPairLoader } from "./helpers/ortholog-pair.helpers";
import "./index.css";
import ErrorPage from "./pages/error";
import { ChakraProvider } from "@chakra-ui/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/network/gene/:geneid",
        element: <GeneNetworkPage />,
        loader: orthologPairLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
