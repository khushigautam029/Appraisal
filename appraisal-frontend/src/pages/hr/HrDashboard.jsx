import { useEffect, useState } from "react";
import { FaBuilding, FaCalendarAlt, FaUsers, FaUserTie } from "react-icons/fa";
import { getActiveCycle } from "../../services/cycleService";
import { getHrDashboard } from "../../services/hrService";

const HrDashboard = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCycle, setActiveCycle] = useState(null);

  useEffect(() => {
    loadData();
    getActiveCycle().then(cycle => setActiveCycle(cycle));
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getHrDashboard();

      const emp = data.employees || [];
      const dept = data.departments || [];
      const mgr = data.managers || [];

      // 🔥 Manager team size
      const managerList = mgr.map((m) => ({
        ...m,
        teamSize: emp.filter((e) => e.manager === m.name).length,
      }));

      setEmployees(emp);
      setDepartments(dept);
      setManagers(managerList);

      // 🔥 STATS (same style as manager dashboard)
      setStats([
        {
          title: "Total Employees",
          value: emp.length,
          icon: <FaUsers className="text-blue-500 text-xl" />,
          key: "employees",
        },
        {
          title: "Total Managers",
          value: managerList.length,
          icon: <FaUserTie className="text-yellow-500 text-xl" />,
          key: "managers",
        },
        {
          title: "Departments",
          value: dept.length,
          icon: <FaBuilding className="text-green-500 text-xl" />,
          key: "departments",
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FILTER DATA
  const getFilteredData = () => {
    if (activeTab === "employees") return employees;
    if (activeTab === "managers") return managers;
    if (activeTab === "departments") return departments;
    return [];
  };

  return (
    <div className="space-y-4">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        
        {activeCycle && (
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg flex items-center gap-2 text-indigo-700">
            <FaCalendarAlt className="text-indigo-500" />
            <span className="text-sm font-bold">Active Cycle: {activeCycle.name}</span>
            <span className="text-xs text-indigo-400">({activeCycle.startDate} to {activeCycle.endDate})</span>
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">
          Loading dashboard...
        </p>
      )}

      {!loading && (
        <>
          {/* 🔷 STATS CARDS (SAME AS MANAGER) */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                onClick={() => setActiveTab(item.key)}
                className={`bg-white p-5 rounded-lg shadow flex justify-between cursor-pointer
                ${
                  activeTab === item.key
                    ? "border-2 border-blue-500"
                    : "hover:shadow-lg"
                }`}
              >
                <div>
                  <p className="text-gray-500 text-sm">
                    {item.title}
                  </p>
                  <h3 className="text-xl font-bold">
                    {item.value}
                  </h3>
                </div>

                <div className="bg-gray-100 p-3 rounded-full">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>

          {/* 🔷 LIST SECTION (MATCH MANAGER STYLE) */}
          <div className="bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-lg font-semibold capitalize">
              {activeTab}
            </h3>

            {/* EMPLOYEES */}
            {activeTab === "employees" &&
              employees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex justify-between items-center border p-3 rounded hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-gray-500 text-sm">
                      {emp.designation}
                    </p>
                    <p className="text-xs text-gray-400">
                      {emp.department}
                    </p>
                  </div>

                  <span className="text-xs text-gray-500">
                    {emp.manager || "No Manager"}
                  </span>
                </div>
              ))}

            {/* MANAGERS */}
            {activeTab === "managers" &&
              managers.map((mgr, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border p-3 rounded hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{mgr.name}</p>
                    <p className="text-gray-500 text-sm">
                      {mgr.department}
                    </p>
                  </div>

                  <span className="text-sm text-gray-600">
                    Team: {mgr.teamSize}
                  </span>
                </div>
              ))}

            {/* DEPARTMENTS */}
            {activeTab === "departments" &&
              departments.map((dept, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border p-3 rounded hover:bg-gray-50"
                >
                  <p className="font-medium">{dept.name}</p>
                </div>
              ))}

            {/* EMPTY STATE */}
            {getFilteredData().length === 0 && (
              <p className="text-center text-gray-500">
                No data found
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HrDashboard;