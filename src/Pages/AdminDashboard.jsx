import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import apiService from '../services/api';

const AdminDashboard = () => {
  const { companyId } = useSelector(state => state.user);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'operations', label: 'Operations' },
    { value: 'medical', label: 'Medical' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' }
  ];

  useEffect(() => {
    fetchPendingUsers();
  }, [companyId]); // Add companyId as dependency

  const fetchPendingUsers = async () => {
    try {
      const response = await apiService.admin.getPendingUsers(companyId);
      setPendingUsers(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch pending users';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (userId, status, reason = '') => {
    try {
      await apiService.admin.updateUserStatus(userId, {
        status,
        reason,
        companyId,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`User ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchPendingUsers();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update user status';
      toast.error(errorMsg);
    }
  };

  const filteredUsers = selectedDepartment === 'all' 
    ? pendingUsers 
    : pendingUsers.filter(user => user.department === selectedDepartment);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pending Approvals</h1>
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          {departments.map(dept => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#800080] border-t-transparent"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          No pending approvals found
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {user.profilePic && (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{user.email}</h3>
                    <p className="text-gray-600">Department: {user.department}</p>
                    <p className="text-gray-500 text-sm">Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproval(user.userId, 'approved')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = window.prompt('Please provide a reason for rejection:');
                      if (reason) handleApproval(user.id, 'rejected', reason);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;