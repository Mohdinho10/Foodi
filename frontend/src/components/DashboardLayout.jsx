import { Link, Outlet, useNavigate } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize, MdClose } from "react-icons/md";
import {
  FaEdit,
  FaLocationArrow,
  FaPlusCircle,
  FaQuestionCircle,
  FaRegUser,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { useGetAdminStatusQuery } from "../slices/userApiSlice";
import { getAuth, signOut } from "firebase/auth";
import { logout } from "../slices/authSlice";
import logo from "/logo.png";
import { useState } from "react";

const DashboardLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data: adminData,
    isLoading: isAdminLoading,
    isError: isAdminError,
  } = useGetAdminStatusQuery(userInfo?.email, {
    skip: !userInfo?.email,
  });

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(logout());
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  if (!userInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Please log in.</p>
      </div>
    );
  }

  if (isAdminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-700">
          Checking admin access...
        </p>
      </div>
    );
  }

  if (isAdminError || !adminData?.admin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-xl text-red-500">Access Denied: Admins only</p>
        <Link to="/" className="bg-green btn text-white">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Sidebar (mobile + desktop) */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between border-r border-gray-200 bg-base-200 p-4 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-[100%]"
        } sm:static sm:translate-x-0`}
      >
        <div>
          {/* Close button for mobile */}
          <div className="mb-4 flex justify-end sm:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-700 focus:outline-none"
            >
              <MdClose className="text-3xl" />
            </button>
          </div>

          {/* Logo */}
          <Link to="/dashboard" className="mb-6 flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-16" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </Link>

          {/* Navigation links */}
          <ul className="space-y-3">
            <li>
              <Link
                onClick={() => setSidebarOpen(false)}
                to="/dashboard"
                className="flex items-center gap-2"
              >
                <MdDashboard /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSidebarOpen(false)}
                to="/dashboard"
                className="flex items-center gap-2"
              >
                <FaShoppingBag /> Manage Bookings
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSidebarOpen(false)}
                to="/dashboard/add-menu"
                className="flex items-center gap-2"
              >
                <FaPlusCircle /> Add Menu
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSidebarOpen(false)}
                to="/dashboard/manage-items"
                className="flex items-center gap-2"
              >
                <FaEdit /> Manage Items
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSidebarOpen(false)}
                to="/dashboard/users"
                className="flex items-center gap-2"
              >
                <FaUser /> All Users
              </Link>
            </li>

            <hr />

            <li>
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2"
              >
                <MdDashboard /> Home
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSidebarOpen(false)}
                to="/menu"
                className="flex items-center gap-2"
              >
                <FaCartShopping /> Menu
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSidebarOpen(false)}
                to="/orders"
                className="flex items-center gap-2"
              >
                <FaLocationArrow /> Orders Tracking
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSidebarOpen(false)}
                to="/support"
                className="flex items-center gap-2"
              >
                <FaQuestionCircle /> Customer Support
              </Link>
            </li>
          </ul>
        </div>

        {/* ✅ Logout pinned to bottom (desktop) */}
        <div className="mt-6 hidden sm:block">
          <button
            onClick={handleLogout}
            className="btn w-full justify-start gap-2 bg-myGreen text-white"
          >
            <FaRegUser /> Logout
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="z-10 flex flex-1 flex-col overflow-y-auto">
        {/* Top bar (mobile) */}
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-sm bg-myGreen text-white"
          >
            <MdDashboardCustomize className="text-lg" />
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-sm flex items-center gap-2 bg-myGreen text-white"
          >
            <FaRegUser /> Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
