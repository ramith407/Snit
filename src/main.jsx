import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import { SnippetProvider } from "./context/SnippetContext";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnippetProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </SnippetProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

