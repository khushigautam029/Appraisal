import api from "./api";

export const getActiveCycle = async () => {
  try {
    const res = await api.get("/cycles");
    let cycles = res.data;
    // Handle if response is wrapped in a data property
    if (cycles && typeof cycles === 'object' && !Array.isArray(cycles) && cycles.data) {
      cycles = cycles.data;
    }
    if (Array.isArray(cycles) && cycles.length > 0) {
      const active = cycles.find(c => c.status === "Active");
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

export const getAllCycles = () => {
  return api.get("/cycles");
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
