import { FaTrashAlt, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  useMakeAdminMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../slices/userApiSlice";
import { toast } from "react-hot-toast";

const Users = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersQuery();

  const [makeAdmin, { isLoading: isMakingAdmin }] = useMakeAdminMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleMakeAdmin = async (user) => {
    try {
      await makeAdmin({ id: user._id, userData: {} }).unwrap();
      toast.success(`${user.name} is now an admin`);
      refetch();
    } catch (err) {
      console.error("Failed to make admin:", err);
      toast.error("Failed to promote user to admin");
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user._id).unwrap();
      toast.success(`${user.name} has been deleted`);
      refetch();
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    }
  };

  // Exclude the currently logged-in user
  const filteredUsers = users.filter((u) => u.email !== userInfo?.email);

  if (isLoading) return <div className="p-4">Loading users...</div>;
  if (isError)
    return <div className="text-red-500 p-4">Error fetching users.</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">All Users</h2>
        <span className="text-sm text-gray-600">
          Total Users: {filteredUsers.length}
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="table table-zebra w-full min-w-[600px]">
          <thead className="bg-green text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === "admin" ? (
                    "Admin"
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      disabled={isMakingAdmin}
                      className="btn btn-xs btn-circle bg-indigo-500 text-white"
                    >
                      <FaUsers />
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    disabled={isDeleting}
                    className="btn btn-xs bg-orange-500 text-white"
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
        {filteredUsers.map((user, index) => (
          <div
            key={user._id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <p className="text-sm font-semibold">
              #{index + 1} - {user.name}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm font-medium">
                {user.role === "admin" ? (
                  <span className="text-green-600">Admin</span>
                ) : (
                  <button
                    onClick={() => handleMakeAdmin(user)}
                    disabled={isMakingAdmin}
                    className="btn btn-xs flex items-center gap-1 bg-indigo-500 text-white"
                  >
                    <FaUsers />
                    Make Admin
                  </button>
                )}
              </div>
              <button
                onClick={() => handleDeleteUser(user)}
                disabled={isDeleting}
                className="btn btn-xs flex items-center gap-1 bg-orange-500 text-white"
              >
                <FaTrashAlt />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
