import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useCreateUserMutation } from "../slices/userApiSlice";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import { toast } from "react-hot-toast";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Signup = () => {
  const [createUserOnDB] = useCreateUserMutation();
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, email, password } = data;

    try {
      // Firebase signup
      await createUserWithEmailAndPassword(auth, email, password);

      // Update Firebase display name
      await updateProfile(auth.currentUser, { displayName: name });

      // Store user in DB via RTK
      await createUserOnDB({ name, email });

      toast.success("Signup successful! Redirecting...");
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email } = result.user;

      // Store user in DB via RTK
      await createUserOnDB({ name: displayName, email });

      toast.success("Google signup successful! Redirecting...");
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error(error.message || "Google signup failed.");
    }
  };

  return (
    <div className="mx-auto my-24 flex w-full max-w-md items-center justify-center bg-white shadow">
      <div className="mb-5">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-lg font-bold">Please Create An Account!</h3>

          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="input-bordered input focus:outline-none"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">Name is required</p>
            )}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input-bordered input focus:outline-none"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input-bordered input focus:outline-none"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">Password is required</p>
            )}
          </div>

          <div className="form-control mt-6">
            <input
              type="submit"
              className="btn bg-green text-white"
              value="Sign up"
            />
          </div>

          <div className="my-2 text-center">
            Have an account?
            <Link to="/login">
              <button className="ml-2 underline">Login here</button>
            </Link>
          </div>
        </form>

        <div className="space-x-3 text-center">
          <button
            onClick={handleGoogleSignup}
            className="btn btn-circle hover:bg-green hover:text-white"
          >
            <FaGoogle />
          </button>
          <button className="btn btn-circle hover:bg-green hover:text-white">
            <FaFacebookF />
          </button>
          <button className="btn btn-circle hover:bg-green hover:text-white">
            <FaGithub />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
