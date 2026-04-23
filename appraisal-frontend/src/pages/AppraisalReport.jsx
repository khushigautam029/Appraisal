import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { getAllCycles } from "../services/cycleService";
import {
  getEmployeeByUserId,
  getEvaluationByEmployeeAndCycle,
  getReviewByEmployeeAndCycle,
} from "../services/employeeService";

const AppraisalReport = () => {
  const reportRef = useRef();

  const [selectedCycle, setSelectedCycle] = useState("");
  const [cycles, setCycles] = useState([]);
  const [selectedCycleObj, setSelectedCycleObj] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const [selfData, setSelfData] = useState({ found: false });
  const [managerData, setManagerData] = useState({ found: false });

  const [employeeName, setEmployeeName] = useState("User");
  const [activeTab, setActiveTab] = useState("self");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
     
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    const res = await getAllCycles();
    const data = res.data || [];
    setCycles(data);

    const active = data.find((c) => c.status === "Active") || data[data.length - 1];
    if (active) {
      const val = active.name || `${active.startDate}-${active.endDate}`;
      setSelectedCycle(val);
      setSelectedCycleObj(active);
    }
  };

  const handleGo = async () => {
    const userId = localStorage.getItem("userId");
    const emp = await getEmployeeByUserId(userId);
    if (!emp) return;

    const empId = emp.id;
    const cycleId = selectedCycleObj.id;

    try {
      const self = await getEvaluationByEmployeeAndCycle(empId, cycleId);
      setSelfData({ ...self, found: !!self });
      setEmployeeName(self?.employee?.name || "User");
    } catch {
      setSelfData({ found: false });
    }

    try {
      const manager = await getReviewByEmployeeAndCycle(empId, cycleId);
      setManagerData({ ...manager, found: !!manager });
    } catch {
      setManagerData({ found: false });
    }

    setShowReport(true);
  };

  const downloadPDF = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      if (!reportRef.current) {
        setIsExporting(false);
        return;
      }
      try {
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
        const img = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(img, "PNG", 0, 0, width, height);
        pdf.save(`${employeeName}_Report.pdf`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen space-y-6">

      {/* 🔹 HEADER (LIKE IMAGE) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">

        {/* LEFT */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Appraisal Report
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <select
            value={selectedCycle}
            onChange={(e) => {
              setSelectedCycle(e.target.value);
              const obj = cycles.find(
                (c) =>
                  (c.name || `${c.startDate}-${c.endDate}`) === e.target.value
              );
              setSelectedCycleObj(obj);
            }}
            className="border px-3 py-2 rounded-md text-sm bg-gray-50 focus:outline-none"
          >
            {cycles.map((c, i) => (
              <option key={i} value={c.name || `${c.startDate}-${c.endDate}`}>
                {c.name || `${c.startDate} - ${c.endDate}`}
              </option>
            ))}
          </select>

          <button
            onClick={handleGo}
            className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900"
          >
            Load
          </button>

          {showReport && (
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
              <FaFileDownload />
              Export
            </button>
          )}
        </div>
      </div>

      {/* 🔹 REPORT */}
      {showReport && (
        <div className="bg-white rounded-lg shadow border">

          {/* INFO BAR */}
          <div className="flex justify-between text-xs text-black-500 px-6 py-3 border-b bg-gray-70">
            <span><b>Name:</b> {employeeName}</span>
            <span><b>Submitted:</b> {new Date().toLocaleDateString()}</span>
            <span><b>Start:</b> {selectedCycleObj?.startDate}</span>
            <span><b>End:</b> {selectedCycleObj?.endDate}</span>
          </div>

          {/* TABS */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("self")}
              className={`px-6 py-3 text-sm ${
                activeTab === "self"
                  ? "border-b-2 border-gray-700 text-blue-800"
                  : "text-gray-500"
              }`}
            >
              Self Review
            </button>

            <button
              onClick={() => setActiveTab("manager")}
              className={`px-6 py-3 text-sm ${
                activeTab === "manager"
                  ? "border-b-2 border-gray-700 text-gray-800"
                  : "text-blue-800"
              }`}
            >
              Manager Review
            </button>
          </div>

          <div className="p-6">

            {/* SELF */}
            {activeTab === "self" && (
              <>
                {!selfData.found ? (
                  <p className="text-gray-400 text-sm">
                    No self appraisal submitted.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Card title="Achievements" value={selfData.achievements} colorClass="bg-blue-50 border-blue-100 text-blue-900" />
                    <Card title="Improvements" value={selfData.improvements} colorClass="bg-amber-50 border-amber-100 text-amber-900" />
                    <Card title="Skills" value={selfData.skills} colorClass="bg-emerald-50 border-emerald-100 text-emerald-900" />
                    <Card title="Organization Work" value={selfData.organizationWork} colorClass="bg-purple-50 border-purple-100 text-purple-900" />
                  </div>
                )}
              </>
            )}

            {/* MANAGER */}
            {activeTab === "manager" && (
              <>
                {!managerData.found ? (
                  <p className="text-gray-400 text-sm">
                    Review pending from manager.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Card title="Communication" value={managerData.communication} colorClass="bg-sky-50 border-sky-100 text-sky-900" />
                      <Card title="Technical Skills" value={managerData.technicalSkills} colorClass="bg-indigo-50 border-indigo-100 text-indigo-900" />
                      <Card title="Teamwork" value={managerData.teamwork} colorClass="bg-fuchsia-50 border-fuchsia-100 text-fuchsia-900" />
                      <Card title="Punctuality" value={managerData.punctuality} colorClass="bg-rose-50 border-rose-100 text-rose-900" />
                    </div>

                    <div className="mt-4 space-y-3">
                      <Card title="Strengths" value={managerData.strengths} colorClass="bg-emerald-50 border-emerald-100 text-emerald-900" />
                      <Card title="Improvements" value={managerData.improvements} colorClass="bg-amber-50 border-amber-100 text-amber-900" />
                      <Card title="Final Remarks" value={managerData.remarks} colorClass="bg-violet-50 border-violet-100 text-violet-900" />
                    </div>

                    <div className="mt-4 flex justify-between border-t pt-4">
                      <span className="text-sm text-gray-600">
                        Overall Rating
                      </span>
                      <span className="font-semibold text-gray-800">
                        {managerData.rating} / 5
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* HIDDEN TEMPLATE FOR PDF GENERATION */}
      {showReport && isExporting && (
        <div className="absolute top-[-9999px] left-[-9999px] w-[800px] bg-white text-black p-8">
          <div ref={reportRef} className="bg-white p-8 rounded-lg">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Appraisal Summary
              </h2>
              <div className="text-sm text-gray-500 mt-2 flex justify-between">
                <div>
                  <p><b>Name:</b> {employeeName}</p>
                  <p><b>Cycle:</b> {selectedCycle}</p>
                </div>
                <div className="text-right">
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Self Evaluation</h3>
              {!selfData.found ? (
                <p className="text-gray-400 text-sm">No self appraisal submitted.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Card title="Achievements" value={selfData.achievements} colorClass="bg-blue-50 border-blue-100 text-blue-900" />
                  <Card title="Improvements" value={selfData.improvements} colorClass="bg-amber-50 border-amber-100 text-amber-900" />
                  <Card title="Skills" value={selfData.skills} colorClass="bg-emerald-50 border-emerald-100 text-emerald-900" />
                  <Card title="Organization Work" value={selfData.organizationWork} colorClass="bg-purple-50 border-purple-100 text-purple-900" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-3">Manager Evaluation</h3>
              {!managerData.found ? (
                <p className="text-gray-400 text-sm">Review pending from manager.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <Card title="Communication" value={managerData.communication} colorClass="bg-sky-50 border-sky-100 text-sky-900" />
                    <Card title="Technical Skills" value={managerData.technicalSkills} colorClass="bg-indigo-50 border-indigo-100 text-indigo-900" />
                    <Card title="Teamwork" value={managerData.teamwork} colorClass="bg-fuchsia-50 border-fuchsia-100 text-fuchsia-900" />
                    <Card title="Punctuality" value={managerData.punctuality} colorClass="bg-rose-50 border-rose-100 text-rose-900" />
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <Card title="Strengths" value={managerData.strengths} colorClass="bg-emerald-50 border-emerald-100 text-emerald-900" />
                    <Card title="Improvements" value={managerData.improvements} colorClass="bg-amber-50 border-amber-100 text-amber-900" />
                    <Card title="Final Remarks" value={managerData.remarks} colorClass="bg-violet-50 border-violet-100 text-violet-900" />
                  </div>
                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <p className="text-gray-600 font-medium">Overall Rating</p>
                    <span className="text-lg font-semibold text-indigo-600">{managerData.rating} / 5</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Card = ({ title, value, colorClass }) => (
  <div className={`border rounded-xl p-4 transition shadow-sm ${colorClass || "bg-gray-50 border-gray-100 hover:bg-gray-100"}`}>
    <p className={`text-xs font-bold uppercase tracking-wider opacity-70 mb-1`}>{title}</p>
    <p className="text-sm font-medium text-gray-900 leading-relaxed font-sans">{value || "N/A"}</p>
  </div>
);

export default AppraisalReport;