import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./routes/router.js";
import Navbar from "./layouts/Navbar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Navbar/>
    <RouterProvider router={router} />
  </>
);
