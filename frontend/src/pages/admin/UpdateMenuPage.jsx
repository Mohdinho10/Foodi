import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { useUpdateMenuItemMutation } from "../../slices/menuApiSlice";

const UpdateMenu = () => {
  const item = useLoaderData();
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const [updateMenuItem] = useUpdateMenuItemMutation();

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    try {
      const imageFile = { image: data.image[0] };
      const hostingImg = await axios.post(image_hosting_api, imageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (hostingImg.data.success) {
        const updatedItem = {
          name: data.name,
          category: data.category,
          price: parseFloat(data.price),
          recipe: data.recipe,
          image: hostingImg.data.data.display_url,
        };

        await updateMenuItem({ id: item._id, ...updatedItem }).unwrap();

        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your item updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/manage-items");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      Swal.fire({
        title: "Error!",
        text: "There was a problem updating the item.",
        icon: "error",
      });
    }
  };

  return (
    <div className="mx-auto w-full px-4 md:w-[870px]">
      <h2 className="my-4 text-2xl font-semibold">
        Update This <span className="text-green">Menu Item</span>
      </h2>

      {/* form here */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Recipe Name*</span>
          </label>
          <input
            type="text"
            defaultValue={item.name}
            {...register("name", { required: true })}
            placeholder="Recipe Name"
            className="input input-bordered w-full"
          />
        </div>

        {/* 2nd row */}
        <div className="flex items-center gap-4">
          <div className="form-control my-6 w-full">
            <label className="label">
              <span className="label-text">Category*</span>
            </label>
            <select
              {...register("category", { required: true })}
              className="select select-bordered"
              defaultValue={item.category}
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

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Price*</span>
            </label>
            <input
              type="number"
              defaultValue={item.price}
              {...register("price", { required: true })}
              placeholder="Price"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* 3rd row */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Recipe Details</span>
          </label>
          <textarea
            defaultValue={item.recipe}
            {...register("recipe", { required: true })}
            className="textarea textarea-bordered h-24"
            placeholder="Tell the world about your recipe"
          ></textarea>
        </div>

        {/* 4th row */}
        <div className="form-control my-6 w-full">
          <input
            {...register("image", { required: true })}
            type="file"
            className="file-input w-full max-w-xs"
          />
        </div>

        <button className="btn bg-green px-6 text-white">
          Update Item <FaUtensils />
        </button>
      </form>
    </div>
  );
};

export default UpdateMenu;
