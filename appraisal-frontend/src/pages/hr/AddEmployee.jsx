import { useEffect, useState } from "react";
import {
  addHrStaff,
  deleteHrStaff,
  getHrDashboard,
  updateHrStaff, // ✅ FIXED
} from "../../services/hrService";

const AddEmployee = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    primaryRole: "EMPLOYEE",
    designation: "",
    department: "",
    manager: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dashData = await getHrDashboard();
      setEmployees(dashData.employees || []);
      setDepartments(dashData.departments || []);
      setManagers(dashData.managers || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ADD
  const handleAdd = () => {
    setIsEdit(false);
    setForm({
      id: null,
      name: "",
      email: "",
      password: "",
      primaryRole: "EMPLOYEE",
      designation: "",
      department: "",
      manager: "",
    });
    setShowForm(true);
  };

  // ✅ EDIT
  const handleEdit = (emp) => {
    setIsEdit(true);
    setForm({
      id: emp.id,
      name: emp.name || "",
      email: emp.email || "",
      password: "",
      primaryRole: emp.manager !== undefined ? "EMPLOYEE" : "MANAGER", // Heuristic
      designation: emp.designation || "",
      department: emp.department || "",
      manager: emp.manager || "",
    });
    setShowForm(true);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await deleteHrStaff(id);
      alert("Deleted successfully");
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.manager) {
      alert("Please assign a manager");
      return;
    }

    try {
      if (isEdit) {
        await updateHrStaff(form.id, form);
        alert("Employee Updated");
      } else {
        await addHrStaff(form);
        alert("Employee Added");
      }

      setShowForm(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="p-1 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Employee Management
        </h1>

        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow"
        >
          + Add Employee
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {!showForm && (
        <div className="bg-white p-6 rounded-2xl shadow">

          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Department</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Manager</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">

                  <td className="p-3 font-medium">{emp.name}</td>
                  <td className="p-3 text-gray-600">{emp.email}</td>

                  <td className="p-3">
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                      {emp.department || "N/A"}
                    </span>
                  </td>

                  <td className="p-3 text-gray-600">
                    {emp.designation || "N/A"}
                  </td>

                  <td className="p-3 text-gray-500">
                    {emp.manager || "Not Assigned"}
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {employees.length === 0 && (
            <p className="text-center py-6 text-gray-400">
              No employees found
            </p>
          )}
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow max-w-4xl mx-auto">

          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold">
              {isEdit ? "Edit Employee" : "Add Employee"}
            </h2>

            <button onClick={() => setShowForm(false)}>✕</button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">

            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border p-2 rounded"
              required
            />

            {!isEdit && (
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="border p-2 rounded col-span-2"
                required
              />
            )}

            <input
              placeholder="Designation"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
              className="border p-2 rounded"
            />

            <select
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">Select Department</option>
              {departments.map((d, i) => (
                <option key={i} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* 🔥 MANAGER (MANDATORY NOW) */}
            <select
              value={form.manager}
              onChange={(e) =>
                setForm({ ...form, manager: e.target.value })
              }
              className="border p-2 rounded col-span-2"
              required
            >
              <option value="">Select Manager</option>
              {managers.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.department})
                </option>
              ))}
            </select>

            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded"
              >
                {isEdit ? "Update" : "Create"}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;