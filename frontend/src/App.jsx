import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DashboardLayout from "./components/DashBoardLayout";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import UserProfilePage from "./pages/UserProfilePage";
import CartPage from "./pages/CartPage";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import AddMenuPage from "./pages/admin/AddMenuPage ";
import ManageItemsPage from "./pages/admin/ManageItemsPage ";
import UpdateMenuPage from "./pages/admin/UpdateMenuPage ";

function App() {
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/orders" element={<MenuPage />} />
          <Route path="/update-profile" element={<UserProfilePage />} />
        </Route>
      </Route>
      {/* Auth routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {/* Dashboard layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <DashboardLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/add-menu" element={<AddMenuPage />} />
        <Route path="/manage-items" element={<ManageItemsPage />} />
        <Route path="/update-menu/:id" element={<UpdateMenuPage />} />
      </Route>
    </Routes>
  </BrowserRouter>;
}

export default App;
