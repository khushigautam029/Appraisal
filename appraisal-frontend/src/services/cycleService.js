import api from "./api";

const normalizeCycles = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
};

export const getActiveCycle = async () => {
  try {
    const res = await api.get("/cycles");
    const cycles = normalizeCycles(res.data);
    if (Array.isArray(cycles) && cycles.length > 0) {
      const active = cycles.find(c => c.status?.toLowerCase() === "active");
      const cycle = active || cycles[cycles.length - 1];
      if (cycle) {
        localStorage.setItem("activeCycleId", cycle.id);
      }
      return cycle;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch active cycle", error);
    return null;
  }
};

export const getAllCycles = async () => {
  const res = await api.get("/cycles");
  return {
    ...res,
    data: normalizeCycles(res.data),
  };
};

export const createCycle = (cycleData) => {
  return api.post("/cycles", cycleData);
};

export const updateCycle = (id, cycleData) => {
  return api.put(`/cycles/${id}`, cycleData);
};

export const deleteCycle = (id) => {
  return api.delete(`/cycles/${id}`);
};
