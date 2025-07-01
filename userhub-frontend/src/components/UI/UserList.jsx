import { useEffect, useState, useMemo } from 'react';
import axios from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { debounce } from 'lodash';
import { Pencil, Trash } from 'lucide-react';

const UserList = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('user');

  const fetchUsers = async (searchTerm = search, pageNum = page) => {
    try {
      setLoading(true);
      const res = await axios.get(`/users?page=${pageNum}&search=${searchTerm}`);
      setUsers(res.data.users);
      setPages(res.data.pages);
    } catch (err) {
      console.error('User fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce((value) => {
    setPage(1);
    fetchUsers(value, 1);
  }, 500), []);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditName(user.fullName);
    setEditRole(user.role);
  };

  const submitEdit = async () => {
    if (!editName.trim()) return alert('Name is required');
    try {
      await axios.put(`/users/${editId}`, { fullName: editName, role: editRole });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (auth.user?.role !== 'admin') {
    return <p className="text-center mt-20 text-red-500 font-semibold">Access Denied</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">👩‍💻 User Management</h2>

      <div className="flex justify-center mb-6 px-2">
        <input
          type="text"
          value={search}
          onChange={onSearchChange}
          placeholder="🔍 Search by name or email..."
          className="w-full sm:max-w-md px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
        />
      </div>

      <div className="rounded-2xl overflow-x-auto shadow-md border border-purple-100 bg-white">
        <table className="min-w-[600px] w-full text-sm text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">No users found.</td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-purple-50/30 transition-all">
                <td className="px-6 py-4">
                  <img
                    src={user.profileImage ? `http://localhost:8081/uploads/${user.profileImage}` : `https://ui-avatars.com/api/?name=${user.fullName}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {editId === user.id ? (
                    <input
                      className="border px-2 py-1 rounded"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    user.fullName
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 capitalize">
                  {editId === user.id ? (
                    <select
                      className="border px-2 py-1 rounded"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  {editId === user.id ? (
                    <>
                      <button
                        onClick={submitEdit}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-6 text-center text-purple-500 animate-pulse">Loading users...</div>}
      </div>

      {users.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl disabled:opacity-40 hover:bg-purple-700 transition-all w-full sm:w-auto"
          >
            ⬅ Prev
          </button>
          <span className="text-sm text-gray-700 text-center">
            Page {page} of {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl disabled:opacity-40 hover:bg-purple-700 transition-all w-full sm:w-auto"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
