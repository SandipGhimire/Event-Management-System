import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/css/index.css";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from "react-router";
import { router } from "./router/index.router.ts";
import { ToastContainer } from "react-toastify";

const root = document.getElementById("root");

createRoot(root!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
  </StrictMode>
);
