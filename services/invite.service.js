import axios from "./axiosInstance";
import transformTeam from "@transformers/team.transformer";

const inviteService = {
  create: async (data) => {
    const res = await axios.post("/invite", data);
    return res.data;
  },

  get: async (token, params) => {
    const res = await axios.get(`/invite/${token}`, { params });
    return {
      ...res.data.data,
      invitedTeam: transformTeam(res.data.data.invitedTeam),
    };
  },

  addUser: async (teamId, token, type) => {
    const res = await axios.post("/invite/user", {
      teamId,
      inviteToken: token,
      inviteType: type,
    });
    return res.data;
  },

  delete: async (teamId, email) => {
    const res = await axios.delete("/invite", {
      data: {
        teamId: teamId,
        email: email,
      },
    });
    return res.data;
  },

  getAllTeamUsers: async (teamId, params) => {
    const res = await axios.get(`/team/${teamId}/group-users`, { params });
    return res.data;
  },
};

export default inviteService;
