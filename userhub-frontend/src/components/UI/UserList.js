// src/features/users/UserList.jsx
import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white p-4 shadow rounded-2xl border border-purple-100">
      <div className="flex items-center gap-4">
        <img
          src={user.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : `https://ui-avatars.com/api/?name=${user.fullName}`}
          alt={user.fullName}
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-lg font-semibold text-purple-800">{user.fullName}</h3>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-sm text-gray-400 mt-1 capitalize">Role: {user.role}</p>
        </div>
      </div>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await API.get(`/users?page=${page}&search=${search}`);
      setUsers(data.users);
      setPages(data.pages);
    } catch (err) {
      console.error('Fetch users failed:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-xl shadow-sm w-full max-w-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 rounded-xl bg-purple-500 text-white disabled:opacity-40 shadow"
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {pages}
        </span>
        <button
          disabled={page === pages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 rounded-xl bg-purple-500 text-white disabled:opacity-40 shadow"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
