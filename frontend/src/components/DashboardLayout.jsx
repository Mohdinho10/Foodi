import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
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
import { useSelector } from "react-redux";
import { useGetAdminStatusQuery } from "../slices/userApiSlice";

import logo from "/logo.png";
import Login from "./Login";

const sharedLinks = (
  <>
    <li className="mt-3">
      <Link to="/">
        <MdDashboard /> Home
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaCartShopping /> Menu
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaLocationArrow /> Orders Tracking
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaQuestionCircle /> Customer Support
      </Link>
    </li>
  </>
);

const DashboardLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: adminData,
    isLoading: isAdminLoading,
    isError: isAdminError,
  } = useGetAdminStatusQuery(userInfo?.email, {
    skip: !userInfo?.email,
  });

  if (!userInfo) {
    return <Login />;
  }

  if (isAdminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">
          Checking admin status...
        </p>
      </div>
    );
  }

  if (isAdminError || !adminData?.isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Link to="/">
          <button className="btn bg-green text-white">Back to Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="drawer sm:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content my-2 flex flex-col sm:items-start sm:justify-start">
        {/* Top bar */}
        <div className="mx-4 flex items-center justify-between">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <MdDashboardCustomize />
          </label>
          <button className="btn bg-green flex items-center gap-2 rounded-full px-6 text-white sm:hidden">
            <FaRegUser /> Logout
          </button>
        </div>

        {/* Page content */}
        <div className="mx-4 mt-5 md:mt-2">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <li>
            <Link
              to="/dashboard"
              className="mb-3 flex items-center justify-start gap-2"
            >
              <img src={logo} alt="Logo" className="w-20" />
              <span className="badge badge-primary">admin</span>
            </Link>
          </li>
          <hr />
          <li className="mt-3">
            <Link to="/dashboard">
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard">
              <FaShoppingBag /> Manage Bookings
            </Link>
          </li>
          <li>
            <Link to="/dashboard/add-menu">
              <FaPlusCircle /> Add Menu
            </Link>
          </li>
          <li>
            <Link to="/dashboard/manage-items">
              <FaEdit /> Manage Items
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/dashboard/users">
              <FaUser /> All Users
            </Link>
          </li>
          <hr />
          {sharedLinks}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
