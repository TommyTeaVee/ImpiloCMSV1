import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot, hydrateRoot } from "react-dom/client";

import App from "./App";
import { InitialDataContext } from "./initialData";
import "uikit/dist/css/uikit.min.css";
import "./index.css";

const el = document.getElementById("root");

const app = (
  <React.StrictMode>
    <InitialDataContext.Provider value={window.__DATA__ || {}}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </InitialDataContext.Provider>
  </React.StrictMode>
);

if (el.firstElementChild) {
  hydrateRoot(el, app);
} else {
  createRoot(el).render(app);
}