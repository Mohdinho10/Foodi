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
    refetch, // ✅ Added for refreshing without reload
  } = useGetCartByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  const calculateTotalPrice = (item) => item.price * item.quantity;

  const handleIncrease = async (item) => {
    try {
      await updateCartItem({
        id: item._id,
        updatedData: { ...item, quantity: item.quantity + 1 },
      }).unwrap();
      await refetch(); // ✅ refresh UI
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      try {
        await updateCartItem({
          id: item._id,
          updatedData: { ...item, quantity: item.quantity - 1 },
        }).unwrap();
        await refetch(); // ✅ refresh UI
      } catch (err) {
        console.error("Error decreasing quantity:", err);
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
          await refetch(); // ✅ refresh cart instantly
          Swal.fire("Deleted!", "Your item has been deleted.", "success");
        } catch (err) {
          console.error("Error deleting cart item:", err);
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
      <div className="bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC]">
        <div className="flex flex-col items-center justify-center py-28">
          <div className="space-y-7 px-4 text-center">
            <h2 className="text-4xl font-bold leading-snug md:text-5xl md:leading-snug">
              Items Added to The <span className="text-myGreen">Cart</span>
            </h2>
          </div>
        </div>
      </div>

      {cart.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-myGreen text-white">
                <tr>
                  <th>#</th>
                  <th>Food</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={item.image} alt={item.name} />
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{item.name}</td>
                    <td>
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
                        className="mx-2 w-10 text-center"
                      />
                      <button
                        className="btn btn-xs"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </td>
                    <td>{formatCurrency(calculateTotalPrice(item))}</td>
                    <td>
                      <button
                        className="text-red btn btn-sm border-none bg-transparent"
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr />

          <div className="my-12 flex flex-col items-start justify-between gap-8 md:flex-row">
            <div className="space-y-3 md:w-1/2">
              <h3 className="text-lg font-semibold">Customer Details</h3>
              <p>Name: {user?.displayName || "None"}</p>
              <p>Email: {user?.email}</p>
              <p>
                User ID: <span className="text-sm">{user?.uid}</span>
              </p>
            </div>
            <div className="space-y-3 md:w-1/2">
              <h3 className="text-lg font-semibold">Shopping Details</h3>
              <p>Total Items: {cart.length}</p>
              <p>
                Total Price: <span>{formatCurrency(orderTotal)}</span>
              </p>
              <Link
                to={"/payment"}
                className="btn btn-md bg-myGreen px-8 py-1 text-white"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 text-center">
          <p>Cart is empty. Please add products.</p>
          <Link to="menu">
            <Link to="/menu" className="btn mt-3 bg-myGreen text-white">
              Back to Menu
            </Link>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
