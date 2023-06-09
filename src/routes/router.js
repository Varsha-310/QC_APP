import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import {
  DashboardHome,
  ErrorPage,
  AccountPage,
  KycProgress,
  PlanSelection,
  ConfirmationPage,
  RefundPage,
  RefundSetting,
  TransactionDetail,
  TransactionHistory,
} from "../pages";

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
        path: "/billings",
        element: <AccountPage />,
      },
      {
        path: "/transactions",
        element: <TransactionDetail />,
      },
      {
        path: "/transactions/:id",
        element: <TransactionDetail />,
      },
      {
        path: "/gift_card",
      },
      {
        path: "/store_credits",
      },
      {
        path: "/refunds/:id",
        element: <RefundPage />,
      },
      {
        path: "/refund_settings",
        element: <RefundSetting />,
      },
    ],
  },
  { path: "plan_select", element: <PlanSelection /> },
  { path: "submission_success", element: <ConfirmationPage /> },
]);

export default router;
