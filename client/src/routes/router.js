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
  RefundConfirmation,
  CreateGiftCard,
  RefundList,
  GiftCardsList,
  ResendGiftCard,
  TermsConditions,
  PrivacyPolicy,
  FaqPage,
  Issues,
  PaymentFailed,
  LoggedOut,
} from "../pages";
import GiftCardDetail from "../pages/issuance/GiftCardDetail";
import EditGiftCard from "../pages/issuance/EditGiftCard";
import ProtectedRoute from "../components/ProtectedRoutes/ProtectedRoute";
import { isUserAuthenticated } from "../utils/userAuthenticate";
import { checkAuthLoader } from "../utils/auth";

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
        path: "/home",
        element: <DashboardHome />,
      },
      {
        path: "/my-account",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-invoices",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <MyInvoices />
          </ProtectedRoute>
        ),
      },
      {
        path: "/current-usage",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <CurrentUsages />
          </ProtectedRoute>
        ),
      },
      {
        path: "/kyc-status",
        element: <KycProgress />,
      },
      {
        path: "/create-giftcard",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <CreateGiftCard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-gift-card",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <GiftCardsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-gift-card/:id",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <GiftCardDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-gift-card/:id",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <EditGiftCard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/resend-gift-card",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <ResendGiftCard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/refunds",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <RefundList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/refunds/:id",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <RefundPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/configuration",
        element: (
          <ProtectedRoute isAuthenticated={isUserAuthenticated}>
            <RefundSetting />
          </ProtectedRoute>
        ),
      },
      {
        path: "/terms-and-conditions",
        element: <TermsConditions />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/faqs",
        element: <FaqPage />,
      },
      {
        path: "/issues",
        element: <Issues />,
      },
      { path: "/refund_success", element: <RefundConfirmation /> },
      { path: "/payment-unsuccessful", element: <PaymentFailed /> },
      {
        path: "/log-out",
        element: <LoggedOut />,
      },
    ],
  },
  { path: "/select-plan", element: <PlanSelection /> },
  { path: "/submission_success", element: <ConfirmationPage /> },
]);

export default router;
