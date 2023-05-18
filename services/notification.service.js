import axios from "./axiosInstance";
import fiveNotificationsTransformer from "@transformers/fiveNotifications.transformer";
import notificationsTransformer from "@transformers/notifications.transformer";

const notificationService = {
  getFive: async (teamId, params) => {
    const res = await axios.get(`/team/${teamId}/notifications`, { params });
    return fiveNotificationsTransformer(res.data);
  },

  getAll: async (teamId, params) => {
    const res = await axios.get(`/team/${teamId}/notifications`, {
      params: { ...params, type: "all" },
    });
    return notificationsTransformer(res.data.data);
  },

  update: async (teamId, notificationIDs) => {
    const res = await axios.patch(`/team/${teamId}/notifications/read`, {
      notifications: notificationIDs,
    });
    return res.data;
  },
  getNotificationUpdates: async (teamId) => {
    const res = await axios.get(`/team/${teamId}/notifications-live`);
    return res.data.data;
  },
};

export default notificationService;
