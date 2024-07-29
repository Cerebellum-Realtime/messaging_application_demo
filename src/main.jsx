/* eslint-disable react/prop-types */
// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CerebellumProvider } from "@cerebellum/sdk";
import { endpoint, CerebellumOptions } from "./CerebellumOptions";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CerebellumProvider endpoint={endpoint} options={CerebellumOptions}>
    <App />
  </CerebellumProvider>
);
