import {
  useUpdateOrderStatusMutation,
  useDeleteCompletedOrderMutation,
  useGetAllOrdersQuery,
} from "../../slices/orderApiSlice";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import Swal from "sweetalert2";

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success("Order status updated");
      refetch();
    } catch (err) {
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
          await refetch();
          Swal.fire("Deleted!", "The order has been deleted.", "success");
        } catch (err) {
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
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-200 text-sm">
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
                <>
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
                        <option value="Cash on delivery">
                          Cash on delivery
                        </option>
                        <option value="preparing">Preparing</option>
                        <option value="served">Served</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        {expandedOrderId === order._id ? (
                          <>
                            <ChevronUp size={16} /> Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} /> View
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {expandedOrderId === order._id && (
                    <tr>
                      <td colSpan="8" className="p-4">
                        <div className="rounded border bg-gray-50 p-4 shadow-sm">
                          <h3 className="mb-2 text-lg font-medium">
                            Order Details
                          </h3>

                          <p className="mb-2">
                            <strong>Order Type:</strong> {order.orderType}
                          </p>

                          <div>
                            <strong>Items Ordered:</strong>
                            <ul className="mt-1 list-disc pl-5">
                              {order.cartItems && order.cartItems.length > 0 ? (
                                order.cartItems.map((item) => (
                                  <li key={item._id} className="mb-3">
                                    <div>
                                      <strong>Name:</strong> {item.name} (x
                                      {item.quantity || 1})
                                    </div>
                                    <div>
                                      <strong>Price:</strong> $
                                      {item.price.toFixed(2)}
                                    </div>
                                  </li>
                                ))
                              ) : (
                                <li>—</li>
                              )}
                            </ul>
                          </div>

                          {order.orderType === "dine-in" &&
                            order.reservationDetails && (
                              <div className="mt-2">
                                <p>
                                  <strong>Guests:</strong>{" "}
                                  {order.reservationDetails.guests}
                                </p>
                                <p>
                                  <strong>Date:</strong>{" "}
                                  {new Date(
                                    order.reservationDetails.date,
                                  ).toLocaleDateString()}
                                </p>
                                <p>
                                  <strong>Time:</strong>{" "}
                                  {order.reservationDetails.time}
                                </p>
                                {order.reservationDetails.specialRequest && (
                                  <p>
                                    <strong>Special Request:</strong>{" "}
                                    {order.reservationDetails.specialRequest}
                                  </p>
                                )}
                              </div>
                            )}

                          {order.orderType === "delivery" && order.address && (
                            <div className="mt-2">
                              <p>
                                <strong>Address:</strong> {order.address.street}
                                , {order.address.city}
                              </p>
                              <p>
                                <strong>Phone:</strong> {order.address.phone}
                              </p>
                            </div>
                          )}

                          <p className="mt-2 text-sm text-gray-500">
                            Placed: {new Date(order.createdAt).toLocaleString()}
                          </p>

                          {(order.status === "completed" ||
                            order.status === "cancelled") && (
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="mt-4 text-sm text-red-600 hover:underline"
                            >
                              Delete Order
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
