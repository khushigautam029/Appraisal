import { useEffect, useState } from "react";
import {
    FaDownload,
    FaSearch,
    FaTimes,
    FaUserTie
} from "react-icons/fa";
import {
    getHrDashboard,
    getHrReviews,
    getSelfEvaluationByEmployee,
    getSelfEvaluationByEmployeeAndCycle,
    updateHrReview
} from "../../services/hrService";

const ManagerAppraisalReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editStates, setEditStates] = useState({});

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // 🔥 NEW
    const [selectedReview, setSelectedReview] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const [reviewData, dashboardData] = await Promise.all([
                getHrReviews(),
                getHrDashboard(),
            ]);

            const reviewRows = reviewData || [];
            const employees = dashboardData?.employees || [];
            const reviewEmployeeKeys = new Set(
                reviewRows.map((review) => getEmployeeKey(review.employee)).filter(Boolean)
            );

            const employeeOnlyRows = employees
                .filter((employee) => !reviewEmployeeKeys.has(getEmployeeKey(employee)))
                .map((employee) => ({
                    id: null,
                    rowKey: `employee-${employee.id}`,
                    employee: {
                        ...employee,
                        managerName: employee.manager,
                    },
                    rating: null,
                    hrRating: null,
                    hrRemarks: "",
                    finalDecision: "",
                    managerReviewPending: true,
                }));

            setReviews([
                ...reviewRows.map((review) => ({
                    ...review,
                    rowKey: `review-${review.id}`,
                })),
                ...employeeOnlyRows,
            ]);
        } catch (e) {
            console.error("Error fetching HR reviews:", e);
        } finally {
            setLoading(false);
        }
    };

    const getEmployeeKey = (employee) => {
        if (!employee) return "";
        return employee.id || employee.email || employee.name || "";
    };

    const handleViewDetails = async (review) => {
        const employeeId = review.employee?.id;

        setSelectedReview({
            ...review,
            selfAppraisal: null,
        });

        if (!employeeId) return;

        setDetailsLoading(true);

        try {
            const cycleId = review.cycle?.id;
            const selfAppraisal = cycleId
                ? await getSelfEvaluationByEmployeeAndCycle(employeeId, cycleId)
                : await getSelfEvaluationByEmployee(employeeId);

            setSelectedReview({
                ...review,
                selfAppraisal:
                    selfAppraisal?.status?.toUpperCase() === "SUBMITTED"
                        ? selfAppraisal
                        : null,
            });
        } catch (e) {
            console.error("Error fetching employee self appraisal:", e);
            setSelectedReview({
                ...review,
                selfAppraisal: null,
            });
        } finally {
            setDetailsLoading(false);
        }
    };

    // ✏️ Handle Input Change
    const handleEditChange = (id, field, value) => {
        setEditStates((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    // ✅ Save Review
    const isReviewCompleted = (review) => Boolean(review.hrRating && review.finalDecision);

    const handleSubmit = async (id) => {
        const payload = editStates[id];
        const original = reviews.find((r) => r.id === id);

        if (!original?.id || original.managerReviewPending) {
            alert("Manager review is pending for this employee.");
            return;
        }

        if (isReviewCompleted(original)) {
            alert("HR review is already completed for this employee.");
            return;
        }

        const rating = payload?.hrRating || original?.hrRating;
        const remarks = payload?.hrRemarks ?? original?.hrRemarks ?? "";
        const finalDecision =
            payload?.finalDecision || original?.finalDecision || "Approved";

        if (!rating || Number(rating) < 1 || Number(rating) > 5) {
            alert("Please enter a HR rating between 1 and 5");
            return;
        }

        try {
            await updateHrReview(id, {
                hrRating: Number(rating),
                hrRemarks: remarks,
                finalDecision,
            });

            alert("Review updated successfully!");

            fetchReviews();

            setEditStates((prev) => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        } catch (e) {
            console.error(e);
            alert("Update failed");
        }
    };

    // 📤 Export CSV
    const exportCSV = () => {
        const headers = ["Employee", "Manager Rating", "HR Rating", "Final Decision", "Remarks"];

        const rows = reviews.map((r) => [
            r.employee?.name,
            r.rating || "Manager Pending",
            r.hrRating || "",
            r.finalDecision || "",
            r.hrRemarks || "",
        ]);

        let csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((e) => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "hr_reviews.csv";
        link.click();
    };

    // 📊 Analytics
    const totalReviews = reviews.length;
    const completedCount = reviews.filter((r) => isReviewCompleted(r)).length;
    const pendingCount = reviews.filter((r) => !isReviewCompleted(r)).length;

    // 🔍 Filters
    const filteredData = reviews.filter((r) => {
        const name = r.employee?.name?.toLowerCase() || "";

        const matchesSearch = name.includes(search.toLowerCase());

        const status = isReviewCompleted(r) ? "COMPLETED" : "PENDING";

        const matchesStatus =
            statusFilter === "ALL" || status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (r) => {
        if (r.managerReviewPending) {
            return "bg-gray-100 text-gray-600 border border-gray-200";
        }

        return isReviewCompleted(r)
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-amber-100 text-amber-700 border border-amber-200";
    };

    const getStatusText = (r) => {
        if (r.managerReviewPending) return "Manager Pending";
        return isReviewCompleted(r) ? "Completed" : "Pending";
    };

    return (
        <div className="space-y-6">

            {/* 🔷 HEADER */}
            <div className="bg-blue-100 border border-gray-200 rounded-2xl p-3 shadow-sm">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <FaUserTie className="text-blue-600 text-xl" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">
                                HR Appraisal Reviews
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Review employee appraisals, assign HR ratings and provide final remarks.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
                    >
                        <FaDownload size={14} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* 📊 STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">
                        Total Employees
                    </p>

                    <h2 className="text-3xl font-semibold text-gray-800">
                        {totalReviews}
                    </h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">
                        Completed Reviews
                    </p>

                    <h2 className="text-3xl font-semibold text-green-600">
                        {completedCount}
                    </h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">
                        Pending / Awaiting Reviews
                    </p>

                    <h2 className="text-3xl font-semibold text-amber-600">
                        {pendingCount}
                    </h2>
                </div>
            </div>

            {/* 🔍 FILTER BAR */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

                    <div className="flex flex-col md:flex-row gap-4">

                        {/* SEARCH */}
                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 w-full md:w-80">

                            <FaSearch className="text-gray-400 text-sm" />

                            <input
                                type="text"
                                placeholder="Search employee..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent outline-none w-full text-sm"
                            />
                        </div>

                        {/* STATUS */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 text-sm outline-none"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("ALL");
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* 📋 REVIEW TABLE */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-blue-100 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                    Employee
                                </th>

                                <th className="text-left px-4 py-4 font-semibold text-gray-600">
                                    Department / Role
                                </th>

                                <th className="text-center px-4 py-4 font-semibold text-gray-600">
                                    Manager Rating
                                </th>

                                <th className="text-center px-4 py-4 font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="text-center px-4 py-4 font-semibold text-gray-600">
                                    HR Rating
                                </th>

                                <th className="text-left px-4 py-4 font-semibold text-gray-600">
                                    Final Decision
                                </th>

                                <th className="text-left px-4 py-4 font-semibold text-gray-600">
                                    HR Remarks
                                </th>

                                <th className="text-center px-6 py-4 font-semibold text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        Loading reviews...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-10 text-gray-400"
                                    >
                                        No matching results found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((r) => {
                                    const completed = isReviewCompleted(r);
                                    const canHrReview = Boolean(r.id) && !r.managerReviewPending;
                                    const editKey = r.id || r.rowKey;
                                    const edit = editStates[editKey] || {
                                        hrRating: r.hrRating || "",
                                        hrRemarks: r.hrRemarks || "",
                                        finalDecision: r.finalDecision || "Approved",
                                    };

                                    return (
                                        <tr
                                            key={r.rowKey || r.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >

                                            {/* EMPLOYEE */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">

                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                                                        {r.employee?.name?.charAt(0)}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {r.employee?.name}
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            Manager: {r.employee?.managerName || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* DEPARTMENT & ROLE */}
                                            <td className="px-4 py-5">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {r.employee?.department || "Engineering"}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    {r.employee?.designation || "Software Developer"}
                                                </p>
                                            </td>

                                            {/* MANAGER RATING */}
                                            <td className="px-4 py-5 text-center">
                                                <span className="font-semibold text-blue-600">
                                                    {r.rating ? `${r.rating}/5` : "Manager Pending"}
                                                </span>
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-4 py-5 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                        r
                                                    )}`}
                                                >
                                                    {getStatusText(r)}
                                                </span>
                                            </td>

                                            {/* HR RATING */}
                                            <td className="px-4 py-5 text-center">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={edit.hrRating}
                                                    disabled={completed || !canHrReview}
                                                    onChange={(e) =>
                                                        handleEditChange(
                                                            editKey,
                                                            "hrRating",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20 border border-gray-200 rounded-lg px-2 py-2 text-center outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-500"
                                                />
                                            </td>

                                            {/* FINAL DECISION */}
                                            <td className="px-4 py-5">
                                                <select
                                                    value={edit.finalDecision}
                                                    disabled={completed || !canHrReview}
                                                    onChange={(e) =>
                                                        handleEditChange(
                                                            editKey,
                                                            "finalDecision",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-gray-50 disabled:text-gray-500"
                                                >
                                                    <option>Approved</option>
                                                    <option>Needs Rework</option>
                                                </select>
                                            </td>

                                            {/* HR REMARKS */}
                                            <td className="px-4 py-5">
                                                <input
                                                    type="text"
                                                    value={edit.hrRemarks}
                                                    disabled={completed || !canHrReview}
                                                    onChange={(e) =>
                                                        handleEditChange(
                                                            editKey,
                                                            "hrRemarks",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Optional remarks"
                                                    className="w-44 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:text-gray-500"
                                                />
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-6 py-5">

                                                <div className="flex flex-col gap-2">

                                                    <button
                                                        onClick={() => handleViewDetails(r)}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                                                    >
                                                        View Details
                                                    </button>

                                                    <button
                                                        onClick={() => handleSubmit(r.id)}
                                                        disabled={completed || !canHrReview}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                    >
                                                        {completed ? "Saved" : canHrReview ? "Save" : "Awaiting Manager"}
                                                    </button>
                                                </div>

                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🔥 MODAL */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 overflow-hidden">

                    {/* MODAL CONTAINER */}
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">

                        {/* HEADER */}
                        <div className="flex justify-between items-center px-6 py-5 border-b bg-gray-50 sticky top-0 z-10 rounded-t-3xl">

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Full Appraisal Details
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedReview.employee?.name}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedReview(null)}
                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-5 overflow-y-auto flex-1">

                            <div className="bg-gradient-to-r from-purple-50 to-black-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
                                <h1 className="text-lg font-semibold text-gray-800">
                                    Self Appraisal
                                </h1>

                                <p className="text-sm text-gray-500 mt-1">
                                    Employee performance summary and self evaluation details
                                </p>
                            </div>

                            {detailsLoading ? (
                                <div className="text-center py-10 text-gray-500">
                                    Loading submitted appraisal...
                                </div>
                            ) : selectedReview.selfAppraisal ? (
                                <div className="grid md:grid-cols-2 gap-5">

                                    <div className="bg-blue-50 rounded-2xl p-5">
                                        <h3 className="font-semibold text-gray-700 mb-2">
                                            Achievements
                                        </h3>

                                        <p className="text-sm text-gray-600 leading-6 whitespace-pre-wrap">
                                            {selectedReview.selfAppraisal.achievements ||
                                                "No achievements available"}
                                        </p>
                                    </div>

                                    <div className="bg-green-50 rounded-2xl p-5">
                                        <h3 className="font-semibold text-gray-700 mb-2">
                                            Skills
                                        </h3>

                                        <p className="text-sm text-gray-600 leading-6 whitespace-pre-wrap">
                                            {selectedReview.selfAppraisal.skills ||
                                                "No skills available"}
                                        </p>
                                    </div>

                                    <div className="bg-pink-50 rounded-2xl p-5">
                                        <h3 className="font-semibold text-gray-700 mb-2">
                                            Improvements
                                        </h3>

                                        <p className="text-sm text-gray-600 leading-6 whitespace-pre-wrap">
                                            {selectedReview.selfAppraisal.improvements ||
                                                "No improvements available"}
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 rounded-2xl p-5 shadow-sm">
                                        <h3 className="font-semibold text-cyan-700 mb-2">
                                            Organisational Work
                                        </h3>

                                        <p className="text-sm text-gray-700 leading-6 whitespace-pre-wrap">
                                            {selectedReview.selfAppraisal.organizationWork ||
                                                "No organisational work available"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center text-amber-700">
                                    Employee self appraisal has not been submitted for this cycle.
                                </div>
                            )}

                        </div>

                    </div>
                </div>

            )}
        </div>
    );
};

export default ManagerAppraisalReview;
