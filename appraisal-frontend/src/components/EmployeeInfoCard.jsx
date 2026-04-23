import { useEffect, useState } from "react";
import { FaBuilding, FaIdBadge, FaUserTie, FaUsers } from "react-icons/fa";
import { getEmployeeByUserId } from "../services/employeeService";

const EmployeeInfoCard = () => {
  const [employee, setEmployee] = useState(null);
  const role = localStorage.getItem("role");

  const fetchEmployee = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const data = await getEmployeeByUserId(userId);
        setEmployee(data);
      } catch (err) {
        console.error("Error fetching employee info:", err);
      }
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  if (!employee) return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border animate-pulse flex gap-6">
      <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        
        {/* Avatar/Icon Circle */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-blue-200">
          <FaUserTie />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-800">{employee.name}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                role === "MANAGER" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}>
                {role}
              </span>
            </div>
            <p className="text-blue-600 font-medium flex items-center gap-1.5 text-sm">
              <FaIdBadge className="text-blue-400" /> #{employee.id}
            </p>
          </div>

          {/* Department & Designation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaBuilding className="text-gray-400" />
              <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <FaUserTie className="text-gray-400 text-xs" />
              <span>{employee.designation}</span>
            </div>
          </div>

          {/* Manager Info */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FaUsers className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Appraising Manager</p>
              <p className="text-sm font-semibold text-gray-700">{employee.manager || "Not Assigned"}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;