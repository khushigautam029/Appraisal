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

    const active =
      data.find((c) => c.status === "Active") || data[data.length - 1];

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
      const input = reportRef.current;

      if (!input) {
        console.error("Report ref not found");
        setIsExporting(false);
        return;
      }

      try {
        const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Multi-page support
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${employeeName}_Appraisal_Report.pdf`);
      } catch (error) {
        console.error("PDF Error:", error);
      } finally {
        setIsExporting(false);
      }
    }, 300);
  };

  return (

    <div className="min-h-screen bg-gray-50 px-2 py-4 space-y-8 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-semibold text-gray-800">
          Appraisal Report
        </h1>

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
            className="border px-4 py-2 rounded-lg text-sm bg-gray-50"
          >
            {cycles.map((c, i) => (
              <option key={i} value={c.name || `${c.startDate}-${c.endDate}`}>
                {c.name || `${c.startDate} - ${c.endDate}`}
              </option>
            ))}
          </select>

          <button
            onClick={handleGo}
            className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-900"
          >
            Load
          </button>

          {showReport && (
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              <FaFileDownload />
              Export
            </button>
          )}
        </div>
      </div>

      {/* REPORT */}
      {showReport && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">

          {/* INFO BAR */}
          <div className="flex justify-between text-sm text-gray-600 px-6 py-3 border-b bg-gray-50">
            <span><b>Name:</b> {employeeName}</span>
            <span><b>Submitted:</b> {new Date().toLocaleDateString()}</span>
            <span><b>Start:</b> {selectedCycleObj?.startDate}</span>
            <span><b>End:</b> {selectedCycleObj?.endDate}</span>
          </div>

          {/* TABS */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("self")}
              className={`px-6 py-3 text-sm font-medium transition ${activeTab === "self"
                  ? "border-b-2 border-blue-600 text-blue-700 bg-blue-50"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              Self Review
            </button>

            <button
              onClick={() => setActiveTab("manager")}
              className={`px-6 py-3 text-sm font-medium transition ${activeTab === "manager"
                  ? "border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              Manager Review
            </button>
          </div>

          <div className="p-6">

            {/* SELF TAB */}
            {activeTab === "self" && (
              !selfData.found ? (
                <StatusBox
                  title="Self Appraisal Not Submitted"
                  description="You have not submitted your self appraisal for this cycle."
                  color="yellow"
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <Card title="Achievements" value={selfData.achievements} color="blue" />
                  <Card title="Improvements" value={selfData.improvements} color="amber" />
                  <Card title="Skills" value={selfData.skills} color="emerald" />
                  <Card title="Organization Work" value={selfData.organizationWork} color="purple" />
                </div>
              )
            )}

            {/* MANAGER TAB */}
            {activeTab === "manager" && (
              !managerData.found ? (
                <StatusBox
                  title="Manager Review Pending"
                  description="Your manager has not reviewed your appraisal yet."
                  color="blue"
                />
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card title="Communication" value={managerData.communication} color="sky" />
                    <Card title="Technical Skills" value={managerData.technicalSkills} color="indigo" />
                    <Card title="Teamwork" value={managerData.teamwork} color="fuchsia" />
                    <Card title="Punctuality" value={managerData.punctuality} color="rose" />
                  </div>

                  <div className="mt-6 space-y-4">
                    <Card title="Strengths" value={managerData.strengths} color="emerald" />
                    <Card title="Improvements" value={managerData.improvements} color="amber" />
                    <Card title="Final Remarks" value={managerData.remarks} color="violet" />
                  </div>

                  <div className="mt-6 flex justify-between border-t pt-4">
                    <span className="text-gray-600">Overall Rating</span>
                    <span className="font-semibold text-lg text-indigo-600">
                      {managerData.rating} / 5
                    </span>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
      {showReport && isExporting && (
        <div className="absolute top-[-9999px] left-[-9999px] w-[1000px] bg-white p-6">

          <div ref={reportRef} className="bg-white p-6">

            {/* HEADER */}
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Appraisal Report
            </h1>

            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span><b>Name:</b> {employeeName}</span>
              <span><b>Date:</b> {new Date().toLocaleDateString()}</span>
              <span><b>Cycle:</b> {selectedCycle}</span>
            </div>

            {/* SELF SECTION */}
            <h2 className="text-lg font-semibold mb-3 text-blue-700">
              Self Review
            </h2>

            {selfData.found ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card title="Achievements" value={selfData.achievements} color="blue" />
                <Card title="Improvements" value={selfData.improvements} color="amber" />
                <Card title="Skills" value={selfData.skills} color="emerald" />
                <Card title="Organization Work" value={selfData.organizationWork} color="purple" />
              </div>
            ) : (
              <p className="text-gray-400 mb-6">Not Submitted</p>
            )}

            {/* MANAGER SECTION */}
            <h2 className="text-lg font-semibold mb-3 text-indigo-700">
              Manager Review
            </h2>

            {managerData.found ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card title="Communication" value={managerData.communication} color="sky" />
                  <Card title="Technical Skills" value={managerData.technicalSkills} color="indigo" />
                  <Card title="Teamwork" value={managerData.teamwork} color="fuchsia" />
                  <Card title="Punctuality" value={managerData.punctuality} color="rose" />
                </div>

                <div className="mt-4 space-y-3">
                  <Card title="Strengths" value={managerData.strengths} color="emerald" />
                  <Card title="Improvements" value={managerData.improvements} color="amber" />
                  <Card title="Final Remarks" value={managerData.remarks} color="violet" />
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <span className="text-gray-600">Overall Rating</span>
                  <span className="font-bold text-lg text-indigo-600">
                    {managerData.rating} / 5
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-400">Pending</p>
            )}

          </div>
        </div>
      )}

    </div>
  );
};





/* STATUS BOX */
const StatusBox = ({ title, description, color }) => {
  const styles = {
    yellow: "bg-yellow-50 border-yellow-300 text-yellow-800",
    blue: "bg-blue-50 border-blue-300 text-blue-800",
  };

  return (
    <div className={`p-10 rounded-xl border-l-4 shadow-sm text-center ${styles[color]}`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

/* COLORED CARD */
const Card = ({ title, value, color }) => {
  const styles = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900",
    sky: "bg-sky-50 border-sky-200 text-sky-900",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
    fuchsia: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900",
    rose: "bg-rose-50 border-rose-200 text-rose-900",
    violet: "bg-violet-50 border-violet-200 text-violet-900",
  };

  return (
    <div className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition ${styles[color]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">
        {title}
      </p>
      <p className="text-sm leading-relaxed">
        {value || "N/A"}
      </p>
    </div>
  );
};

export default AppraisalReport;