import { useEffect, useState } from "react";
import {
    FaChartLine,
    FaCheckCircle,
    FaClipboardCheck,
    FaRegCommentDots,
    FaStar,
    FaUserCheck,
    FaUserTie,
    FaUsers,
} from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";

import { getActiveCycle } from "../../services/cycleService";
import { getEvaluationByEmployeeAndCycle } from "../../services/employeeService";
import { submitReview } from "../../services/managerService";

const ReviewAppraisal = () => {

    const location = useLocation();
    const employee = location.state;
    const navigate = useNavigate();

    const [activeCycle, setActiveCycle] = useState(null);

    const [review, setReview] = useState({
        rating: 0,
        remarks: "",
        strengths: "",
        improvements: "",
        communication: "",
        technicalSkills: "",
        teamwork: "",
        punctuality: "",
    });

    const [selfAppraisal, setSelfAppraisal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setInitialLoading(true);

                // ✅ First fetch the active cycle
                const cycle = await getActiveCycle();
                setActiveCycle(cycle);

                // ✅ Then fetch the self-appraisal for this employee AND this cycle
                if (employee?.id && cycle?.id) {
                    const data = await getEvaluationByEmployeeAndCycle(
                        employee.id,
                        cycle.id
                    );

                    // ✅ SHOW ONLY SUBMITTED APPRAISALS
                    if (
                        data &&
                        data.status &&
                        data.status.toUpperCase() === "SUBMITTED"
                    ) {
                        setSelfAppraisal(data);
                    } else {
                        setSelfAppraisal(null);
                    }
                }
            } catch (e) {
                console.error(
                    "Failed to fetch self appraisal:",
                    e
                );
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [employee]);

    // ❌ No Employee Selected
    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-[32px] border border-slate-200 p-12 text-center shadow-sm">

                <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                    <FaUserTie className="text-5xl text-blue-500" />
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                    No Employee Selected
                </h2>

                <p className="text-slate-500 max-w-lg mb-8 text-lg">
                    Please select an employee from the dashboard to continue the appraisal review process.
                </p>

                <button
                    onClick={() =>
                        navigate("/manager-dashboard")
                    }
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-blue-200 transition-all"
                >
                    <FaUsers />
                    Go to Dashboard
                </button>
            </div>
        );
    }

    // ✅ Already Reviewed
    const isCompleted =
        employee.status?.toUpperCase() ===
        "COMPLETED";

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-[32px] border border-emerald-100 p-12 text-center shadow-sm">

                <div className="w-28 h-28 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                    <FaCheckCircle className="text-5xl text-emerald-500" />
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                    Review Completed
                </h2>

                <p className="text-slate-500 max-w-lg mb-8 text-lg">
                    The appraisal review for{" "}
                    <span className="font-semibold text-slate-700">
                        {employee.name}
                    </span>{" "}
                    has already been submitted.
                </p>

                <button
                    onClick={() => navigate("/team")}
                    className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-emerald-100 transition-all"
                >
                    <FaUsers />
                    Back to Team
                </button>
            </div>
        );
    }

    // ✅ Submit Review
    const handleSubmit = async () => {

        if (!activeCycle) {
            alert(
                "No active appraisal cycle found."
            );
            return;
        }

        if (!review.rating) {
            alert("Please provide rating");
            return;
        }

        try {
            setLoading(true);

            const res = await submitReview(
                employee.id,
                activeCycle.id,
                review
            );

            alert(res);

            navigate("/manager-dashboard");

        } catch (error) {
            console.error(error);
            alert("Error submitting review");
        } finally {
            setLoading(false);
        }
    };

    // 🔄 Reset Form
    const resetForm = () => {
        setReview({
            rating: 0,
            remarks: "",
            strengths: "",
            improvements: "",
            communication: "",
            technicalSkills: "",
            teamwork: "",
            punctuality: "",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">

            {/* HEADER */}
            <div className="mb-6">

                <h1 className="text-3xl font-bold text-slate-800">
                    Review Appraisal
                </h1>

                <p className="text-slate-500 mt-1">
                    Evaluate employee performance and provide managerial feedback
                </p>
            </div>

            {/* EMPLOYEE CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">

                <div className="flex items-center gap-4">

                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                        <FaUserTie className="text-blue-600 text-2xl" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {employee.name}
                        </h2>

                        <p className="text-slate-500 mt-1">
                            {employee.designation} •{" "}
                            {employee.department}
                        </p>
                    </div>
                </div>
            </div>

            {/* SELF APPRAISAL */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-blue-100 p-3 rounded-2xl">
                        <FaClipboardCheck className="text-blue-600 text-lg" />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">
                            Employee Self Appraisal
                        </h3>

                        <p className="text-sm text-slate-500">
                            Submitted employee performance details
                        </p>
                    </div>
                </div>

                {initialLoading ? (

                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-slate-500">Loading self appraisal...</span>
                    </div>

                ) : selfAppraisal ? (

                    <div className="grid md:grid-cols-2 gap-5">

                        {/* ACHIEVEMENTS */}
                        <div className="bg-blue-100 rounded-2xl p-5 border border-slate-100">
                            <h4 className="font-semibold text-slate-700 mb-3">
                                Achievements
                            </h4>

                            <p className="text-sm text-slate-600 leading-6 whitespace-pre-wrap">
                                {selfAppraisal.achievements ||
                                    "No achievements added"}
                            </p>
                        </div>

                        {/* SKILLS */}
                        <div className="bg-pink-100 rounded-2xl p-5 border border-slate-100">
                            <h4 className="font-semibold text-slate-700 mb-3">
                                Skills & Strengths
                            </h4>

                            <p className="text-sm text-slate-600 leading-6 whitespace-pre-wrap">
                                {selfAppraisal.skills ||
                                    "No skills added"}
                            </p>
                        </div>

                        {/* ORGANIZATION WORK */}
                        <div className="bg-yellow-100 rounded-2xl p-5 border border-slate-100">
                            <h4 className="font-semibold text-slate-700 mb-3">
                                Organization Work
                            </h4>

                            <p className="text-sm text-slate-600 leading-6 whitespace-pre-wrap">
                                {selfAppraisal.organizationWork ||
                                    "No organizational work added"}
                            </p>
                        </div>

                        {/* IMPROVEMENTS */}
                        <div className="bg-green-100 rounded-2xl p-5 border border-slate-100">
                            <h4 className="font-semibold text-slate-700 mb-3">
                                Areas of Improvement
                            </h4>

                            <p className="text-sm text-slate-600 leading-6 whitespace-pre-wrap">
                                {selfAppraisal.improvements ||
                                    "No improvements added"}
                            </p>
                        </div>

                    </div>

                ) : (

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">

                        <h3 className="text-lg font-semibold text-amber-700 mb-2">
                            No Submitted Appraisal
                        </h3>

                        <p className="text-sm text-amber-600">
                            Employee has not submitted the self appraisal for the active cycle yet.
                        </p>

                    </div>
                )}
            </div>

            {/* MANAGER REVIEW */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-emerald-100 p-3 rounded-2xl">
                        <FaChartLine className="text-emerald-600 text-lg" />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">
                            Manager Review
                        </h3>

                        <p className="text-sm text-slate-500">
                            Provide performance analysis and final feedback
                        </p>
                    </div>
                </div>

                {/* ⭐ RATING */}
                <div className="mb-8">

                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Overall Performance Rating
                    </label>

                    <div className="flex gap-3">

                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() =>
                                    setReview({
                                        ...review,
                                        rating: star,
                                    })
                                }
                                className="transition-transform hover:scale-110"
                            >
                                <FaStar
                                    className={`text-3xl ${review.rating >=
                                            star
                                            ? "text-yellow-400"
                                            : "text-slate-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* PERFORMANCE GRID */}
                <div className="grid md:grid-cols-2 gap-5 mb-8">

                    {[
                        "communication",
                        "technicalSkills",
                        "teamwork",
                        "punctuality",
                    ].map((field) => (
                        <div key={field}>

                            <label className="block text-sm font-semibold text-slate-700 mb-2 capitalize">
                                {field ===
                                    "technicalSkills"
                                    ? "Technical Skills"
                                    : field}
                            </label>

                            <select
                                value={review[field]}
                                onChange={(e) =>
                                    setReview({
                                        ...review,
                                        [field]:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-blue-200 outline-none"
                            >
                                <option value="">
                                    Select
                                </option>

                                <option>
                                    Excellent
                                </option>

                                <option>
                                    Good
                                </option>

                                <option>
                                    Average
                                </option>

                                <option>
                                    Needs Improvement
                                </option>
                            </select>
                        </div>
                    ))}
                </div>

                {/* TEXT AREAS */}
                <div className="space-y-6">

                    {/* STRENGTHS */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FaUserCheck className="text-emerald-500" />
                            Strengths
                        </label>

                        <textarea
                            rows={4}
                            value={review.strengths}
                            onChange={(e) =>
                                setReview({
                                    ...review,
                                    strengths:
                                        e.target.value,
                                })
                            }
                            placeholder="Mention employee strengths..."
                            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                        />
                    </div>

                    {/* IMPROVEMENTS */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FaChartLine className="text-amber-500" />
                            Areas of Improvement
                        </label>

                        <textarea
                            rows={4}
                            value={review.improvements}
                            onChange={(e) =>
                                setReview({
                                    ...review,
                                    improvements:
                                        e.target.value,
                                })
                            }
                            placeholder="Mention improvement areas..."
                            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                        />
                    </div>

                    {/* REMARKS */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FaRegCommentDots className="text-blue-500" />
                            Final Remarks
                        </label>

                        <textarea
                            rows={5}
                            value={review.remarks}
                            onChange={(e) =>
                                setReview({
                                    ...review,
                                    remarks:
                                        e.target.value,
                                })
                            }
                            placeholder="Write overall appraisal remarks..."
                            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                        />
                    </div>

                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-4 mt-8">

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Review"}
                    </button>

                    <button
                        onClick={resetForm}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-3 rounded-2xl font-semibold transition-all"
                    >
                        Reset Form
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ReviewAppraisal;