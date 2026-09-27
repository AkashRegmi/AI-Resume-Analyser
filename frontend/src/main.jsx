import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./app/router.jsx";
import { queryClient } from "./app/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {" "}
        <RouterProvider router={router} />
      </AuthProvider>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            background: "#064E3B",
            color: "#FFFFFF",
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
