import { useEffect, useState } from "react";
import { FaBuilding, FaExclamationCircle, FaSpinner, FaStar, FaTimes, FaUsers, FaUserTie } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { getEmployees, getGoalsByEmployee, getReviews, getSelfEvaluationByEmployee } from "../../services/managerService";

const TeamOverview = () => {
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [employeeGoals, setEmployeeGoals] = useState([]);
  const [employeeEvaluation, setEmployeeEvaluation] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const managerName = localStorage.getItem("userName");

      const [empRes, reviewRes] = await Promise.all([
        getEmployees(managerName),
        getReviews(),
      ]);

      setEmployees(empRes.data || []);
      setReviews(reviewRes.data || []);
    } catch (err) {
      console.error("Error fetching team:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname, refreshKey]);

  const handleEmployeeClick = async (emp) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
    setModalLoading(true);
    setEmployeeGoals([]);
    setEmployeeEvaluation(null);

    try {
      const [goalsRes, evalRes] = await Promise.allSettled([
        getGoalsByEmployee(emp.id),
        getSelfEvaluationByEmployee(emp.id)
      ]);

      if (goalsRes.status === "fulfilled" && goalsRes.value) {
        setEmployeeGoals(goalsRes.value.data || []);
      }
      
      if (evalRes.status === "fulfilled" && evalRes.value) {
        setEmployeeEvaluation(evalRes.value.data || null);
      }
    } catch (err) {
      console.error("Error fetching employee details", err);
    } finally {
      setModalLoading(false);
    }
  };

  // 🔹 Merge Data
  const mergedData = employees.map((emp) => {
    const review = reviews.find(
      (r) => r?.employee?.id === emp.id
    );

    const mappedStatus = emp.status?.toUpperCase() || "PENDING";

    return {
      ...emp,
      rating: review?.rating || 0,
      review: review || null,
      status: mappedStatus,
    };
  });

  // 🎨 Status styles - Premium Palette
  const getStatusStyle = (status) => {
    if (status === "COMPLETED")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "SUBMITTED")
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <div className="p-1 md:p-1 relative overflow-hidden">
      
      {/* 🌟 Background Decorative Elements */}
      {/* <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none"></div> */}

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 pb-1">
        
        {/* ✨ Header Section */}
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Team Overview
              </h2>
            </div>
          </div>
          
          {/* <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95 group"
          >
            <FaSyncAlt className={`text-slate-400 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-semibold">Sync Data</span>
          </button> */}
        

        {/* 🔷 Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[250px] bg-white/50 animate-pulse rounded-3xl border border-white shadow-sm"></div>
            ))}
          </div>
        )}

        {/* 🏜️ Empty State */}
        {!loading && mergedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-sm rounded-[40px] border border-white/60 border-dashed">
            <div className="bg-slate-100 p-8 rounded-full mb-6">
              <FaUsers className="text-slate-300 text-6xl" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No team members found</h3>
            <p className="text-slate-500 max-w-sm text-center">
              It looks like you don't have any reporting employees assigned. Please contact HR to update your team structure.
            </p>
          </div>
        )}

        {/* 🎴 Employee Cards Grid */}
        {!loading && mergedData.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mergedData.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleEmployeeClick(emp)}
                className="group bg-white rounded-[32px] p-1 border border-white shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {/* Premium Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center font-bold text-indigo-600 text-2xl border border-indigo-100 shadow-inner group-hover:scale-105 transition-transform">
                          {emp.name?.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                          {emp.name}
                        </h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <FaUserTie className="text-[10px]" /> {emp.designation || 'Staff Member'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-medium">Department</span>
                      <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                        <FaBuilding className="text-indigo-300 text-xs" /> {emp.department || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm font-medium">Status</span>
                      <span
                        className={`px-4 py-1.5 text-[10px] rounded-2xl font-black uppercase tracking-wider border shadow-sm ${getStatusStyle(
                          emp.status
                        )}`}
                      >
                        {emp.status === "PENDING"
                          ? "Pending"
                          : emp.status === "SUBMITTED"
                          ? "Review Ready"
                          : "Finalized"}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-50 w-full"></div>

                    {/* Rating Section */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm font-medium">Appraisal Rating</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            className={`transition-all duration-300 ${
                              s <= emp.rating
                                ? "text-amber-400 drop-shadow-sm scale-110"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 opacity-20 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Employee Profile Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-8 py-5 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Employee Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white rounded-full p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-slate-100">
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
              {modalLoading ? (
                <div className="flex flex-col justify-center items-center py-20 gap-4">
                  <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
                  <p className="text-slate-500 font-medium animate-pulse">Loading profile data...</p>
                </div>
              ) : (
                <>
                  {/* Header / Info */}
                  <div className="flex items-center gap-6 bg-gradient-to-r from-indigo-50/50 to-white p-6 rounded-3xl border border-indigo-50/50">
                    <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center font-bold text-indigo-600 text-4xl border-[3px] border-white shadow-md">
                      {selectedEmployee.name?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800">{selectedEmployee.name}</h2>
                      <div className="flex gap-3 mt-3 text-sm font-semibold">
                        <span className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full shadow-sm"><FaUserTie className="text-indigo-400" /> {selectedEmployee.designation || 'Staff Member'}</span>
                        <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full shadow-sm"><FaBuilding className="text-emerald-400" /> {selectedEmployee.department || 'General'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Self Appraisal Status */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      Self Appraisal 
                      <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Current Cycle</span>
                    </h3>
                    {employeeEvaluation ? (
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Status</span>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">{employeeEvaluation.status}</span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <strong className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2 font-bold">Key Achievements</strong>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{employeeEvaluation.achievements || 'Not provided'}</p>
                          </div>
                          
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <strong className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2 font-bold">Areas for Improvement</strong>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{employeeEvaluation.improvements || 'Not provided'}</p>
                          </div>
                          
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 md:col-span-2">
                            <strong className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2 font-bold">Organizational Contributions</strong>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{employeeEvaluation.organizationWork || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 bg-amber-50/50 p-8 rounded-3xl border border-amber-100 border-dashed">
                        <FaExclamationCircle className="text-amber-400 text-3xl" />
                        <span className="text-amber-700 font-medium">Self-appraisal not submitted yet.</span>
                      </div>
                    )}
                  </div>

                  {/* Assigned Targets */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Assigned Targets</h3>
                    {employeeGoals && employeeGoals.length > 0 ? (
                      <div className="grid gap-3">
                        {employeeGoals.map(goal => (
                          <div key={goal.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow gap-4">
                            <div>
                              <h4 className="font-bold text-slate-800 text-base">{goal.description || goal.title}</h4>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full border shadow-sm w-fit ${
                              goal.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              goal.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {goal.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                        <p className="text-slate-500 text-sm">No targets assigned to this employee yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Manager Review */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Manager Review Feedback</h3>
                    {selectedEmployee.review ? (
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                          <div>
                            <strong className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">Final Rating</strong>
                            <div className="flex gap-1.5 text-amber-400">
                              {[1, 2, 3, 4, 5].map(s => (
                                <FaStar key={s} className={`text-xl transition-all ${s <= selectedEmployee.rating ? 'opacity-100 drop-shadow-sm' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <strong className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">Current Status</strong>
                            <span className={`px-4 py-1.5 text-[10px] rounded-2xl font-black uppercase tracking-wider border shadow-sm inline-block ${
                              selectedEmployee.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              selectedEmployee.status === 'SUBMITTED' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                              'bg-amber-100 text-amber-700 border-amber-200'
                            }`}>
                              {selectedEmployee.status === 'PENDING' ? 'Pending' :
                               selectedEmployee.status === 'SUBMITTED' ? 'Review Ready' : 'Finalized'}
                            </span>
                          </div>
                        </div>

                        {/* Detailed Feedback */}
                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                            <strong className="text-[11px] text-emerald-600 uppercase tracking-wider block mb-2 font-bold">Strengths</strong>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{selectedEmployee.review.strengths || 'Not provided'}</p>
                          </div>
                          
                          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                            <strong className="text-[11px] text-amber-600 uppercase tracking-wider block mb-2 font-bold">Areas for Improvement</strong>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{selectedEmployee.review.improvements || 'Not provided'}</p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 md:col-span-2">
                            <strong className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2 font-bold">General Remarks</strong>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{selectedEmployee.review.remarks || 'Not provided'}</p>
                          </div>
                        </div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold mb-1">Communication</span>
                            <span className="text-sm font-semibold text-slate-700">{selectedEmployee.review.communication || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold mb-1">Tech Skills</span>
                            <span className="text-sm font-semibold text-slate-700">{selectedEmployee.review.technicalSkills || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold mb-1">Teamwork</span>
                            <span className="text-sm font-semibold text-slate-700">{selectedEmployee.review.teamwork || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold mb-1">Punctuality</span>
                            <span className="text-sm font-semibold text-slate-700">{selectedEmployee.review.punctuality || 'N/A'}</span>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 border-dashed">
                        <span className="text-slate-500 font-medium">No feedback provided yet.</span>
                        <span className={`px-4 py-1.5 text-[10px] rounded-2xl font-black uppercase tracking-wider border shadow-sm inline-block ${
                          selectedEmployee.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          selectedEmployee.status === 'SUBMITTED' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                          'bg-amber-100 text-amber-700 border-amber-200'
                        }`}>
                          {selectedEmployee.status === 'PENDING' ? 'Pending' :
                           selectedEmployee.status === 'SUBMITTED' ? 'Review Ready' : 'Finalized'}
                        </span>
                      </div>
                    )}
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

export default TeamOverview;