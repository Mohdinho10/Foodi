import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  useGetMenuItemsQuery,
  useDeleteMenuItemMutation,
} from "../../slices/menuApiSlice";

const ManageItems = () => {
  const {
    data: menu = [],
    isLoading,
    isError,
    refetch,
  } = useGetMenuItemsQuery();

  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const handleDeleteItem = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMenuItem(item._id).unwrap();
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "The item has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Failed to delete item:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the item.",
            icon: "error",
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <p className="py-10 text-center text-lg font-semibold">Loading...</p>
    );
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-red-500">
        Failed to load menu items.
      </p>
    );
  }

  return (
    <div className="mx-auto w-full px-4 md:w-[870px]">
      <h2 className="my-4 text-2xl font-semibold">
        Manage All <span className="text-green">Menu Items</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item, index) => (
              <tr key={item._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={item.image} alt={item.name} />
                      </div>
                    </div>
                  </div>
                </td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <Link to={`/dashboard/update-menu/${item._id}`}>
                    <button className="btn btn-ghost btn-xs bg-orange-500 text-white">
                      <FaEdit />
                    </button>
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="btn btn-ghost btn-xs text-red"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageItems;
