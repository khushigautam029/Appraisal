import api from "./api";

const API_URL = "/notifications";

export const getNotifications = async (userId, role) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No token found in localStorage. User may not be authenticated.");
    }
    console.log(`📡 Fetching notifications for userId=${userId}, role=${role}`);
    const response = await api.get(`${API_URL}/${userId}?role=${role}`);
    console.log("✅ Notifications fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch notifications", error.response?.status, error.message);
    return [];
  }
};

export const getUnreadNotifications = async (userId, role) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No token found in localStorage. User may not be authenticated.");
    }
    console.log(`📡 Fetching unread notifications for userId=${userId}, role=${role}`);
    const response = await api.get(`${API_URL}/${userId}/unread?role=${role}`);
    console.log("✅ Unread notifications fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch unread notifications", error.response?.status, error.message);
    return [];
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await api.put(`${API_URL}/${id}/read`);
    return response.data;
  } catch (error) {
    console.error(`Failed to mark notification ${id} as read`, error);
    return null;
  }
};

export const createNotification = async (userId, role, message, type) => {
  try {
    await api.post(`${API_URL}/${userId}?role=${role}&message=${encodeURIComponent(message)}&type=${type}`);
  } catch (error) {
    console.error("Failed to create explicit notification", error);
  }
};
