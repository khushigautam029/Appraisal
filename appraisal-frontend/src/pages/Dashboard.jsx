import { useEffect, useState } from "react";
import {
  FaBullseye,
  FaCheckCircle,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaTasks,
  FaTrophy
} from "react-icons/fa";
import { getActiveCycle } from "../services/cycleService";

const Dashboard = () => {
  const [activeCycle, setActiveCycle] = useState(null);

  const [data, setData] = useState({
    totalGoals: 0,
    completedGoals: 0,
    pendingGoals: 0,
    pendingReviews: 0,
    appraisalStatus: "Not Started",
    selfAppraisalStatus: "Not Started",
    managerReviewStatus: "Not Started",
    promotionStatus: "No",
  });

  useEffect(() => {
    const empId = localStorage.getItem("userId");

    const fetchDashboard = async () => {
      try {
        const cycle = await getActiveCycle();
        if (!cycle) return;

        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL ||
          "http://3.109.25.2:8080";

        const res = await fetch(
          `${API_BASE_URL}/api/dashboard/user/${empId}/cycle/${cycle.id}`,
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!res.ok)
          throw new Error("Failed to fetch dashboard data");

        const resData = await res.json();

        setData({
          totalGoals: resData.totalGoals || 0,
          completedGoals: resData.completedGoals || 0,
          pendingGoals:
            (resData.totalGoals || 0) -
            (resData.completedGoals || 0),
          pendingReviews: resData.pendingReviews || 0,
          appraisalStatus:
            resData.appraisalStatus || "Not Started",
          selfAppraisalStatus:
            resData.selfAppraisalStatus || "Not Started",
          managerReviewStatus:
            resData.managerReviewStatus || "Not Started",
          promotionStatus:
            resData.promotionStatus || "No",
        });

        setActiveCycle(cycle);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    getActiveCycle().then((cycle) => {
      if (cycle) setActiveCycle(cycle);
    });
  }, []);

  // 🔥 Deadline logic
  const isDeadlineApproaching = () => {
    if (!activeCycle) return false;

    const now = new Date();
    const end = new Date(activeCycle.endDate);

    return now >= end || end - now < 7 * 24 * 60 * 60 * 1000;
  };

  const showDeadlinePopup =
    isDeadlineApproaching() &&
    data.selfAppraisalStatus !== "Submitted" &&
    data.selfAppraisalStatus !== "Completed";

  const stats = [
    {
      title: "Total Goals",
      value: data.totalGoals,
      icon: <FaBullseye />,
      bg: "from-blue-100 to-blue-50",
      iconBg: "bg-blue-500",
    },
    {
      title: "Completed Goals",
      value: data.completedGoals,
      icon: <FaCheckCircle />,
      bg: "from-green-100 to-green-50",
      iconBg: "bg-green-500",
    },
    {
      title: "Pending Goals",
      value: data.pendingGoals,
      icon: <FaHourglassHalf />,
      bg: "from-orange-100 to-orange-50",
      iconBg: "bg-orange-500",
    },
  ];

  const getStatusColor = (status) => {
    if (
      status === "Completed" ||
      status === "Submitted" ||
      status === "Approved"
    )
      return "bg-green-100 text-green-700";

    if (
      status === "Pending" ||
      status === "Pending Approval" ||
      status === "Draft"
    )
      return "bg-yellow-100 text-yellow-700";

    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">

      {/* 🔴 DEADLINE WARNING */}
      {showDeadlinePopup && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-5 py-4 shadow-sm">
          <div className="bg-red-500 text-white p-3 rounded-xl shadow-md">
            <FaExclamationTriangle />
          </div>

          <div>
            <p className="font-semibold text-red-700 text-sm">
              Deadline Approaching
            </p>

            <p className="text-sm text-red-600">
              Submit your appraisal for{" "}
              <span className="font-semibold">
                {activeCycle?.name}
              </span>{" "}
              before{" "}
              <span className="font-semibold">
                {activeCycle?.endDate}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* 🔥 PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Performance Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Track your appraisal progress and goals
          </p>
        </div>


      </div>

      {/* 🔥 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {stats.map((item, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${item.bg} rounded-3xl p-5 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {item.value}
                </h2>
              </div>

              <div
                className={`${item.iconBg} text-white p-4 rounded-2xl shadow-lg text-lg`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* 🔥 APPRAISAL PROGRESS */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl p-6 shadow-xl">

          <div className="flex items-center gap-2 mb-5">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
              <FaClipboardCheck />
            </div>

            <h3 className="font-semibold text-gray-800 text-lg">
              Appraisal Progress
            </h3>
          </div>

          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Self Appraisal
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  data.selfAppraisalStatus
                )}`}
              >
                {data.selfAppraisalStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Manager Review
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  data.managerReviewStatus
                )}`}
              >
                {data.managerReviewStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Promotion Status
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${data.promotionStatus === "Yes"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                  }`}
              >
                {data.promotionStatus === "Yes"
                  ? "Eligible"
                  : "Not Eligible"}
              </span>
            </div>
          </div>
        </div>

        {/* 🔥 SUMMARY CARD */}
        <div className="bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 rounded-3xl p-6 text-gray-800 shadow-xl border border-white/60 relative overflow-hidden">

          {/* Soft Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/40 rounded-full blur-3xl"></div>

          <div className="relative z-10">

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">

              <div className="bg-white shadow-md p-2 rounded-xl">
                <FaTrophy className="text-blue-600 text-lg" />
              </div>

              <h3 className="font-semibold text-lg text-gray-800">
                Performance Summary
              </h3>
            </div>

            {/* Text */}
            <p className="text-sm text-gray-700 leading-7">
              You have completed{" "}
              <span className="font-bold text-blue-700">
                {data.completedGoals}
              </span>{" "}
              out of{" "}
              <span className="font-bold text-blue-700">
                {data.totalGoals}
              </span>{" "}
              assigned goals.
            </p>

            {/* Progress Bar */}
            <div className="mt-5 w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${data.totalGoals > 0
                      ? (data.completedGoals / data.totalGoals) * 100
                      : 0
                    }%`,
                }}
              ></div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <FaTasks />
              {data.pendingGoals > 0
                ? `${data.pendingGoals} goals are still pending`
                : "All goals completed 🎉"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;