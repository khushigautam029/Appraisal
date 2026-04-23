import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaUsers } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { getActiveCycle } from "../../services/cycleService";
import {
  getDashboard,
  getTeamStatus,
} from "../../services/managerService";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCycle, setActiveCycle] = useState(null);

  // 🔥 REFRESH WHEN RETURNING FROM REVIEW PAGE
  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      try {
        const cycle = await getActiveCycle();
        if (cycle) {
          setActiveCycle(cycle);
          await fetchData(cycle.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setLoading(false);
      }
    };
    initializeDashboard();
  }, [location.pathname]);

  const fetchData = async (cycleId) => {
    try {
      const managerName = localStorage.getItem("userName");

      const [dashboardRes, teamRes] = await Promise.all([
        getDashboard(managerName, cycleId),
        getTeamStatus(managerName, cycleId),
      ]);

      const empData = teamRes.data || [];
      const dashData = dashboardRes.data || {};

      setEmployees(empData);

      setStats([
        {
          title: "Total Employees",
          value: dashData.employees || 0,
          icon: <FaUsers className="text-blue-500 text-xl" />,
          key: "all",
        },
        {
          title: "Awaiting Manager",
          value: dashData.pending || 0,
          icon: <FaClock className="text-yellow-500 text-xl" />,
          key: "pending",
        },
        {
          title: "Completed Reviews",
          value: dashData.completed || 0,
          icon: <FaCheckCircle className="text-green-500 text-xl" />,
          key: "completed",
        },
      ]);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FILTER LOGIC
  const filteredEmployees = employees.filter((emp) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return emp.status === "SUBMITTED";
    if (activeTab === "completed") return emp.status === "COMPLETED";
    return true;
  });

  // 🔹 STATUS STYLE
  const getStatusStyle = (status) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-700";
    if (status === "SUBMITTED") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-800 opacity-70";
  };

  // 🔹 DEADLINE LOGIC
  const isDeadlineApproaching = () => {
    if (!activeCycle) return false;
    const now = new Date();
    const end = new Date(activeCycle.endDate);
    return now >= end || (end - now) < (7 * 24 * 60 * 60 * 1000); 
  };
  
  const pendingReviewsCount = employees.filter(e => e.status === "SUBMITTED").length;
  const showDeadlinePopup = isDeadlineApproaching() && pendingReviewsCount > 0;

  return (
    <div className="space-y-6 relative">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Deadline Popup / Banner */}
      {showDeadlinePopup && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-3">
          <FaExclamationTriangle className="text-xl" />
          <span>
            <strong className="font-bold">Deadline Warning! </strong>
            You have {pendingReviewsCount} pending review(s) for the current cycle ({activeCycle.name}). The deadline is {activeCycle.endDate}.
          </span>
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-500">
          Loading dashboard...
        </p>
      )}

      {!loading && !activeCycle && (
        <div className="bg-yellow-50 p-4 rounded text-yellow-700">
          No active appraisal cycle found. Please contact HR.
        </div>
      )}

      {!loading && activeCycle && (
        <>
          {/* 🔷 STATS */}
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

          {/* 🔷 EMPLOYEE LIST */}
          <div className="bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-lg font-semibold capitalize">
              {activeTab === "all"
                ? "All Employees"
                : activeTab === "pending"
                ? "Pending Reviews"
                : "Completed Reviews"}
            </h3>

            {filteredEmployees.map((emp) => {
              const isCompleted = emp.status === "COMPLETED";
              const isPending = emp.status === "PENDING";

              return (
                <div
                  key={emp.id}
                  className="flex justify-between items-center border p-3 rounded hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-gray-500 text-sm">
                      {emp.designation}
                    </p>

                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                        emp.status
                      )}`}
                    >
                      {emp.status === "PENDING" ? "Appraisal-pending" : emp.status === "SUBMITTED" ? "Appraisal-submitted" : "Completed"}
                    </span>
                  </div>

                  {/* ✅ BUTTON FIXED: CAN ONLY REVIEW IF SUBMITTED */}
                  <button
                    disabled={isCompleted || isPending}
                    onClick={() => {
                      if (!isCompleted && !isPending) {
                        navigate("/review-appraisal", {
                          state: emp,
                        });
                      }
                    }}
                    className={`px-3 py-1 rounded text-white
                      ${
                        isCompleted
                          ? "bg-green-500 cursor-not-allowed"
                          : isPending 
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    {isCompleted
                      ? "Reviewed"
                      : isPending 
                      ? "Waiting on Employee"
                      : "Review Appraisal"}
                  </button>
                </div>
              );
            })}

            {filteredEmployees.length === 0 && (
              <p className="text-center text-gray-500">
                No data found for the current tab.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;