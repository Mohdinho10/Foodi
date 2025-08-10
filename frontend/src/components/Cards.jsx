// src/components/Cards.jsx
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAddToCartMutation,
  useGetCartByEmailQuery,
} from "../slices/cartApiSlice";
import { useSelector } from "react-redux";

const Cards = ({ item }) => {
  const { name, image, price, _id } = item;
  const user = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const location = useLocation();

  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const [createCartItem] = useAddToCartMutation();

  // Fetch the user's cart to trigger refetch after adding
  const { refetch } = useGetCartByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleAddToCart = async () => {
    if (user && user.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        quantity: 1,
        image,
        price,
        email: user.email,
      };

      try {
        await createCartItem(cartItem).unwrap();
        refetch(); // refresh cart
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Food added to cart.",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        const message = error?.data?.message || "Failed to add to cart.";
        Swal.fire({
          position: "center",
          icon: "warning",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        title: "Please login to order the food",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  return (
    <div className="card relative mr-5 shadow-xl md:my-5">
      <div
        // className={`heartStar rating absolute right-2 top-2 gap-1 bg-green p-4 ${
        //   isHeartFilled ? "text-rose-500" : "text-white"
        // }`}
        className={`btn btn-circle absolute right-2 top-2 z-50 bg-myGreen transition-colors duration-300 ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="h-5 w-5 cursor-pointer" />
      </div>
      {/* <Link to={`/menu/${item._id}`}> */}
      <figure>
        <img
          src={image}
          alt={name}
          className="transition-all duration-300 hover:scale-105 md:h-60"
        />
      </figure>
      {/* </Link> */}
      <div className="card-body">
        {/* <Link to={`/menu/${item._id}`}> */}
        <h2 className="card-title">{name}</h2>
        {/* </Link> */}
        <p>Description of the item</p>
        <div className="card-actions mt-2 items-center justify-between">
          <h5 className="font-semibold">
            <span className="text-sm text-red-400">$</span> {price}
          </h5>
          <button
            onClick={handleAddToCart}
            className="btn bg-myGreen text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
