import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import {
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
} from "../../slices/menuApiSlice";

const UpdateMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const { data: item, isLoading, isError } = useGetMenuItemByIdQuery(id);
  const [updateMenuItem] = useUpdateMenuItemMutation();

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    try {
      let imageURL = item.image;

      // Only upload a new image if a file is selected
      if (data.image && data.image[0]) {
        const imageFile = { image: data.image[0] };
        const hostingImg = await axios.post(image_hosting_api, imageFile, {
          headers: { "content-type": "multipart/form-data" },
        });

        if (hostingImg.data.success) {
          imageURL = hostingImg.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const updatedItem = {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        recipe: data.recipe,
        image: imageURL,
      };

      await updateMenuItem({ id, ...updatedItem }).unwrap();

      reset();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your item updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/dashboard/manage-items");
    } catch (error) {
      console.error("Error updating item:", error);
      Swal.fire({
        title: "Error!",
        text: "There was a problem updating the item.",
        icon: "error",
      });
    }
  };

  if (isLoading) return <p className="py-10 text-center">Loading item...</p>;
  if (isError || !item)
    return (
      <p className="py-10 text-center text-red-500">Failed to load item.</p>
    );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h2 className="mb-6 text-center text-2xl font-semibold md:text-left">
        Update This <span className="text-green">Menu Item</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipe Name */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Recipe Name*</span>
          </label>
          <input
            type="text"
            defaultValue={item.name}
            {...register("name", { required: true })}
            placeholder="Recipe Name"
            className="input-bordered input w-full focus:outline-none"
          />
        </div>

        {/* Category & Price */}
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Category */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Category*</span>
            </label>
            <select
              {...register("category", { required: true })}
              defaultValue={item.category}
              className="select-bordered select w-full focus:outline-none"
            >
              <option disabled value="default">
                Select a category
              </option>
              <option value="salad">Salad</option>
              <option value="pizza">Pizza</option>
              <option value="soup">Soup</option>
              <option value="dessert">Dessert</option>
              <option value="drinks">Drinks</option>
              <option value="popular">Popular</option>
            </select>
          </div>

          {/* Price */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Price*</span>
            </label>
            <input
              type="number"
              defaultValue={item.price}
              {...register("price", { required: true })}
              placeholder="Price"
              className="input-bordered input w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Recipe Details */}
        <div className="form-control w-full">
          <label htmlFor="recipe-details" className="mb-1 text-gray-700">
            Recipe Details*
          </label>
          <textarea
            id="recipe-details"
            defaultValue={item.recipe}
            {...register("recipe", { required: true })}
            className="textarea-bordered textarea h-28 w-full resize-none focus:outline-none"
            placeholder="Tell the world about your recipe"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload Image*</span>
          </label>
          <input
            {...register("image", { required: true })}
            type="file"
            className="file-input-bordered file-input w-full max-w-xs focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center md:text-left">
          <button className="btn w-full bg-myGreen px-6 text-white md:w-auto">
            Update Item <FaUtensils className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMenu;
