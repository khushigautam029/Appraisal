import { useEffect, useState } from "react";
import { getActiveCycle } from "../../services/cycleService";
import {
  assignTarget,
  getEmployees,
  getTargetsByManager,
} from "../../services/managerService";

const AssignTargets = () => {
  const [targets, setTargets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCycle, setActiveCycle] = useState(null);
  
  // Get manager name from localStorage
  const managerName = localStorage.getItem("userName");

  useEffect(() => {
    if (managerName) {
        fetchEmployees();
        fetchTargets();
    }
    getActiveCycle().then(setActiveCycle);
  }, [managerName]);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees(managerName);
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ KEEP UNSAVED ROWS SAFE
  const fetchTargets = async () => {
    try {
      const res = await getTargetsByManager(managerName);

      const formatted = res.data.map((t) => ({
        id: t.id,
        employeeId: t.employee?.id,
        employeeName: t.employee?.name,
        description: t.description,
        targetDate: t.targetDate,
        managerRemarks: t.managerRemarks,
        status: t.status,
        saved: true,
      }));

      // 🔥 Preserve NEW rows
      setTargets((prev) => {
        const newRows = prev.filter((t) => !t.saved);
        return [...formatted, ...newRows];
      });

    } catch (err) {
      console.error("Error fetching targets:", err);
    }
  };

  // Handle change
  const handleChange = (index, field, value) => {
    setTargets((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    );
  };

  // Add new row
  const handleAddTarget = () => {
    const newTarget = {
      id: Date.now() + Math.random(),
      employeeId: "",
      description: "",
      targetDate: "",
      managerRemarks: "",
      status: "PENDING",
      saved: false,
    };

    setTargets((prev) => [...prev, newTarget]);
  };

  // Delete only NEW rows
  const handleDelete = (id) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
  };

  // Save target
  const handleSave = async (target) => {
    if (!target.employeeId || !target.description || !target.targetDate) {
      alert("Please fill all fields ❗");
      return;
    }

    if (!activeCycle) return alert("No active appraisal cycle found.");

    try {
      setLoading(true);

      await assignTarget(target.employeeId, activeCycle.id, {
        description: target.description,
        targetDate: target.targetDate,
        managerRemarks: target.managerRemarks,
        status: "PENDING"
      });

      alert("✅ Target Assigned Successfully");

      // 🔥 REMOVE OLD UNSAVED ROW
      setTargets((prev) => prev.filter((t) => t.id !== target.id));

      // 🔥 FETCH UPDATED DATA FROM DB
      fetchTargets();

    } catch (err) {
      console.error(err);
      alert("❌ Failed: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Status styles
  const getStatusStyle = (status) => {
    if (status === "COMPLETED")
      return "bg-green-100 text-green-700";
    if (status === "SUBMITTED")
      return "bg-blue-100 text-blue-700";
    if (status === "PENDING" || status === "IN_PROGRESS")
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Assign Targets</h2>

        <button
          onClick={handleAddTarget}
          className="bg-green-100 text-green-700 px-4 py-2 rounded"
        >
          + Add Target
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 border">No.</th>
              <th className="p-3 border">Employee</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Target Date</th>
              <th className="p-3 border">Manager Remarks</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {targets.map((target, index) => (
              <tr key={target.id}>

                <td className="p-3 border">{index + 1}</td>

                {/* Employee */}
                <td className="p-3 border">
                  {target.saved ? (
                    <span>{target.employeeName}</span>
                  ) : (
                    <select
                      value={target.employeeId}
                      onChange={(e) =>
                        handleChange(index, "employeeId", e.target.value)
                      }
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                {/* Description */}
                <td className="p-3 border">
                  {target.saved ? (
                    <span>{target.description}</span>
                  ) : (
                    <input
                      value={target.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      className="border px-2 py-1 w-full"
                    />
                  )}
                </td>

                {/* Date */}
                <td className="p-3 border">
                  {target.saved ? (
                    <span>{target.targetDate}</span>
                  ) : (
                    <input
                      type="date"
                      value={target.targetDate}
                      onChange={(e) =>
                        handleChange(index, "targetDate", e.target.value)
                      }
                      className="border px-2 py-1"
                    />
                  )}
                </td>

                {/* Remarks */}
                <td className="p-3 border">
                  {target.saved ? (
                    <span>{target.managerRemarks}</span>
                  ) : (
                    <input
                      value={target.managerRemarks}
                      onChange={(e) =>
                        handleChange(index, "managerRemarks", e.target.value)
                      }
                      className="border px-2 py-1 w-full"
                    />
                  )}
                </td>

                {/* Status */}
                <td className="p-3 border">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(target.status)}`}>
                    {target.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3 border flex flex-col gap-2">
                  {!target.saved ? (
                    <>
                      <button
                        onClick={() => handleSave(target)}
                        disabled={loading}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded"
                      >
                        {loading ? "Saving..." : "Submit"}
                      </button>

                      <button
                        onClick={() => handleDelete(target.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {target.status === "COMPLETED"
                        ? "✔ Completed"
                        : "Assigned"}
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignTargets;