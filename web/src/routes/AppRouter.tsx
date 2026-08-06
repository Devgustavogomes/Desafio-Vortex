import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../features/landing/LandingPage";
import { LoginPage } from "../features/auth/pages/LoginPage/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MyItemsPage } from "../features/items/pages/MyItemsPage/MyItemsPage";
import { NewItemPage } from "../features/items/pages/NewItemPage/NewItemPage";
import { EditItemPage } from "../features/items/pages/EditItemPage/EditItemPage";
import { FeedPage } from "../features/items/pages/FeedPage/FeedPage";
import { OrdersPage } from "../features/orders/pages/OrdersPage/OrdersPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/my-items"
        element={
          <ProtectedRoute>
            <MyItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-items/new"
        element={
          <ProtectedRoute>
            <NewItemPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-items/edit/:id"
        element={
          <ProtectedRoute>
            <EditItemPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
