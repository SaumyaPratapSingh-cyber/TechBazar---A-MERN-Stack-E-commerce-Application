    // src/screens/UserListScreen.jsx
    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';

    function UserListScreen() {
      const navigate = useNavigate();
      const { user, token, logout } = useAuth();

      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        // Redirect if not logged in or not an admin
        if (!user || !token) {
          navigate('/login');
        } else if (!user.isAdmin) { // Check if user is an admin
          setError("Access Denied. You must be an admin to view this page.");
          setLoading(false);
        } else {
          const fetchUsers = async () => {
            try {
              const response = await fetch('http://localhost:5000/api/users', { // Backend route to get all users
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.status === 401 || response.status === 403) { // Unauthorized or Forbidden
                logout();
                setError("Session expired or access denied. Please log in again.");
                setLoading(false);
                return;
              }

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
              }
              const data = await response.json();
              setUsers(data);
            } catch (err) {
              console.error("Failed to fetch users:", err);
              setError(err.message);
            } finally {
              setLoading(false);
            }
          };
          fetchUsers();
        }
      }, [user, token, navigate, logout]);

      const handleDeleteUser = async (userIdToDelete) => {
        if (!window.confirm('Are you sure you want to delete this user?')) { // Simple confirmation
          return;
        }
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/users/${userIdToDelete}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 401 || response.status === 403) {
            logout();
            setError("Session expired or access denied. Please log in again.");
            setLoading(false);
            return;
          }

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to delete user: ${errorData.message || 'Unknown error'}`);
          }

          setUsers(users.filter(u => u._id !== userIdToDelete)); // Remove user from local state
          setLoading(false);
        } catch (err) {
          console.error("Error deleting user:", err);
          setError(err.message);
          setLoading(false);
        }
      };

      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="mt-4 text-xl text-gray-700">Loading users...</div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
            <div className="text-center text-2xl text-red-600 font-bold mb-4">Error: {error}</div>
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline mt-4">Go Back to Admin Dashboard</Link>
          </div>
        );
      }

      // Ensure user is admin before rendering content
      if (!user || !user.isAdmin) {
        return null; // Should be handled by error/redirect above, but a fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
          <div className="container mx-auto bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Manage Users</h2>
            
            {users.length === 0 ? (
              <div className="text-center text-xl text-gray-700">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">ID</th>
                      <th className="py-3 px-6 text-left">NAME</th>
                      <th className="py-3 px-6 text-left">EMAIL</th>
                      <th className="py-3 px-6 text-left">ADMIN</th>
                      <th className="py-3 px-6 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm font-light">
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">{u._id}</td>
                        <td className="py-3 px-6 text-left">{u.name}</td>
                        <td className="py-3 px-6 text-left">
                          <a href={`mailto:${u.email}`} className="text-blue-600 hover:underline">{u.email}</a>
                        </td>
                        <td className="py-3 px-6 text-left">
                          {u.isAdmin ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-red-600">No</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors text-xs"
                            disabled={u._id === user._id} // Prevent admin from deleting themselves
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Link to="/admin/dashboard" className="block text-center text-blue-600 hover:underline mt-8">
              Go Back to Admin Dashboard
            </Link>
          </div>
        </div>
      );
    }

    export default UserListScreen;
    