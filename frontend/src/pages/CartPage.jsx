import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  useGetCartByEmailQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "../slices/cartApiSlice";
import { useSelector } from "react-redux";
import { formatCurrency } from "../utils/currency";

const CartPage = () => {
  const user = useSelector((state) => state.auth.userInfo);

  const {
    data: cart = [],
    isLoading,
    isError,
    refetch,
  } = useGetCartByEmailQuery(user?.email, { skip: !user?.email });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  const calculateTotalPrice = (item) => item.price * item.quantity;

  const handleIncrease = async (item) => {
    try {
      await updateCartItem({
        id: item._id,
        updatedData: { ...item, quantity: item.quantity + 1 },
      }).unwrap();
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      try {
        await updateCartItem({
          id: item._id,
          updatedData: { ...item, quantity: item.quantity - 1 },
        }).unwrap();
        await refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = (item) => {
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
          await deleteCartItem(item._id).unwrap();
          await refetch();
          Swal.fire("Deleted!", "Your item has been deleted.", "success");
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const cartSubtotal = cart.reduce(
    (total, item) => total + calculateTotalPrice(item),
    0,
  );
  const orderTotal = cartSubtotal;

  if (isLoading) return <p className="py-20 text-center">Loading cart...</p>;
  if (isError)
    return (
      <p className="py-20 text-center text-red-500">
        Failed to load cart items.
      </p>
    );

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 xl:px-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC]">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Items Added to The <span className="text-myGreen">Cart</span>
          </h2>
        </div>
      </div>

      {cart.length > 0 ? (
        <div className="mt-2 space-y-6">
          {/* Cart Items */}
          <div className="flex flex-col gap-4">
            {cart.map((item, index) => (
              <div
                key={item._id}
                className="flex flex-col rounded-lg border p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Item Info */}
                <div className="mb-2 flex items-center gap-3 sm:mb-0 sm:w-1/2">
                  <span className="font-medium">{index + 1}.</span>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <span className="font-medium">{item.name}</span>
                </div>

                {/* Quantity, Price & Delete */}
                <div className="flex items-center justify-between gap-4 sm:w-1/2">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-xs"
                      onClick={() => handleDecrease(item)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="w-12 rounded border text-center"
                    />
                    <button
                      className="btn btn-xs"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <span className="font-semibold">
                    {formatCurrency(calculateTotalPrice(item))}
                  </span>

                  {/* Delete Button */}
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item)}
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2 md:w-1/2">
              <h3 className="text-lg font-semibold">Customer Details</h3>
              <p>Name: {user?.displayName || "None"}</p>
              <p>Email: {user?.email}</p>
              <p>
                User ID: <span className="text-sm">{user?.uid}</span>
              </p>
            </div>
            <div className="space-y-2 md:w-1/2">
              <h3 className="text-lg font-semibold">Shopping Details</h3>
              <p>Total Items: {cart.length}</p>
              <p>
                Total Price: <span>{formatCurrency(orderTotal)}</span>
              </p>
              <Link
                to={"/payment"}
                className="btn btn-md bg-myGreen px-6 py-2 text-white"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 space-y-3 text-center">
          <p>Cart is empty. Please add products.</p>
          <Link to="/menu" className="btn bg-myGreen text-white">
            Back to Menu
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
