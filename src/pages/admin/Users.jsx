import { useEffect, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { getAllUsers } from "../../api/admin.api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers();

      console.log("Users API Response:", response.data);

      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / limit);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * limit,
    page * limit
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          User Management
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Manage platform users
        </p>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Skills</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.avatar
                            ? `http://43.205.113.12:8008${user.avatar}`
                            : "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(user.name || "User")
                        }
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-semibold">
                          {user.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm">
                      {(user.role || "user").charAt(0).toUpperCase() + (user.role || "user").slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {Array.isArray(user.skills)
                      ? user.skills
                        .slice(0, 2)
                        .map((s) => s.skill || s)
                        .join(", ")
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100">
                        <Pencil size={18} />
                      </button>

                      <button className="p-2 rounded-lg bg-red-50 hover:bg-red-100">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {paginatedUsers.length} of{" "}
            {filteredUsers.length} users
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-xl disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}