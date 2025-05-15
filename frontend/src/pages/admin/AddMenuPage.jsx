import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { useCreateMenuItemMutation } from "../../slices/menuApiSlice";

const AddMenu = () => {
  const { register, handleSubmit, reset } = useForm();
  const [createMenuItem] = useCreateMenuItemMutation();

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    try {
      const imageFile = new FormData();
      imageFile.append("image", data.image[0]);

      const hostingImg = await axios.post(image_hosting_api, imageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (hostingImg.data.success) {
        const menuItem = {
          name: data.name,
          category: data.category,
          price: parseFloat(data.price),
          recipe: data.recipe,
          image: hostingImg.data.data.display_url,
        };

        await createMenuItem(menuItem).unwrap();
        reset();

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your item has been added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add menu item",
        text: error?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="mx-auto w-full px-4 md:w-[870px]">
      <h2 className="my-4 text-2xl font-semibold">
        Upload A New <span className="text-green">Menu Item</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Recipe Name */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Recipe Name*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Recipe Name"
            className="input input-bordered w-full"
          />
        </div>

        {/* Category and Price */}
        <div className="flex items-center gap-4">
          <div className="form-control my-6 w-full">
            <label className="label">
              <span className="label-text">Category*</span>
            </label>
            <select
              {...register("category", { required: true })}
              className="select select-bordered"
              defaultValue="default"
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
              {...register("price", { required: true })}
              placeholder="Price"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Recipe Details */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Recipe Details</span>
          </label>
          <textarea
            {...register("recipe", { required: true })}
            className="textarea textarea-bordered h-24"
            placeholder="Tell the world about your recipe"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="form-control my-6 w-full">
          <input
            {...register("image", { required: true })}
            type="file"
            className="file-input w-full max-w-xs"
          />
        </div>

        <button className="btn bg-green px-6 text-white">
          Add Item <FaUtensils />
        </button>
      </form>
    </div>
  );
};

export default AddMenu;
