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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h2 className="mb-8 text-center text-2xl font-bold">
        Upload a New <span className="text-green">Menu Item</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipe Name */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Recipe Name*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="e.g. Spicy Thai Noodles"
            className="input-bordered input w-full focus:outline-none"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Category*</span>
            </label>
            <select
              {...register("category", { required: true })}
              className="select-bordered select w-full focus:outline-none"
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

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Price*</span>
            </label>
            <input
              type="number"
              {...register("price", { required: true })}
              placeholder="e.g. 12.99"
              className="input-bordered input w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Recipe Details */}
        <div className="form-control">
          <label className="label md:hidden">
            <span className="label-text font-medium">Recipe Details*</span>
          </label>
          <textarea
            {...register("recipe", { required: true })}
            className="textarea-bordered textarea min-h-[100px] w-full resize-none focus:outline-none"
            placeholder="Write something delicious..."
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Upload Image*</span>
          </label>
          <input
            {...register("image", { required: true })}
            type="file"
            className="file-input-bordered file-input w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="hover:bg-green-dark btn flex items-center gap-2 bg-green text-white"
          >
            Add Item <FaUtensils />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenu;
