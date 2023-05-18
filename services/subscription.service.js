import axios from "./axiosInstance";

const subscriptionService = {
  changeSubscriptionPlan: async (teamId, priceId) => {
    const res = await axios.patch(`/team/${teamId}/subscriptions`, {
      priceId: priceId,
    });
    return res.data;
  },

  cancelSubscription: async (teamId) => {
    const res = await axios.delete(`/team/${teamId}/subscriptions`);
    return res.data;
  },

  changePaymentMethodCreateSession: async (teamId) => {
    const res = await axios.post(`/team/${teamId}/payments/checkout/setup`);
    return res.data;
  },
};

export default subscriptionService;
