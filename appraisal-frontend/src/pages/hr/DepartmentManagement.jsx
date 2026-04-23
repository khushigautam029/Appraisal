import { useEffect, useState } from "react";
import { FaBuilding, FaPlus, FaTrash } from "react-icons/fa";
import {
    addDepartment,
    deleteDepartment as deleteDeptAPI,
    getDepartments,
} from "../../services/hrService";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const addDepartmentHandler = async () => {
    if (!newDept.trim()) return;

    try {
      await addDepartment(newDept);
      await fetchDepartments();
      setNewDept("");
      setShowInput(false);
    } catch (err) {
      console.error("Error adding department:", err);
      alert("Failed to add department");
    }
  };

  const deleteDepartmentHandler = async (id) => {
    try {
      await deleteDeptAPI(id);
      await fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  return (
    <div className="p-1 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Department Management
          </h3>
      
        </div>

        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FaPlus />
          Add Department
        </button>
      </div>

      {/* ADD DEPARTMENT CARD */}
      {showInput && (
        <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">

          <input
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            placeholder="Enter department name..."
            className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            onClick={addDepartmentHandler}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Save
          </button>

          <button
            onClick={() => {
              setShowInput(false);
              setNewDept("");
            }}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* DEPARTMENT LIST */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* Loading */}
        {loading && (
          <p className="p-6 text-center text-gray-500">
            Loading departments...
          </p>
        )}

        {/* Empty State */}
        {!loading && (!Array.isArray(departments) || departments.length === 0) && (
          <div className="p-10 text-center text-gray-400">
            <FaBuilding className="text-4xl mx-auto mb-3" />
            <p className="text-lg">No departments found</p>
            <p className="text-sm">Start by adding a new department</p>
          </div>
        )}

        {/* List */}
        {!loading && Array.isArray(departments) && departments.length > 0 && (
          <ul>
            {departments.map((dept) => (
              <li
                key={dept.id}
                className="flex justify-between items-center px-6 py-4 border-b hover:bg-gray-50 transition"
              >

                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                    <FaBuilding />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {dept.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Department ID: {dept.id}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <button
                  onClick={() => deleteDepartmentHandler(dept.id)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition"
                >
                  <FaTrash />
                </button>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;