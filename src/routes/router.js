import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardHome from "../pages/DashboardHome";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <DashboardHome />,
      },
      {
        path: "/account_section",
      },
      {
        path: "/gift_card",
      },
      {
        path: "/store_credits",
      },
    ],
  },
]);

export default router;
