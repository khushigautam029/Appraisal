import api from "./api";

// ================= EMPLOYEE =================
export const getEmployees = async () => {
    const res = await api.get(`/employee`);
    return res.data;
};

export const getEmployeeById = async (id) => {
    try {
        const response = await api.get(`/employee/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching employee", error);
        return null;
    }
};

export const getEmployeeByUserId = async (userId) => {
    try {
        const response = await api.get(`/employee/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching employee by User ID", error);
        return null;
    }
};

// ================= SELF APPRAISAL =================

export const saveEvaluation = async (empId, cycleId, data) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post(`/evaluations/employee/${empId}/cycle/${cycleId}`, {
            achievements: data.achievements,
            improvements: data.improvements,
            organizationWork: data.organizationWork,
            skills: data.skills,
            status: data.status || "DRAFT",
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// SUBMIT
export const submitEvaluationById = async (id) => {
    const response = await api.put(`/evaluations/submit/${id}`);
    return response.data;
};

// GET existing evaluation
export const getEvaluationByEmployee = async (empId) => {
    const res = await api.get(`/evaluations/employee/${empId}`);
    return res.data;
};

export const getEvaluationByEmployeeAndCycle = async (empId, cycleId) => {
    const res = await api.get(`/evaluations/employee/${empId}/cycle/${cycleId}`);
    return res.data;
};

export const getReviewByEmployeeAndCycle = async (empId, cycleId) => {
    const res = await api.get(`/review/${empId}/cycle/${cycleId}`);
    return res.data;
};

// ================= GOALS =================

// ✅ GET (Now using User ID to resolve identity)
export const getGoals = async (userId) => {
    const res = await api.get(`/api/goals/user/${userId}`);
    return res.data;
};

// ✅ UPDATE
export const updateGoal = async (goalId, data) => {
    return api.put(`/api/goals/${goalId}`, data);
};

// ✅ SUBMIT
export const submitGoal = async (goalId, data) => {
    return api.put(`/api/goals/${goalId}/submit`, data);
};