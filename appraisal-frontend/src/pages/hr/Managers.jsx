import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import {
  addHrStaff,
  deleteHrStaff,
  getHrDashboard,
  updateHrStaff,
} from "../../services/hrService";

const ManagersList = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedManager, setSelectedManager] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    primaryRole: "MANAGER",
    designation: "",
    department: "",
    status: "ACTIVE",
    manager: "",
    employeeIds: [],
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadData();
  }, []);

  // ✅ LOAD DATA
  const loadData = async () => {
    try {
      const data = await getHrDashboard();
      setManagers(data.managers || []);
      setEmployees(data.employees || []);
      setDepartments(data.departments || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FILTER EMPLOYEES FOR SELECTED MANAGER
  const getManagerEmployees = (managerName) => {
    return employees.filter((emp) => emp.manager === managerName);
  };

  // ✅ TOGGLE EMPLOYEE SELECTION
  const toggleEmployee = (empId) => {
    setForm((prev) => ({
      ...prev,
      employeeIds: prev.employeeIds.includes(empId)
        ? prev.employeeIds.filter((id) => id !== empId)
        : [...prev.employeeIds, empId],
    }));
  };

  // ✅ ADD
  const handleAdd = () => {
    setIsEdit(false);
    setForm({
      id: null,
      name: "",
      email: "",
      password: "",
      primaryRole: "MANAGER",
      designation: "",
      department: "",
      status: "ACTIVE",
      manager: "",
      employeeIds: [],
    });
    setSearchTerm("");
    setShowForm(true);
  };

  // ✅ EDIT
  const handleEdit = (mgr) => {
    setIsEdit(true);
    // Find already assigned employee IDs
    const assignedIds = employees
      .filter((e) => e.manager === mgr.name)
      .map((e) => e.id);

    setForm({
      id: mgr.id,
      name: mgr.name,
      email: mgr.email,
      password: "",
      primaryRole: "MANAGER",
      designation: mgr.designation || "",
      department: mgr.department || "",
      status: mgr.status || "ACTIVE",
      manager: mgr.manager || "",
      employeeIds: assignedIds,
    });
    setSearchTerm("");
    setShowForm(true);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    try {
      await deleteHrStaff(id);
      loadData();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error deleting manager");
    }
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateHrStaff(form.id, form);
      } else {
        await addHrStaff(form);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error("Error saving manager:", err);
      alert("Error saving manager: " + (err.message || "Unknown error"));
    }
  };

  // Filter employees base on search
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-1 ">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {/* <div className="bg-indigo-600 p-3 rounded-lg shadow-lg">
            <FaUserTie className="text-white text-xl" />
          </div> */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Managers</h1>
          </div>
        </div>

        {!showForm && (
          <button
            onClick={handleAdd}
            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-indigo-200"
          >
            <span className="text-lg font-bold">+</span> Add Manager
          </button>
        )}
      </div>

      {/* ================= MANAGER LIST ================= */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managers.map((mgr) => {
            const empCount = getManagerEmployees(mgr.name).length;
            return (
              <div
                key={mgr.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <FaUserTie className="text-indigo-600 text-xl" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(mgr)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(mgr.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{mgr.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{mgr.email}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    {mgr.department || "No Department"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    {mgr.designation || "No Designation"}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedManager(mgr);
                    setShowEmployeeModal(true);
                  }}
                  className="w-full flex justify-between items-center bg-gray-50 hover:bg-indigo-50 p-4 rounded-xl text-indigo-700 transition-colors group/btn"
                >
                  <div className="flex items-center gap-3">
                    <FaUsers />
                    <span className="font-semibold">{empCount} Employees</span>
                  </div>
                  <FaChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= FORM MODAL/OVERLAY ================= */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Manager" : "Create New Manager"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN: BASIC INFO */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Basic Info</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                  <input
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    required
                  />
                </div>

                {!isEdit && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Department</label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    >
                      <option value="">Select...</option>
                      {departments.map((d, i) => (
                        <option key={i} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Designation</label>
                    <input
                      placeholder="e.g. Senior VP"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Reporting Manager (Supervisor)</label>
                  <select
                    value={form.manager}
                    onChange={(e) => setForm({ ...form, manager: e.target.value })}
                    className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  >
                    <option value="">None (Self-Managed)</option>
                    {managers
                      .filter(m => m.name !== form.name) // Can't report to self
                      .map((m, i) => (
                        <option key={i} value={m.name}>{m.name}</option>
                      ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 font-semibold"
                >
                  {isEdit ? "Update Manager" : "Create Manager"}
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: ASSIGN EMPLOYEES */}
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Assign Employees</h3>
              
              <div className="relative mb-4">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
                />
              </div>

              <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex flex-col min-h-[300px]">
                <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>NAME / EMAIL</span>
                  <span>ASSIGNED TO</span>
                </div>
                
                <div className="overflow-y-auto max-h-[400px]">
                  {filteredEmployees.map((emp) => {
                    const isSelected = form.employeeIds.includes(emp.id);
                    const otherManager = emp.manager && emp.manager !== form.name;

                    return (
                      <div
                        key={emp.id}
                        onClick={() => toggleEmployee(emp.id)}
                        className={`p-4 border-b border-gray-50 flex items-center justify-between cursor-pointer transition-colors
                        ${isSelected ? "bg-indigo-50" : "hover:bg-gray-100"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                          ${isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"}`}>
                            {isSelected && <FaCheckCircle className="text-white text-xs" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                            <p className="text-[10px] text-gray-500">{emp.email}</p>
                          </div>
                        </div>

                        {otherManager && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                            {emp.manager}
                          </span>
                        )}
                        {emp.manager === form.name && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            Current
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {filteredEmployees.length === 0 && (
                    <div className="p-10 text-center text-gray-400 italic text-sm">
                      No matching employees found
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 px-1">
                * Selecting an employee assigned to another manager will move them to this manager.
              </p>
            </div>
          </form>
        </div>
      )}

      {/* ================= EMPLOYEE VIEW MODAL ================= */}
      {showEmployeeModal && selectedManager && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-8 text-white relative">
              <button 
                onClick={() => setShowEmployeeModal(false)}
                className="absolute right-6 top-6 hover:rotate-90 transition-transform"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-1">Team Overview</h2>
              <p className="opacity-80">Employees reporting to {selectedManager.name}</p>
            </div>

            <div className="p-8">
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {getManagerEmployees(selectedManager.name).map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-bold text-gray-800">{emp.name}</h4>
                      <p className="text-xs text-gray-500">{emp.designation} • {emp.email}</p>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold text-indigo-600 border border-indigo-50">
                      {emp.status}
                    </div>
                  </div>
                ))}

                {getManagerEmployees(selectedManager.name).length === 0 && (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No team members assigned yet</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-2.5 rounded-xl font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagersList;