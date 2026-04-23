import { X } from "lucide-react";
import { useEffect, useState } from "react";

const UserModal = ({ isOpen, onClose, onSave, userData, departments, managers }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    primaryRole: "Employee",
    secondaryRole: "None",
    designation: "",
    department: "",
    manager: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (userData) {
      // Split roles if they are comma-separated
      const roles = userData.role ? userData.role.split(",") : ["Employee"];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        id: userData.id,
        name: userData.name || "",
        email: userData.email || "",
        password: "", // Don't pre-fill password
        primaryRole: roles[0] || "Employee",
        secondaryRole: roles[1] || "None",
        designation: userData.designation || "",
        department: userData.department || "",
        manager: userData.manager || "",
        status: userData.status || "ACTIVE",
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        primaryRole: "Employee",
        secondaryRole: "None",
        designation: "",
        department: "",
        manager: "",
        status: "ACTIVE",
      });
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            {userData ? "Edit User" : "Add User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Akshay Singh"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Email *</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="akshay.singh@psi.local"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Password {userData ? "(optional)" : "*"}
            </label>
            <input
              type="password"
              required={!userData}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Primary Role */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Primary Role *</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none bg-white"
                value={form.primaryRole}
                onChange={(e) => setForm({ ...form, primaryRole: e.target.value })}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="HR">HR</option>
              </select>
            </div>

            {/* Secondary Role */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Secondary Role (optional)</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none bg-white"
                value={form.secondaryRole}
                onChange={(e) => setForm({ ...form, secondaryRole: e.target.value })}
              >
                <option value="None">None</option>
                <option value="MANAGER">Manager</option>
                <option value="EMPLOYEE">Employee (Secondary)</option>
              </select>
            </div>
          </div>

          {/* Job Title */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Job Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Department</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none bg-white"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          {/* Manager (Only for Employee) */}
          {form.primaryRole.toUpperCase() === "EMPLOYEE" && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Manager</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none bg-white"
                value={form.manager}
                onChange={(e) => setForm({ ...form, manager: e.target.value })}
              >
                <option value="">Select manager</option>
                {managers.map((mgr) => (
                  <option key={mgr.id} value={mgr.name}>{mgr.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status (Only for Edit) */}
          {userData && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex gap-3 justify-end">
          {userData ? (
            <>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Update
              </button>
              <button
                onClick={onClose}
                className="px-8 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-full hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Add User
              </button>
              <button
                onClick={onClose}
                className="px-8 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-full hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
