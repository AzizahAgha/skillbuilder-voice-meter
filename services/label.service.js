import axios from "./axiosInstance";

const labelService = {
  create: async ({ teamId, type, id, text }) => {
    const res = await axios.post(`/team/${teamId}/${type}/${id}/label`, {
      label: [text],
    });
    return res.data;
  },

  delete: async ({ teamId, type, id, label }) => {
    // console.log(label);
    const res = await axios.delete(`/team/${teamId}/${type}/${id}/label`, {
      data: {
        deletedLabel: [label],
      },
    });
    return res.data;
  },

  getAll: async ({ teamId, type }) => {
    const res = await axios.get(`/team/${teamId}/labels`, { params: { type } });
    return res.data.data;
  },
};

export default labelService;
