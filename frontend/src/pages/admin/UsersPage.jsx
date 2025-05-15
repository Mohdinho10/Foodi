import { FaTrashAlt, FaUsers } from "react-icons/fa";
import {
  useMakeAdminMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../slices/userApiSlice";

const Users = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersQuery();

  const [makeAdmin] = useMakeAdminMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleMakeAdmin = async (user) => {
    try {
      await makeAdmin(user._id).unwrap();
      alert(`${user.name} is now admin`);
      refetch();
    } catch (err) {
      console.error("Failed to make admin:", err);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user._id).unwrap();
      alert(`${user.name} is removed from database`);
      refetch();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error fetching users.</div>;

  return (
    <div>
      <div className="m-4 flex items-center justify-between">
        <h5>All Users</h5>
        <h5>Total Users: {users.length}</h5>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table-zebra table md:w-[870px]">
            <thead className="bg-green rounded-lg text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.role === "admin" ? (
                      "Admin"
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="btn btn-xs btn-circle bg-indigo-500 text-white"
                      >
                        <FaUsers />
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user)}
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
      </div>
    </div>
  );
};

export default Users;
