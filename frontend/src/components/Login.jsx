import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import { useCreateUserMutation } from "../slices/userApiSlice";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await createUser({
        name: user.displayName || "No Name",
        email: user.email,
      });

      alert("Login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorMessage("Please provide a valid email & password.");
    } finally {
      reset();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await createUser({ name: user.displayName, email: user.email });

      alert("Google login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error.message);
      setErrorMessage("Google login failed.");
    }
  };

  return (
    <div className="relative mx-auto my-20 max-w-md rounded-lg bg-white p-8 shadow-xl">
      {/* Close button top-right */}
      <Link to="/">
        <button
          aria-label="Close login form"
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-1 text-gray-600 transition hover:bg-gray-200 hover:text-gray-800"
        >
          ✕
        </button>
      </Link>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Please Login!
        </h2>

        {/* Email */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium text-gray-700">Email</span>
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            className="input-bordered focus:ring-green-500 focus:border-green-500 input w-full rounded-md border-gray-300 shadow-sm transition duration-200 focus:outline-none focus:ring-2"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red">Email is required</p>
          )}
        </div>

        {/* Password */}
        <div className="form-control w-full">
          <label className="label flex items-center justify-between">
            <span className="label-text font-medium text-gray-700">
              Password
            </span>
            {/* <a
              href="#"
              className="label-text-alt text-green-600 hover:text-green-800 link-hover text-sm"
            >
              Forgot password?
            </a> */}
          </label>
          <input
            type="password"
            placeholder="Your password"
            className="input-bordered focus:ring-green-500 focus:border-green-500 input w-full rounded-md border-gray-300 shadow-sm transition duration-200 focus:outline-none focus:ring-2"
            {...register("password", { required: true })}
          />
          {errorMessage && (
            <p className="mt-2 text-xs italic text-red">{errorMessage}</p>
          )}
          {errors.password && (
            <p className="mt-1 text-sm text-red">Password is required</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-md bg-green py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-green"
        >
          Login
        </button>

        <p className="text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 hover:text-green-800 font-semibold underline"
          >
            Signup Now
          </Link>
        </p>
      </form>

      {/* Social login buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleGoogleLogin}
          aria-label="Login with Google"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-red shadow transition hover:bg-red hover:text-white"
        >
          <FaGoogle size={20} />
        </button>
        <button
          aria-label="Login with Facebook"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-blue-700 shadow transition hover:bg-blue-700 hover:text-white"
        >
          <FaFacebookF size={20} />
        </button>
        <button
          aria-label="Login with Github"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-800 shadow transition hover:bg-gray-800 hover:text-white"
        >
          <FaGithub size={20} />
        </button>
      </div>
    </div>
  );
};

export default Login;
