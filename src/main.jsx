import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import MantineUXProvider from "./libraries/mantine.jsx";
import TanStackQueryProvider from "./libraries/tanstack_query.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MantineUXProvider>
        <TanStackQueryProvider>
          <App />
        </TanStackQueryProvider>
      </MantineUXProvider>
    </BrowserRouter>
  </StrictMode>
);
