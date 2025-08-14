import {
  useUpdateOrderStatusMutation,
  useDeleteCompletedOrderMutation,
  useGetAllOrdersQuery,
} from "../../slices/orderApiSlice";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import Swal from "sweetalert2";

const OrderDetailsModal = ({ order, onClose, onDelete }) => {
  if (!order) return null;

  const handleDeleteClick = () => {
    onDelete(order._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold">Order Details</h3>
        <p className="mt-1 text-sm text-gray-500">
          Placed on: {new Date(order.createdAt).toLocaleDateString()}{" "}
          {new Date(order.createdAt).toLocaleTimeString()}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <strong>Customer:</strong> {order.email}
          </p>
          <p>
            <strong>Price:</strong> ${order.price.toFixed(2)}
          </p>
          <p>
            <strong>Type:</strong> {order.orderType}
          </p>
          <p>
            <strong>Paid:</strong> {order.paid ? "Yes" : "No"}
          </p>

          <div>
            <strong>Items:</strong>
            <ul className="list-disc pl-5">
              {order.cartItems?.map((item) => (
                <li key={item._id}>
                  {item.name} (x{item.quantity || 1}) - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>

          {order.orderType === "dine-in" && order.reservationDetails && (
            <p>
              Guests: {order.reservationDetails.guests} | Date:{" "}
              {new Date(order.reservationDetails.date).toLocaleDateString()}{" "}
              {order.reservationDetails.time}
            </p>
          )}

          {order.orderType === "delivery" && order.address && (
            <p>
              Address: {order.address.street}, {order.address.city} |{" "}
              {order.address.phone}
            </p>
          )}

          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          {(order.status === "completed" || order.status === "cancelled") && (
            <button
              onClick={handleDeleteClick}
              className="rounded bg-red-600 px-4 py-1 text-white hover:bg-red-700"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-1 hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminOrdersPage = () => {
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteCompletedOrderMutation();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success("Order status updated");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#39db4a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder(orderId).unwrap();
          refetch();
          Swal.fire("Deleted!", "The order has been deleted.", "success");
        } catch {
          Swal.fire("Error!", "Failed to delete order.", "error");
        }
      }
    });
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error loading orders.</div>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden min-w-full border border-gray-200 text-sm sm:table">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Price</th>
                <th className="p-3">Type</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Status</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id} className="border-t align-top">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{order.email}</td>
                  <td className="p-3">${order.price.toFixed(2)}</td>
                  <td className="p-3 capitalize">{order.orderType}</td>
                  <td className="p-3">{order.paid ? "Yes" : "No"}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="rounded border px-2 py-1 text-sm"
                    >
                      <option value="Order pending">Order pending</option>
                      <option value="Cash on delivery">Cash on delivery</option>
                      <option value="preparing">Preparing</option>
                      <option value="served">Served</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <ChevronDown size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="space-y-4 sm:hidden">
            {orders.map((order, idx) => (
              <div
                key={order._id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Order #{idx + 1}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">Customer: {order.email}</p>
                <p className="text-sm">Price: ${order.price.toFixed(2)}</p>
                <p className="text-sm capitalize">
                  Type: {order.orderType} | Paid: {order.paid ? "Yes" : "No"}
                </p>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="mt-2 w-full rounded border px-2 py-1 text-sm"
                >
                  <option value="Order pending">Order pending</option>
                  <option value="Cash on delivery">Cash on delivery</option>
                  <option value="preparing">Preparing</option>
                  <option value="served">Served</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  {expandedOrderId === order._id ? (
                    <>
                      <ChevronUp size={14} /> Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} /> View
                    </>
                  )}
                </button>

                {expandedOrderId === order._id && (
                  <div className="mt-2 border-t pt-2 text-sm">
                    <strong>Items:</strong>
                    <ul className="list-disc pl-5">
                      {order.cartItems?.map((item) => (
                        <li key={item._id}>
                          {item.name} (x{item.quantity || 1}) - $
                          {item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>

                    {order.orderType === "dine-in" &&
                      order.reservationDetails && (
                        <p>
                          Guests: {order.reservationDetails.guests} | Date:{" "}
                          {new Date(
                            order.reservationDetails.date,
                          ).toLocaleDateString()}{" "}
                          {order.reservationDetails.time}
                        </p>
                      )}

                    {order.orderType === "delivery" && order.address && (
                      <p>
                        Address: {order.address.street}, {order.address.city} |{" "}
                        {order.address.phone}
                      </p>
                    )}

                    {(order.status === "completed" ||
                      order.status === "cancelled") && (
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="mt-2 text-sm text-red-600 hover:underline"
                      >
                        Delete Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Desktop */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
