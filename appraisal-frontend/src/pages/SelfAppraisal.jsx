import { useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EmployeeInfoCard from "../components/EmployeeInfoCard";
import { getActiveCycle } from "../services/cycleService";
import { getEmployeeByUserId, getEvaluationByEmployeeAndCycle, saveEvaluation, submitEvaluationById } from "../services/employeeService";

const SelfAppraisal = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [activeCycle, setActiveCycle] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const cycle = await getActiveCycle();
        setActiveCycle(cycle);

        if (cycle && userId) {
          const emp = await getEmployeeByUserId(userId);
          setEmployee(emp);

          if (emp) {
            const data = await getEvaluationByEmployeeAndCycle(emp.id, cycle.id);
            if (data && (data.status === "SUBMITTED" || emp.status === "COMPLETED")) {
              setIsSubmitted(true);
            } else if (data) {
              setFormData({
                improvement: data.improvements || "",
                skills: data.skills || "",
                achievements: data.achievements || "",
                organizationalWork: data.organizationWork || "",
              });
            }
          }
        }
      } catch (err) {
        console.error("Error initializing SelfAppraisal", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [userId]);

  const [formData, setFormData] = useState({
    improvement: "",
    skills: "",
    achievements: "",
    organizationalWork: "",
  });

  const [files, setFiles] = useState({
    achievementsFile: null,
    orgFile: null,
  });

  const achievementRef = useRef();
  const orgRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (type, file) => {
    setFiles({
      ...files,
      [type]: file,
    });
  };

  const handleSave = async () => {
    if (!activeCycle) return alert("No active appraisal cycle found.");
    if (!employee) return alert("Employee data not found.");

    try {
      await saveEvaluation(employee.id, activeCycle.id, {
        achievements: formData.achievements,
        improvements: formData.improvement,
        organizationWork: formData.organizationalWork,
        skills: formData.skills,
        status: "DRAFT",
      });

      alert("Saved Successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Save Failed ❌");
    }
  };

  const handleSubmit = async () => {
    if (!activeCycle) return alert("No active appraisal cycle found.");
    if (!employee) return alert("Employee data not found.");

    try {
      const response = await saveEvaluation(employee.id, activeCycle.id, {
        achievements: formData.achievements,
        improvements: formData.improvement,
        organizationWork: formData.organizationalWork,
        skills: formData.skills,
      });

      const evaluationId = response.id;
      await submitEvaluationById(evaluationId);

      setIsSubmitted(true);
      alert("Submitted + Email Sent ✅");
    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  const handleCancel = () => {
    setFormData({
      improvement: "",
      skills: "",
      achievements: "",
      organizationalWork: "",
    });
    setFiles({
      achievementsFile: null,
      orgFile: null,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Self Appraisal
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
      <>
      {/* FORM GRID */}
      {isSubmitted ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-8 rounded-xl shadow-sm text-center py-20">
            <h3 className="text-2xl font-bold text-green-800 mb-4">You have submitted your appraisal!</h3>
            <p className="text-gray-600 text-lg mb-6">
                You can review your detailed appraisal and manager feedback in the <b>Report</b> section once it's available.
            </p>
            <button 
                onClick={() => navigate('/report')}
                className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition shadow-md"
            >
                Go to Report Section
            </button>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-2 gap-6">

            {/* IMPROVEMENT */}
            <div className="bg-white border rounded-xl shadow-sm">
            <div className="bg-blue-50 p-3 font-semibold text-blue-800">
                Areas of Improvement *
            </div>
            <textarea
                name="improvement"
                value={formData.improvement}
                onChange={handleChange}
                className="w-full p-3 h-40 outline-none text-sm"
                placeholder="Mention challenges, gaps, or areas where you want to improve..."
            />
            <p className="text-xs text-gray-500 px-3 pb-2">
                Example: Improve time estimation, documentation, or communication
            </p>
            </div>

            {/* SKILLS */}
            <div className="bg-white border rounded-xl shadow-sm">
            <div className="bg-blue-50 p-3 font-semibold text-blue-800">
                Skills *
            </div>
            <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full p-3 h-40 outline-none text-sm"
                placeholder="Mention technical & soft skills..."
            />
            <p className="text-xs text-gray-500 px-3 pb-2">
                Example: React, Java, APIs, Teamwork, Problem-solving
            </p>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="bg-white border rounded-xl shadow-sm">
            <div className="bg-blue-50 p-3 font-semibold text-blue-800 flex justify-between items-center">
                Achievements *
                <FaUpload
                className="cursor-pointer text-blue-600"
                onClick={() => achievementRef.current.click()}
                />
            </div>

            <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                className="w-full p-3 h-32 outline-none text-sm"
                placeholder="Highlight your key achievements..."
            />

            <input
                type="file"
                ref={achievementRef}
                className="hidden"
                onChange={(e) =>
                handleFileChange("achievementsFile", e.target.files[0])
                }
            />

            {files.achievementsFile && (
                <p className="text-xs text-gray-600 px-3 pb-2">
                📄 {files.achievementsFile.name}
                </p>
            )}

            <p className="text-xs text-gray-500 px-3 pb-2">
                Tip: Add measurable results (e.g., improved performance by 20%)
            </p>
            </div>

            {/* ORGANIZATIONAL WORK */}
            <div className="bg-white border rounded-xl shadow-sm">
            <div className="bg-blue-50 p-3 font-semibold text-blue-800 flex justify-between items-center">
                Organizational Work *
                <FaUpload
                className="cursor-pointer text-blue-600"
                onClick={() => orgRef.current.click()}
                />
            </div>

            <textarea
                name="organizationalWork"
                value={formData.organizationalWork}
                onChange={handleChange}
                className="w-full p-3 h-32 outline-none text-sm"
                placeholder="Mention extra contributions beyond your tasks..."
            />

            <input
                type="file"
                ref={orgRef}
                className="hidden"
                onChange={(e) =>
                handleFileChange("orgFile", e.target.files[0])
                }
            />

            {files.orgFile && (
                <p className="text-xs text-gray-600 px-3 pb-2">
                📄 {files.orgFile.name}
                </p>
            )}

            <p className="text-xs text-gray-500 px-3 pb-2">
                Example: Mentoring juniors, organizing events, helping team members
            </p>
            </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-4 pt-4">

            <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
            Submit
            </button>

            <button
            onClick={handleSave}
            className="bg-blue-400 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-500 transition"
            >
            Save
            </button>

            <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-300 transition"
            >
            Reset
            </button>

            </div>
        </>
      )}
      </>
      )}
    </div>
  );
};

export default SelfAppraisal;