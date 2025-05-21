import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import {
  useGetMenuItemsQuery,
  useDeleteMenuItemMutation,
} from "../../slices/menuApiSlice";

const ManageItems = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("default");

  const { data, refetch } = useGetMenuItemsQuery({
    page,
    pageSize: 5,
    category,
    sort,
    search,
  });

  const menu = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const handleDeleteItem = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteMenuItem(item._id).unwrap();
        refetch();
        Swal.fire("Deleted!", "Item has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete item.", "error");
      }
    }
  };

  // Debounced search input
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 300),
    [],
  );

  return (
    <div className="mx-auto w-full px-4 md:w-[870px]">
      <h2 className="my-4 text-2xl font-semibold">
        Manage <span className="text-green">Menu Items</span>
      </h2>

      {/* Search, Filter, Sort */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search item..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="input-bordered input w-full max-w-xs focus:outline-none"
        />

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="select-bordered select focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="drinks">Drinks</option>
            <option value="dessert">Dessert</option>
            <option value="salad">Salad</option>
            <option value="pizza">Pizza</option>
            <option value="popular">Popular</option>
            {/* Add more categories as needed */}
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="select-bordered select focus:outline-none"
          >
            <option value="default">Newest</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
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
                <th>{(page - 1) * 5 + index + 1}</th>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                </td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <Link to={`/dashboard/update-menu/${item._id}`}>
                    <button className="btn btn-xs bg-orange-500 text-white">
                      <FaEdit />
                    </button>
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="btn btn-xs text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {menu.map((item) => (
          <div key={item._id} className="rounded border p-4 shadow">
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p>${item.price}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Link to={`/dashboard/update-menu/${item._id}`}>
                <button className="btn btn-xs bg-orange-500 text-white">
                  <FaEdit /> Edit
                </button>
              </Link>
              <button
                onClick={() => handleDeleteItem(item)}
                className="btn btn-xs bg-red-500 text-white"
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 w-full">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num + 1}
              onClick={() => setPage(num + 1)}
              className={`min-w-[40px] rounded-full px-3 py-1 text-sm transition-all duration-200 ${
                page === num + 1
                  ? "bg-myGreen text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageItems;
