import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/AppLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import DashboardLayout from "./components/DashBoardLayout";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import MenuItemPage from "./pages/MenuItemPage";
import OrdersPage from "./pages/OrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import AddMenuPage from "./pages/admin/AddMenuPage";
import ManageItemsPage from "./pages/admin/ManageItemsPage";
import UpdateMenuPage from "./pages/admin/UpdateMenuPage";
import AdminOrdersPage from "./pages/admin/OrdersPage";

function App() {
  return (
    <>
      <Toaster
        position="top-right" // 👈 Top-right corner
        toastOptions={{
          style: {
            zIndex: 9999, // 👈 Ensure it's above Navbar
          },
        }}
        reverseOrder={false}
      />
      <BrowserRouter>
        <Routes>
          {/* Main layout routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="menu/:id" element={<MenuItemPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="payment" element={<PaymentPage />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="orders" element={<OrdersPage />} />
              <Route path="update-profile" element={<UserProfilePage />} />
            </Route>
          </Route>

          {/* Dashboard routes */}
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoutes>
              <DashboardLayout />
              // </ProtectedRoutes>
            }
          >
            {/* Protected routes */}
            <Route element={<ProtectedRoutes />}>
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="add-menu" element={<AddMenuPage />} />
              <Route path="manage-items" element={<ManageItemsPage />} />
              <Route path="update-menu/:id" element={<UpdateMenuPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
