import avatarImg from "/images/avatar2.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { logout } from "../slices/authSlice";
import app from "../firebase/firebase.config";
import {
  useGetAdminStatusQuery,
  useLogoutMutation,
} from "../slices/userApiSlice"; // Import the logout mutation

const auth = getAuth(app);

const Profile = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: adminData } = useGetAdminStatusQuery(user?.email, {
    skip: !user?.email,
  });

  console.log("Admin Data:", adminData);
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      await logoutRequest(); // Backend logout (clears cookie)
      dispatch(logout()); // Redux state update
      navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-4"
            className="drawer-button avatar btn btn-ghost btn-circle"
          >
            <div className="w-10 rounded-full">
              {user?.photoURL ? (
                <img alt="User Avatar" src={user.photoURL} />
              ) : (
                <img alt="Default Avatar" src={avatarImg} />
              )}
            </div>
          </label>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
            <li>
              <Link to="/update-profile">Profile</Link>
            </li>
            <li>
              <Link to="/orders">Order</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            {adminData?.admin && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
