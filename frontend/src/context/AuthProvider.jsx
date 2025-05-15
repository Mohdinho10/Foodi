import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";
import { setCredentials, logout } from "../slices/authSlice";
import axios from "axios";

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userInfo = {
          displayName: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
        };

        // Optional: Get JWT token from your backend
        try {
          const res = await axios.post("http://localhost:3000/jwt", {
            email: currentUser.email,
          });

          if (res.data.token) {
            localStorage.setItem("access-token", res.data.token);
          }
        } catch (err) {
          console.error("Error fetching token:", err);
        }

        // Update Redux
        dispatch(setCredentials(userInfo));
      } else {
        dispatch(logout());
        localStorage.removeItem("access-token");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
