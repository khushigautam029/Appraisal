import { useEffect, useState } from "react";
import { getGoals, submitGoal } from "../services/employeeService";

const MyTargets = () => {
  const userId = localStorage.getItem("userId");

  const [targets, setTargets] = useState([]);
  const [message, setMessage] = useState("");

  const fetchGoals = async () => {
    if (!userId) return;
    try {
      const data = await getGoals(userId);

      const formatted = data.map((t) => ({
        ...t,
        employeeRemarks: t.employeeRemarks || "",
        achieved: t.status === "COMPLETED" ? "Yes" : "No", // UI only
      }));

      setTargets(formatted);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGoals();
  }, []);

  // ✅ Safe update
  const handleChange = (index, field, value) => {
    setTargets((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    );
  };

  // ✅ Submit (only here backend updates)
  const handleSubmit = async (target) => {
    try {
      await submitGoal(target.id, {
        employeeRemarks: target.employeeRemarks
      });

      setMessage("✅ Target Submitted Successfully");
      setTimeout(() => setMessage(""), 2000);

      fetchGoals();

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed: " + (err.response?.data || err.message));
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // 🎨 UI Status
  const getStatusText = (status) => {
    if (status === "COMPLETED") return "✔ Completed";
    if (status === "SUBMITTED") return "📩 Submitted";
    if (status === "PENDING") return "⏳ Pending";
    return status;
  };

  const getStatusStyle = (status) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-700";
    if (status === "SUBMITTED") return "bg-blue-100 text-blue-700";
    if (status === "PENDING" || status === "IN_PROGRESS") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  const isLocked = (status) => status === "COMPLETED" || status === "SUBMITTED";

  return (
    <div className="space-y-6">

      {/* Toast */}
      {message && (
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded fixed top-4 right-4 z-50 shadow-lg">
          {message}
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800">My Targets</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 border">No.</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Target Date</th>
              <th className="p-3 border">Manager Remarks</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Employee Remarks</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {targets.length > 0 ? (
              targets.map((target, index) => (
                <tr key={target.id} className="border-t">

                  <td className="p-3 border">{index + 1}</td>

                  {/* Read Only */}
                  <td className="p-3 border">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {target.description}
                    </span>
                  </td>

                  <td className="p-3 border">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {target.targetDate}
                    </span>
                  </td>

                  <td className="p-3 border">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {target.managerRemarks}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(target.status)}`}
                    >
                      {getStatusText(target.status)}
                    </span>
                  </td>

                  {/* Remarks */}
                  <td className="p-3 border">
                    <textarea
                      value={target.employeeRemarks}
                      disabled={isLocked(target.status)}
                      onChange={(e) =>
                        handleChange(index, "employeeRemarks", e.target.value)
                      }
                      className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={isLocked(target.status) ? "" : "Add your remarks here..."}
                    />
                  </td>

                  {/* Action */}
                  <td className="p-3 border">
                    <button
                      onClick={() => handleSubmit(target)}
                      disabled={isLocked(target.status)}
                      className={`px-4 py-2 rounded transition-colors ${
                        isLocked(target.status)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      }`}
                    >
                      {target.status === "SUBMITTED" ? "Submitted" : target.status === "COMPLETED" ? "Closed" : "Submit"}
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No targets assigned yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTargets;