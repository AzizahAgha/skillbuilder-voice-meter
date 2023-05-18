import axios from "./axiosInstance";
import billingInfoTransformer from "@transformers/billing-info.transformer";

const billingService = {

  get: async (teamId) => {   
    const res = await axios.get(`/team/${teamId}/billing`);
    return billingInfoTransformer(res.data.data);
  },

  update: async (teamId, data) => {
    const res = await axios.patch(`/team/${teamId}/billing-contact`, data);
    return res.data;
  },
  getPlans: async () => {
    const res = await axios.get(`/plans`);
    return res.data.data;
  }
};

export default billingService;
