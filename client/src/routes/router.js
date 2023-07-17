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
  MyInvoices,
  CurrentUsages,
  TransactionDetail,
  RefundConfirmation,
  CreateGiftCard,
  RefundList,
  GiftCardsList,
  ResendGiftCard,
} from "../pages";
import GiftCardDetail from "../pages/issuance/GiftCardDetail";
import EditGiftCard from "../pages/issuance/EditGiftCard";
import ProtectedRoute from "../components/ProtectedRoutes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/:token",
        element: <DashboardHome />,
      },
      {
        path: "/home",
        element: <DashboardHome />,
      },
      {
        path: "/my-account",
        element: (
          <ProtectedRoute isAuthenticated={false}>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-invoices",
        element: <MyInvoices />,
      },
      {
        path: "/current-usage",
        element: <CurrentUsages />,
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
        element: <GiftCardsList />,
      },
      {
        path: "/my-gift-card/:id",
        element: <GiftCardDetail />,
      },
      {
        path: "/edit-gift-card/:id",
        element: <EditGiftCard />,
      },
      {
        path: "/resend-gift-card",
        element: <ResendGiftCard />,
      },
      {
        path: "/issue-store-credits",
        element: "",
      },
      {
        path: "/refunds",
        element: <RefundList />,
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
  { path: "/select-plan", element: <PlanSelection /> },
  { path: "/submission_success", element: <ConfirmationPage /> },
  { path: "/refund_success", element: <RefundConfirmation /> },
]);

export default router;
