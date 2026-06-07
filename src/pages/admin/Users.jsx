import { useEffect, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { getAllUsers } from "../../api/admin.api";
import ResponsiveTable from "../../components/shared/ResponsiveTable";

const searchInputClass =
  "w-full pl-10 pr-4 py-3 bg-[#12072a] border border-[#2d1f4e] rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50";

const paginationBtnClass =
  "px-4 py-2 rounded-xl border border-[#2d1f4e] bg-[#1a0f2e] text-gray-300 hover:bg-[#12072a] hover:text-white disabled:opacity-50 transition-colors";

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
        <p className="text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-sm text-gray-400 mt-1">Manage platform users</p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-3.5 text-gray-500" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={searchInputClass}
        />
      </div>

      <ResponsiveTable minWidth="min-w-[900px]">
        <thead>
          <tr className="bg-[#1a0f2e] border-b border-[#2d1f4e]">
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">User</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Role</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Skills</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Status</th>
            <th className="px-4 md:px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Joined</th>
            <th className="px-4 md:px-6 py-4 text-right text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-10 text-center text-gray-400 bg-[#12072a]">
                No users found
              </td>
            </tr>
          ) : (
            paginatedUsers.map((user) => (
              <tr
                key={user._id}
                className="bg-[#12072a] border-b border-[#1e1040] hover:bg-[#1a0f2e] transition-colors"
              >
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`${user.avatar}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2d1f4e]"
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-200">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 md:px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-[#1e1040] text-[#a78bfa] text-sm">
                    {(user.role || "user").charAt(0).toUpperCase() + (user.role || "user").slice(1)}
                  </span>
                </td>

                <td className="px-4 md:px-6 py-4 text-sm text-gray-200">
                  {Array.isArray(user.skills) && user.skills.length > 0
                    ? user.skills.slice(0, 2).map((s) => s.skill || s).join(", ")
                    : "N/A"}
                </td>

                <td className="px-4 md:px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.isActive
                        ? "bg-[#052e16] text-[#4ade80]"
                        : "bg-red-950/50 text-red-400"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 md:px-6 py-4 text-sm text-gray-200">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </td>

                <td className="px-4 md:px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button className="p-2 rounded-lg text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </ResponsiveTable>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            Showing {paginatedUsers.length} of {filteredUsers.length} users
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className={paginationBtnClass}>
              Previous
            </button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className={paginationBtnClass}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
