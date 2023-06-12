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
  RefundConfirmation,
  CreateGiftCard,
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
        path: "/billings",
        element: <AccountPage />,
      },
      {
        path: "/transactions",
        element: <TransactionHistory />,
      },
      {
        path: "/transactions/:id",
        element: <TransactionDetail />,
      },

      {
        path: "/kyc-status",
        element: <KycProgress />,
      },
      {
        path: "/create-giftcard",
        element: <CreateGiftCard />,
      },
      {
        path: "/my-gift-card",
        element: "",
      },
      {
        path: "/resend-gift-card",
        element: "",
      },
      {
        path: "/issue-store-credits",
        element: "",
      },
      {
        path: "/refunds",
        element: "",
      },
      {
        path: "/refunds/:id",
        element: <RefundPage />,
      },
      {
        path: "/configuration",
        element: <RefundSetting />,
      },
    ],
  },
  { path: "/plan_select", element: <PlanSelection /> },
  { path: "/submission_success", element: <ConfirmationPage /> },
  { path: "/refund_success", element: <RefundConfirmation /> },
]);

export default router;
