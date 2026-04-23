import { useEffect, useState } from "react";
import { FaCheckCircle, FaStar, FaUserTie, FaUsers } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { getActiveCycle } from "../../services/cycleService";
import { getEvaluationByEmployee } from "../../services/employeeService";
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

    useEffect(() => {
        getActiveCycle().then(setActiveCycle);
        if (employee?.id) {
            getEvaluationByEmployee(employee.id)
                .then(data => {
                    if (data) setSelfAppraisal(data);
                })
                .catch(e => console.error("Failed to map self appraisal:", e));
        }
    }, [employee]);

    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[450px] bg-white/50 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-200 p-12 text-center shadow-inner">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center mb-8 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                    <FaUserTie className="text-5xl text-blue-600/30" />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    Action Required
                </h3>

                <p className="text-slate-500 max-w-md mb-8 text-lg font-medium">
                    Please select the employee for the report review to proceed with the evaluation.
                </p>

                <button
                    onClick={() => navigate("/manager-dashboard")}
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-95 group"
                >
                    <FaUsers className="text-lg group-hover:rotate-12 transition-transform" />
                    Go to Dashboard
                </button>
            </div>
        );
    }

    const isCompleted = employee.status?.toUpperCase() === "COMPLETED";

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[450px] bg-emerald-50/30 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-emerald-200 p-12 text-center">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 border border-emerald-100 shadow-sm">
                    <FaCheckCircle className="text-5xl text-emerald-500" />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    Review Completed
                </h3>

                <p className="text-slate-500 max-w-md mb-8 text-lg font-medium">
                    The appraisal review for {employee.name} has already been submitted and finalized.
                </p>

                <button
                    onClick={() => navigate("/team")}
                    className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:shadow-xl hover:shadow-emerald-100 active:scale-95 group"
                >
                    <FaUsers className="text-lg" />
                    Back to Team Overview
                </button>
            </div>
        );
    }
    const handleSubmit = async () => {
        if (!activeCycle) return alert("No active appraisal cycle found.");
        try {
            console.log("Sending review for cycle:", activeCycle.id);

            const res = await submitReview(employee.id, activeCycle.id, review);
            alert(res);
            console.log("Employee ID:", employee.id);

            // 🔥 IMPORTANT
            navigate("/manager-dashboard");
        } catch (error) {
            console.error(error);
            alert("Error submitting review");
        }
    };



    return (

        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Review Appraisal</h2>

            {/* Employee Info */}
            <div className="bg-white p-4 rounded shadow">
                <p><strong>Name:</strong> {employee.name}</p>
                <p><strong>Designation:</strong> {employee.designation}</p>
                <p><strong>Department:</strong> {employee.department}</p>
            </div>

            {/* Read-Only Employee Self Appraisal Link */}
            {selfAppraisal && (
                <div className="bg-blue-50 p-4 rounded shadow space-y-3">
                    <h3 className="font-semibold text-lg text-blue-800">Employee Self Appraisal Claims</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <strong>Achievements:</strong>
                            <p className="border p-2 bg-white rounded min-h-[60px] whitespace-pre-wrap">{selfAppraisal.achievements || "None specified"}</p>
                        </div>
                        <div>
                            <strong>Skills & Strengths:</strong>
                            <p className="border p-2 bg-white rounded min-h-[60px] whitespace-pre-wrap">{selfAppraisal.skills || "None specified"}</p>
                        </div>
                        <div>
                            <strong>Organizational Work:</strong>
                            <p className="border p-2 bg-white rounded min-h-[60px] whitespace-pre-wrap">{selfAppraisal.organizationWork || "None specified"}</p>
                        </div>
                        <div>
                            <strong>Areas For Improvement:</strong>
                            <p className="border p-2 bg-white rounded min-h-[60px] whitespace-pre-wrap">{selfAppraisal.improvements || "None specified"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Manager Review */}
            <div className="bg-white p-4 rounded shadow space-y-6">
                <h3 className="font-semibold text-lg">Manager Review</h3>

                {/* ⭐ Rating */}
                <div>
                    <label className="text-sm font-medium block mb-2">
                        Overall Rating
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                onClick={() =>
                                    setReview({ ...review, rating: star })
                                }
                                className={`cursor-pointer text-2xl ${review.rating >= star
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* 📊 Performance Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Communication */}
                    <div>
                        <label className="text-sm font-medium">
                            Communication
                        </label>
                        <select
                            value={review.communication}
                            onChange={(e) =>
                                setReview({
                                    ...review,
                                    communication: e.target.value,
                                })
                            }
                            className="w-full border p-2 rounded mt-1"
                        >
                            <option value="">Select</option>
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Average</option>
                            <option>Needs Improvement</option>
                        </select>
                    </div>

                    {/* Technical Skills */}
                    <div>
                        <label className="text-sm font-medium">
                            Technical Skills
                        </label>
                        <select
                            value={review.technicalSkills}
                            onChange={(e) =>
                                setReview({
                                    ...review,
                                    technicalSkills: e.target.value,
                                })
                            }
                            className="w-full border p-2 rounded mt-1"
                        >
                            <option value="">Select</option>
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Average</option>
                            <option>Needs Improvement</option>
                        </select>
                    </div>

                    {/* Teamwork */}
                    <div>
                        <label className="text-sm font-medium">
                            Teamwork
                        </label>
                        <select
                            value={review.teamwork}
                            onChange={(e) =>
                                setReview({
                                    ...review,
                                    teamwork: e.target.value,
                                })
                            }
                            className="w-full border p-2 rounded mt-1"
                        >
                            <option value="">Select</option>
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Average</option>
                            <option>Needs Improvement</option>
                        </select>
                    </div>

                    {/* Punctuality */}
                    <div>
                        <label className="text-sm font-medium">
                            Punctuality
                        </label>
                        <select
                            value={review.punctuality}
                            onChange={(e) =>
                                setReview({
                                    ...review,
                                    punctuality: e.target.value,
                                })
                            }
                            className="w-full border p-2 rounded mt-1"
                        >
                            <option value="">Select</option>
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Average</option>
                            <option>Needs Improvement</option>
                        </select>
                    </div>
                </div>

                {/* Strengths */}
                <div>
                    <label className="text-sm font-medium">
                        Strengths
                    </label>
                    <textarea
                        value={review.strengths}
                        onChange={(e) =>
                            setReview({ ...review, strengths: e.target.value })
                        }
                        className="w-full border p-2 rounded mt-1"
                    />
                </div>

                {/* Improvements */}
                <div>
                    <label className="text-sm font-medium">
                        Areas of Improvement
                    </label>
                    <textarea
                        value={review.improvements}
                        onChange={(e) =>
                            setReview({
                                ...review,
                                improvements: e.target.value,
                            })
                        }
                        className="w-full border p-2 rounded mt-1"
                    />
                </div>

                {/* Final Remarks */}
                <div>
                    <label className="text-sm font-medium">
                        Final Remarks
                    </label>
                    <textarea
                        value={review.remarks}
                        onChange={(e) =>
                            setReview({
                                ...review,
                                remarks: e.target.value,
                            })
                        }
                        className="w-full border p-2 rounded mt-1"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Submit Review
                    </button>

                    <button
                        onClick={() =>
                            setReview({
                                rating: 0,
                                remarks: "",
                                strengths: "",
                                improvements: "",
                                communication: "",
                                technicalSkills: "",
                                teamwork: "",
                                punctuality: "",
                            })
                        }
                        className="bg-gray-200 px-4 py-2 rounded"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewAppraisal;