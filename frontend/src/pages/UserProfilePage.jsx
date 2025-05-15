import { getAuth, updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";

const UserProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const auth = getAuth();
  const user = useSelector((state) => state.auth.userInfo); // From Redux

  const onSubmit = async (data) => {
    const name = data.name;

    const file = data.photoURL?.[0];
    let photoURL = auth.currentUser.photoURL;

    if (file) {
      // TODO: Replace this with actual image upload logic (e.g., Firebase Storage)
      photoURL = URL.createObjectURL(file); // Only for preview/demo purposes
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL,
      });

      const updatedUser = {
        displayName: name,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        photoURL,
      };

      dispatch(setCredentials(updatedUser));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="mx-auto flex h-screen max-w-md items-center justify-center">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              defaultValue={user?.displayName || ""}
              {...register("name", { required: true })}
              placeholder="Your name"
              className="input input-bordered"
            />
            {errors.name && (
              <p className="text-sm text-red-500">Name is required</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Photo</span>
            </label>
            <input
              type="file"
              {...register("photoURL")}
              className="file-input mt-1 w-full"
            />
          </div>

          <div className="form-control mt-6">
            <input
              type="submit"
              value="Update"
              className="btn bg-green text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
