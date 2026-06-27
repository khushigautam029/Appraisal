import api from "./api";

// ================= EMPLOYEE & USER APIs =================

// 🔹 ADD STAFF (Handles User + Employee/Manager)
export const addHrStaff = async (staffData) => {
  const res = await api.post(`/hr/staff`, staffData);
  return res.data;
};

// 🔹 UPDATE STAFF
export const updateHrStaff = async (id, data) => {
  const res = await api.put(`/hr/staff/${id}`, data);
  return res.data;
};

// 🔹 DELETE STAFF
export const deleteHrStaff = async (id) => {
  const res = await api.delete(`/hr/staff/${id}`);
  return res.data;
};

// 🔹 GET ALL EMPLOYEES
export const getEmployees = async () => {
  const res = await api.get(`/employee`);
  return res.data;
};

// ================= DEPARTMENT APIs =================

export const addDepartment = async (dept) => {
  const res = await api.post(`/hr/departments`, { name: dept });
  return res.data;
};

export const getDepartments = async () => {
  const res = await api.get(`/hr/departments`);
  return res.data;
};

export const deleteDepartment = async (id) => {
  const res = await api.delete(`/hr/departments/${id}`);
  return res.data;
};

// ================= HR DASHBOARD APIs =================

export const getHrDashboard = async () => {
  const res = await api.get(`/hr/dashboard`);
  return res.data;
};

export const getHrReviews = async () => {
  const res = await api.get(`/hr/reviews`);
  return res.data;
};

export const updateHrReview = async (id, { hrRating, hrRemarks, finalDecision }) => {
  const res = await api.put(`/hr/reviews/${id}`, {
    hrRating,
    hrRemarks,
    finalDecision,
  });
  return res.data;
};

export const getSelfEvaluationByEmployee = async (empId) => {
  const res = await api.get(`/evaluations/employee/${empId}`);
  return res.data;
};

export const getSelfEvaluationByEmployeeAndCycle = async (empId, cycleId) => {
  const res = await api.get(`/evaluations/employee/${empId}/cycle/${cycleId}`);
  return res.data;
};

// 🔹 UPDATE EMPLOYEE (FIXED)
export const updateEmployee = async (id, data) => {
  const res = await api.put(`/hr/staff/${id}`, data);
  return res.data;
};
