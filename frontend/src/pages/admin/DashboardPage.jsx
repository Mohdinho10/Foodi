import { useState, useMemo } from "react";
import {
  useGetAllOrdersQuery,
  // useUpdateOrderStatusMutation,
  useDeleteCompletedOrderMutation,
} from "../../slices/orderApiSlice";
import Swal from "sweetalert2";
import { formatCurrency } from "../../utils/currency";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#FF6384", "#9C27B0"];

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
}

function OrderDetailsModal({ order, onClose, onDelete }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-3xl flex-col rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold">Order Details</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Type:</strong> {order.orderType}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentMethod} •{" "}
              <strong>Paid:</strong> {order.paid ? "Yes" : "No"}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="mt-3">
              <strong>Total:</strong> {formatCurrency(order.price)}
            </p>
          </div>

          <div>
            {order.orderType === "delivery" && order.address && (
              <>
                <h4 className="font-medium">Delivery Address</h4>
                <p>{order.address.street}</p>
                <p>{order.address.city}</p>
                <p>Phone: {order.address.phone}</p>
              </>
            )}
            {order.orderType === "dine-in" && order.reservationDetails && (
              <>
                <h4 className="font-medium">Reservation</h4>
                <p>Guests: {order.reservationDetails.guests}</p>
                <p>
                  Date:{" "}
                  {new Date(order.reservationDetails.date).toLocaleDateString()}
                </p>
                <p>Time: {order.reservationDetails.time}</p>
                {order.reservationDetails.specialRequest && (
                  <p>Request: {order.reservationDetails.specialRequest}</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium">Items</h4>
          <ul className="mt-2 max-h-48 list-disc overflow-auto pl-5">
            {Array.isArray(order.cartItems) && order.cartItems.length > 0 ? (
              order.cartItems.map((ci, i) => {
                if (typeof ci === "string" || typeof ci === "number") {
                  return <li key={i}>{order.itemName?.[i] || ci}</li>;
                }
                return (
                  <li key={ci._id || i}>
                    {ci.name} x {ci.quantity || 1} —{" "}
                    {formatCurrency(ci.price || 0)}
                  </li>
                );
              })
            ) : (
              <li>No items</li>
            )}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {(order.status === "completed" || order.status === "cancelled") && (
            <button
              className="w-full rounded bg-red-600 px-4 py-1 text-white hover:bg-red-700 sm:w-auto"
              onClick={() => onDelete(order._id)}
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full rounded bg-gray-300 px-4 py-1 hover:bg-gray-400 sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllOrdersQuery(undefined, { pollingInterval: 10000 });
  // const [updateStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteCompletedOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.reduce((s, o) => s + (o.price || 0), 0);
    const paidCount = orders.filter((o) => o.paid).length;
    const unpaidCount = totalOrders - paidCount;
    const deliveryCount = orders.filter(
      (o) => o.orderType === "delivery",
    ).length;
    const dineinCount = orders.filter((o) => o.orderType === "dine-in").length;

    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString();
      return { label, count: 0, revenue: 0 };
    });

    orders.forEach((o) => {
      const label = new Date(o.createdAt).toLocaleDateString();
      const bucket = last7.find((b) => b.label === label);
      if (bucket) {
        bucket.count += 1;
        bucket.revenue += o.price || 0;
      }
    });

    return {
      totalOrders,
      revenue,
      paidCount,
      unpaidCount,
      deliveryCount,
      dineinCount,
      ordersByDay: last7,
      orderTypeData: [
        { name: "Delivery", value: deliveryCount },
        { name: "Dine-In", value: dineinCount },
      ],
    };
  }, [orders]);

  // const handleUpdateStatus = async (orderId, status) => {
  //   try {
  //     await updateStatus({ id: orderId, status }).unwrap();
  //     refetch();
  //     Swal.fire("Updated", "Order status updated", "success");
  //   } catch {
  //     Swal.fire("Error", "Failed to update status", "error");
  //   }
  // };

  const handleDelete = (orderId) => {
    Swal.fire({
      title: "Delete order?",
      text: "This will permanently delete the order.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteOrder(orderId).unwrap();
        refetch();
        Swal.fire("Deleted", "Order deleted successfully", "success");
      } catch {
        Swal.fire("Error", "Failed to delete order", "error");
      }
    });
  };

  if (isLoading) return <div className="p-6">Loading dashboard...</div>;
  if (isError) return <div className="p-6">Failed to load dashboard data.</div>;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Revenue" value={formatCurrency(stats.revenue)} />
        <StatCard
          title="Paid / Unpaid"
          value={`${stats.paidCount} / ${stats.unpaidCount}`}
        />
        <StatCard
          title="Delivery / Dine-in"
          value={`${stats.deliveryCount} / ${stats.dineinCount}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl bg-white p-4 shadow">
          <h3 className="mb-3 font-semibold">Orders (last 7 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.ordersByDay}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="mb-3 font-semibold">Order Types</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.orderTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {stats.orderTypeData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Orders</h3>
            <button className="text-sm text-blue-600" onClick={() => refetch()}>
              Refresh
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {orders.slice(0, 8).map((order) => (
              <div
                key={order._id}
                className="flex flex-col items-start justify-between gap-3 rounded border p-3 sm:flex-row"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{order.email}</div>
                      <div className="text-xs text-gray-500">
                        {order.itemName?.join(", ") || "—"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(order.price)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${order.paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {order.paid ? "Paid" : "Unpaid"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {order.orderType}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:items-end">
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                  <button
                    className="text-sm text-red-600"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="font-semibold">Upcoming Reservations</h3>
          <div className="mt-3 space-y-2">
            {orders
              .filter((o) => o.orderType === "dine-in" && o.reservationDetails)
              .slice(0, 8)
              .map((r) => (
                <div key={r._id} className="rounded border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.email}</div>
                      <div className="text-xs text-gray-500">
                        {r.reservationDetails?.specialRequest || ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {new Date(
                          r.reservationDetails.date,
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {r.reservationDetails.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal */}
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

export default AdminDashboard;
