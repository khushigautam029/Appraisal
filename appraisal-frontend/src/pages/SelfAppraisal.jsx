import { useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getActiveCycle } from "../services/cycleService";
import {
  getEmployeeByUserId,
  getEvaluationByEmployeeAndCycle,
  saveEvaluation,
  submitEvaluationById,
} from "../services/employeeService";

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
            const data = await getEvaluationByEmployeeAndCycle(
              emp.id,
              cycle.id
            );
            if (
              data &&
              (data.status === "SUBMITTED" || emp.status === "COMPLETED")
            ) {
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
      const response = await saveEvaluation(
        employee.id,
        activeCycle.id,
        {
          achievements: formData.achievements,
          improvements: formData.improvement,
          organizationWork: formData.organizationalWork,
          skills: formData.skills,
        }
      );

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
    <div className="max-w-6xl mx-auto px-2 py-2 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-3xl font-semibold text-gray-800">
          Self Appraisal
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 p-10 rounded-2xl shadow-sm text-center">
              <h3 className="text-2xl font-semibold text-green-700 mb-3">
                Appraisal Submitted Successfully 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                You can review your detailed appraisal and feedback in the report section.
              </p>
              <button
                onClick={() => navigate("/report")}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Go to Report
              </button>
            </div>
          ) : (
            <>
              {/* FORM */}
              <div className="grid md:grid-cols-2 gap-8">

                {/* CARD COMPONENT */}
                {[
                  {
                    title: "Areas of Improvement *",
                    name: "improvement",
                    value: formData.improvement,
                    placeholder:
                      "Mention challenges, gaps, or areas where you want to improve...",
                    tip: "Example: Improve time estimation, documentation, or communication",
                  },
                  {
                    title: "Skills *",
                    name: "skills",
                    value: formData.skills,
                    placeholder:
                      "Mention technical & soft skills...",
                    tip: "Example: React, Java, APIs, Teamwork, Problem-solving",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="bg-blue-50 px-4 py-3 font-medium text-blue-800 rounded-t-2xl">
                      {item.title}
                    </div>
                    <textarea
                      name={item.name}
                      value={item.value}
                      onChange={handleChange}
                      className="w-full p-4 h-40 outline-none text-sm resize-none"
                      placeholder={item.placeholder}
                    />
                    <p className="text-xs text-gray-500 px-4 pb-3">
                      {item.tip}
                    </p>
                  </div>
                ))}

                {/* ACHIEVEMENTS */}
                <div className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition">
                  <div className="bg-blue-50 px-4 py-3 font-medium text-blue-800 flex justify-between items-center rounded-t-2xl">
                    Achievements *
                    <FaUpload
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => achievementRef.current.click()}
                    />
                  </div>

                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    className="w-full p-4 h-32 outline-none text-sm resize-none"
                    placeholder="Highlight your key achievements..."
                  />

                  <input
                    type="file"
                    ref={achievementRef}
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(
                        "achievementsFile",
                        e.target.files[0]
                      )
                    }
                  />

                  {files.achievementsFile && (
                    <p className="text-xs text-gray-600 px-4 pb-2">
                      📄 {files.achievementsFile.name}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 px-4 pb-3">
                    Tip: Add measurable results (e.g., improved performance by 20%)
                  </p>
                </div>

                {/* ORGANIZATIONAL WORK */}
                <div className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition">
                  <div className="bg-blue-50 px-4 py-3 font-medium text-blue-800 flex justify-between items-center rounded-t-2xl">
                    Organizational Work *
                    <FaUpload
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => orgRef.current.click()}
                    />
                  </div>

                  <textarea
                    name="organizationalWork"
                    value={formData.organizationalWork}
                    onChange={handleChange}
                    className="w-full p-4 h-32 outline-none text-sm resize-none"
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
                    <p className="text-xs text-gray-600 px-4 pb-2">
                      📄 {files.orgFile.name}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 px-4 pb-3">
                    Example: Mentoring juniors, organizing events, helping team members
                  </p>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-center gap-2 pt-4 border-t">

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium shadow hover:bg-blue-700 transition"
                >
                  Submit
                </button>

                <button
                  onClick={handleSave}
                  className="bg-blue-100 text-blue-700 px-8 py-2.5 rounded-lg font-medium hover:bg-blue-200 transition"
                >
                  Save Draft
                </button>

                <button
                  onClick={handleCancel}
                  className="bg-gray-100 text-gray-700 px-8 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
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