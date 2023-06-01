import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardHome from "../pages/DashboardHome";
import ErrorPage from "../pages/ErrorPage";
import PlanSelection from "../pages/PlanSelection";
import ConfirmationPage from "../pages/ConfirmationPage";
import KycProgress from "../pages/KycProgress";
import AccountPage from "../pages/AccountPage";

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
        element: <AccountPage />,
      },
      {
        path: "/gift_card",
      },
      {
        path: "/store_credits",
      },
    ],
  },
  { path: "plan_select", element: <PlanSelection /> },
  { path: "submission_success", element: <ConfirmationPage /> },
]);

export default router;
