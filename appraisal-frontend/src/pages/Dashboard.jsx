import { useEffect, useState } from "react";
import {
  FaExclamationTriangle
} from "react-icons/fa";
import { getActiveCycle } from "../services/cycleService";

const Dashboard = () => {
  const [activeCycle, setActiveCycle] = useState(null);

  const [data, setData] = useState({
    totalGoals: 0,
    completedGoals: 0,
    pendingGoals: 0, // 🔥 NEW
    pendingReviews: 0,
    appraisalStatus: "Not Started",
    selfAppraisalStatus: "Not Started",
    managerReviewStatus: "Not Started",
    promotionStatus: "No", // 🔥 NEW (default)
  });

  useEffect(() => {
    const empId = localStorage.getItem("userId");

    const fetchDashboard = async () => {
      try {
        const cycle = await getActiveCycle();
        if (!cycle) return;

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        const res = await fetch(`${API_BASE_URL}/api/dashboard/user/${empId}/cycle/${cycle.id}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const resData = await res.json();

        setData({
          totalGoals: resData.totalGoals || 0,
          completedGoals: resData.completedGoals || 0,
          pendingGoals: (resData.totalGoals || 0) - (resData.completedGoals || 0),
          pendingReviews: resData.pendingReviews || 0,
          appraisalStatus: resData.appraisalStatus || "Not Started",
          selfAppraisalStatus: resData.selfAppraisalStatus || "Not Started",
          managerReviewStatus: resData.managerReviewStatus || "Not Started",
          promotionStatus: resData.promotionStatus || "No",
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

  // 🔥 Minimal professional cards
  const stats = [
    { title: "Total Goals", value: data.totalGoals },
    { title: "Completed Goals", value: data.completedGoals },
    { title: "Pending Goals", value: data.pendingGoals }, // NEW
  ];

  const getStatusColor = (status) => {
    if (status === "Completed" || status === "Submitted" || status === "Approved")
      return "text-green-600";
    if (status === "Not Started" || status === "Waiting on Employee") return "text-gray-400";
    if (status === "Pending" || status === "Pending Approval" || status === "Draft") return "text-yellow-500";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">

      {/* 🔴 Deadline Warning (KEEPED) */}
      {showDeadlinePopup && (
        <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <FaExclamationTriangle />
          <span>
            Deadline approaching for{" "}
            <strong>{activeCycle?.name}</strong>. Submit your
            self-appraisal before {activeCycle?.endDate}.
          </span>
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 pb-1">
        Dashboard
      </h2>

      {/* 🔥 Stats (Minimal UI) */}
      <div className="grid grid-cols-3 gap-5">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {item.title}
            </p>
            <h3 className="text-xl font-semibold text-gray-800">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* 🔥 Appraisal Progress */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h3 className="font-semibold mb-4 text-gray-700">
          Appraisal Progress
        </h3>

        <div className="space-y-3 text-sm">

          <div className="flex justify-between">
            <span>Self Appraisal</span>
            <span className={getStatusColor(data.selfAppraisalStatus)}>
              {data.selfAppraisalStatus}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Manager Review</span>
            <span className={getStatusColor(data.managerReviewStatus)}>
              {data.managerReviewStatus}
            </span>
          </div>

          {/* 🔥 NEW PROMOTION FIELD */}
          <div className="flex justify-between">
            <span>Promotion</span>
            <span
              className={
                data.promotionStatus === "Yes"
                  ? "text-green-600 font-medium"
                  : "text-gray-500"
              }
            >
              {data.promotionStatus}
            </span>
          </div>

        </div>
      </div>

      {/* 🔥 Optional: Quick Summary */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h3 className="font-semibold mb-2 text-gray-700">
          Summary
        </h3>

        <p className="text-sm text-gray-600">
          You have completed{" "}
          <strong>{data.completedGoals}</strong> out of{" "}
          <strong>{data.totalGoals}</strong> goals.
        </p>

        <p className="text-sm text-gray-600 mt-1">
          {data.pendingGoals > 0
            ? `${data.pendingGoals} goals are still pending.`
            : "All goals completed 🎉"}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;