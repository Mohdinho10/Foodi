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

        try {
          // ✅ This will store the token in a cookie
          await axios.post(
            "http://localhost:3000/jwt",
            { email: currentUser.email },
            { withCredentials: true }, // ✅ Important!
          );

          dispatch(setCredentials(userInfo));
        } catch (err) {
          console.error("Error fetching token:", err);
        }
      } else {
        dispatch(logout());
        // No need to remove token from localStorage anymore
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
