import axios from "./axiosInstance";
import notificationsTransformer from "@transformers/notifications.transformer";

const ActivityService = {
  get: async (teamId, params) => {
    const res = await axios.get(`/team/${teamId}/notifications-activities`, {
      params,
    });
    return notificationsTransformer(res.data.finalData);
  },
};

export default ActivityService;
