import React, { createContext, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { contextValue } from "./utils/consts";

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Context.Provider value={contextValue}>
      <App />
    </Context.Provider>
  </StrictMode>
);
