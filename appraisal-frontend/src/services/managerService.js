import api from "./api";

// 🔹 Dashboard
export const getDashboard = (managerName, cycleId) => {
  return api.get(`/manager/dashboard?managerName=${managerName}${cycleId ? `&cycleId=${cycleId}` : ''}`);
};

// 🔹 Team Status (Includes PENDING, SUBMITTED, COMPLETED statuses)
export const getTeamStatus = (managerName, cycleId) => {
  return api.get(`/manager/team-status?managerName=${managerName}&cycleId=${cycleId}`);
};

// 🔹 Detailed Reports
export const getReports = (managerName, cycleId) => {
  return api.get(`/manager/reports?managerName=${managerName}&cycleId=${cycleId}`);
};

// 🔹 Legacy Employees (Team Overview)
export const getEmployees = (managerName) => {
  return api.get(`/manager/employees?managerName=${managerName}`);
};

// 🔹 Delete Target
export const deleteTarget = (id) => {
  return api.delete(`/manager/goal/${id}`);
};

// 🔹 Submit Review
export const submitReview = async (employeeId, cycleId, reviewData) => {
  const response = await api.post(
    `/review/${employeeId}/cycle/${cycleId}`,
    reviewData
  );
  return response.data;
};

export const getReviews = async () => {
  return await api.get("/review");
};

export const assignTarget = (empId, cycleId, data) => {
  return api.post(`/api/goals/employee/${empId}/cycle/${cycleId}`, data);
};

export const getTargets = () => {
  return api.get(`/api/goals`);
};

export const getTargetsByManager = (managerName) => {
  return api.get(`/api/goals/manager?managerName=${managerName}`);
};

export const updateStatus = (id, status) => {
  return api.put(`/api/goals/${id}/status?status=${status}`);
};

export const getGoalsByEmployee = (empId) => {
  return api.get(`/api/goals/employee/${empId}`);
};

export const getSelfEvaluationByEmployee = (empId) => {
  return api.get(`/evaluations/employee/${empId}`);
};