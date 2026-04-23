import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { addHrStaff, deleteHrStaff, getHrDashboard, updateHrStaff } from "../../services/hrService";
import UserModal from "./UserModal";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  // const [, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getHrDashboard();
      // Combine user and employee/manager data for the table
      const combinedData = (data.users || []).map(user => {
        const emp = (data.employees || []).find(e => e.email === user.email);
        const mgr = (data.managers || []).find(m => m.email === user.email);
        return {
          ...user,
          name: emp?.name || mgr?.name || "N/A",
          department: emp?.department || mgr?.department || "—",
          designation: emp?.designation || (mgr ? "Manager" : "—"),
          manager: emp?.manager || "—",
          status: emp?.status || mgr?.status || "ACTIVE"
        };
      });
      
      setEmployees(combinedData);
      setManagers(data.managers || []);
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteHrStaff(id);
        fetchData();
      } catch (error) {
        alert("Error deleting user: " + error.message);
      }
    }
  };

  const handleSaveUser = async (formData) => {
    try {
      if (formData.id) {
        await updateHrStaff(formData.id, formData);
      } else {
        await addHrStaff(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Error saving user: " + error.message);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (roleStr) => {
    if (!roleStr) return "bg-gray-100 text-gray-700";
    if (roleStr.includes("HR")) return "bg-red-50 text-red-600 border-red-100";
    if (roleStr.includes("MANAGER")) return "bg-blue-50 text-blue-600 border-blue-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  if (loading) return <div className="p-8 text-center">Loading users...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500">Manage all system users</p>
        </div>
        
        <button 
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Search & Stats Card */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${getRoleBadgeColor(emp.role)}`}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-800">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 lowercase">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {emp.role.split(',').map((r, i) => (
                        <span key={i} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRoleBadgeColor(r)}`}>
                          {r.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{emp.designation}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.department}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.manager || "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest ${emp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEditUser(emp)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(emp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        userData={selectedUser}
        departments={departments}
        managers={managers}
      />
    </div>
  );
};

export default EmployeeManagement;