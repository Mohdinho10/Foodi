import { useSelector } from "react-redux";
import { useGetMyOrdersQuery } from "../slices/orderApiSlice";
import { useState } from "react";
import Modal from "react-modal";
import moment from "moment";

Modal.setAppElement("#root");

function OrdersPage() {
  const user = useSelector((state) => state.auth.userInfo);
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetMyOrdersQuery(user?.email, { skip: !user?.email });

  const [selectedOrder, setSelectedOrder] = useState(null);

  if (isLoading) return <p className="py-12 text-center">Loading orders...</p>;
  if (isError)
    return (
      <p className="py-12 text-center text-red-500">Failed to load orders.</p>
    );

  const openModal = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-28 xl:px-24">
      <div className="rounded-xl bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC] p-8 shadow-md">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          Track <span className="text-myGreen">Orders</span>
        </h2>

        {/* Table layout for md+ screens */}
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left font-semibold">Items</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-left font-semibold">Payment</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.cartItems?.length
                      ? order.cartItems.map((item) => item.name).join(", ")
                      : "No items"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        order.orderType === "delivery"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {order.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-600">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "delivered" ||
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {moment(order.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-500">
                    <button
                      onClick={() => openModal(order)}
                      className="hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="py-6 text-center italic text-gray-500"
                  >
                    You have no orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout for small screens */}
        <div className="flex flex-col gap-4 md:hidden">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="font-medium">ID: {order._id.slice(-6)}</span>
                  <button
                    onClick={() => openModal(order)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Items:</strong>{" "}
                  {order.cartItems?.length
                    ? order.cartItems.map((item) => item.name).join(", ")
                    : "No items"}
                </p>
                <p className="text-sm">
                  <strong>Type:</strong>{" "}
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      order.orderType === "delivery"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {order.orderType}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Payment:</strong> {order.paymentMethod}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === "delivered" ||
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Date:</strong>{" "}
                  {moment(order.createdAt).format("MMM D, YYYY")}
                </p>
              </div>
            ))
          ) : (
            <p className="py-6 text-center italic text-gray-500">
              You have no orders yet.
            </p>
          )}
        </div>
      </div>

      {/* Modal for order details */}
      <Modal
        isOpen={!!selectedOrder}
        onRequestClose={closeModal}
        contentLabel="Order Details"
        className="mx-auto w-[90%] max-w-lg rounded-xl bg-white p-6 shadow-2xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Order Details ({selectedOrder._id.slice(-6)})
            </h3>
            <p className="text-gray-700">
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p className="text-gray-700">
              <strong>Items:</strong>{" "}
              {selectedOrder.cartItems?.length
                ? selectedOrder.cartItems
                    .map(
                      (item) =>
                        `${item.name} (x${item.quantity || 1}) - $${item.price}`,
                    )
                    .join(", ")
                : "No items"}
            </p>
            <p className="text-gray-700">
              <strong>Total Price:</strong> ${selectedOrder.price}
            </p>
            <p className="text-gray-700">
              <strong>Quantity:</strong> {selectedOrder.quantity}
            </p>
            <p className="text-gray-700">
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
            {selectedOrder.transactionId && (
              <p className="text-gray-700">
                <strong>Transaction ID:</strong> {selectedOrder.transactionId}
              </p>
            )}

            {selectedOrder.orderType === "delivery" &&
              selectedOrder.address && (
                <div className="mt-4 space-y-1 rounded bg-blue-50 p-3 text-sm text-blue-800">
                  <p>
                    <strong>Delivery Address:</strong>
                  </p>
                  <p>{selectedOrder.address.street}</p>
                  <p>{selectedOrder.address.city}</p>
                  <p>{selectedOrder.address.phone}</p>
                </div>
              )}

            {selectedOrder.orderType === "dine-in" &&
              selectedOrder.reservationDetails && (
                <div className="mt-4 space-y-1 rounded bg-purple-50 p-3 text-sm text-purple-800">
                  <p>
                    <strong>Reservation Details:</strong>
                  </p>
                  <p>Guests: {selectedOrder.reservationDetails.guests}</p>
                  <p>
                    Date:{" "}
                    {moment(selectedOrder.reservationDetails.date).format(
                      "MMM D, YYYY",
                    )}
                  </p>
                  <p>Time: {selectedOrder.reservationDetails.time}</p>
                  {selectedOrder.reservationDetails.specialRequest && (
                    <p>
                      Special Request:{" "}
                      {selectedOrder.reservationDetails.specialRequest}
                    </p>
                  )}
                </div>
              )}

            <div className="pt-4 text-right">
              <button
                className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrdersPage;
