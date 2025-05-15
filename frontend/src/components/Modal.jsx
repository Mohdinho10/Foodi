import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useCreateUserMutation } from "../slices/userApiSlice";
import app from "../firebase/firebase.config";
import { toast } from "react-hot-toast";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Modal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [createUserOnDB] = useCreateUserMutation();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email } = result.user;
      await createUserOnDB({ name: displayName, email });
      toast.success("Google login successful!");
      document.getElementById("my_modal_5").close();
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error.message);
      setErrorMessage("Google login failed.");
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password } = data;

    if (isLogin) {
      // Login flow
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await createUserOnDB({
          name: result.user.displayName || "No Name",
          email: result.user.email,
        });
        toast.success("Login successful!");
        reset();
        document.getElementById("my_modal_5").close();
        navigate(from, { replace: true });
      } catch (error) {
        console.error(error.message);
        setErrorMessage("Invalid email or password.");
      }
    } else {
      // Signup flow
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, { displayName: name });
        await createUserOnDB({ name, email });
        toast.success("Signup successful!");
        reset();
        document.getElementById("my_modal_5").close();
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Signup error:", error.message);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <dialog id="my_modal_5" className="modal">
      <div className="modal-box w-full max-w-md">
        {/* Close Button */}
        <button
          className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
          onClick={() => document.getElementById("my_modal_5").close()}
        >
          ✕
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <h3 className="text-center text-2xl font-bold">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h3>

          {/* Name Field (only in Signup) */}
          {!isLogin && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input-bordered input w-full focus:outline-none"
                {...register("name", { required: !isLogin })}
              />
              {errors.name && (
                <p className="text-sm text-red">Name is required</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input-bordered input w-full focus:outline-none"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-sm text-red">Email is required</p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input-bordered input w-full focus:outline-none"
              {...register("password", { required: true })}
            />
            {isLogin && (
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            )}
            {errors.password && (
              <p className="text-sm text-red">Password is required</p>
            )}
            {errorMessage && <p className="text-sm text-red">{errorMessage}</p>}
          </div>

          {/* Submit Button */}
          <div className="form-control">
            <button
              type="submit"
              className="hover:bg-green-600 btn bg-green text-white"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>

          {/* Toggle Mode */}
          <p className="text-center text-sm">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin((prev) => !prev);
                setErrorMessage("");
                reset();
              }}
              className="ml-1 text-red underline"
            >
              {isLogin ? "Signup Now" : "Login Here"}
            </button>
          </p>
        </form>

        {/* Divider */}
        <div className="divider my-4">Or continue with</div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoogleAuth}
            className="btn btn-circle bg-red text-white hover:bg-red"
            title="Google"
          >
            <FaGoogle />
          </button>
          <button
            className="btn btn-circle bg-blue-600 text-white hover:bg-blue-700"
            title="Facebook"
          >
            <FaFacebookF />
          </button>
          <button
            className="btn btn-circle bg-gray-800 text-white hover:bg-gray-900"
            title="GitHub"
          >
            <FaGithub />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
