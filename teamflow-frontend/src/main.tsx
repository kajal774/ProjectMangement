import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// Provider order matters here:
// 1. BrowserRouter - so every component can use routing hooks (useNavigate, etc.)
// 2. QueryClientProvider - so every component can use React Query (useQuery/useMutation)
// 3. AuthProvider - depends on nothing above except being inside the tree
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
        {/* Devtools only render in development builds */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
