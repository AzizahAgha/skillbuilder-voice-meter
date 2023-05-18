import axios from "./axiosInstance";
import transformTeam from "@transformers/team.transformer";
import userActivityTransformer from "@transformers/userActivity.transformer";
import invoiceTransformer from "@transformers/invoice.transformer";
import expandableTransformer from "@transformers/expanded.transformer";

const teamService = {
  create: async ({ teamName, displayName }) => {
    const res = await axios.post("/team", { teamName, displayName });
    return transformTeam(res.data.data);
  },

  get: async (id) => {
    const res = await axios.get(`/team/${id}`);
    return transformTeam(res.data.data);
  },

  getAll: async () => {
    const res = await axios.get("/teams");
    return res.data.data?.map(transformTeam);
  },

  updateStatus: async (teamId) => {
    const res = await axios.patch("/team/status", { teamId });
    return res.data;
  },

  suggestions: async (teamName) => {
    const res = await axios.post("/team/suggestion", { teamName });
    return res.data.data;
  },

  getStats: async ({ teamId, params }) => {
    const res = await axios.get(`/admin/dashboard/${teamId}`, { params });
    return res.data.data;
  },

  getUserActivity: async ({ teamId, params }) => {
    const pageParam = params?.page || 1;
    const res = await axios.get(`/admin/dashboard/${teamId}/user-activity`, {
      params,
    });
    return {
      ...res.data,
      data: userActivityTransformer(res.data.data),
      page: pageParam,
      hasNextPage: res.data.totalRecords >= pageParam * 10,
    };
  },

  getAllUsers: async (teamId) => {
    const res = await axios.get(`/team/${teamId}/users`);
    return {
      ...res.data,
      data: {
        ...res.data.data,
        teamUsers: expandableTransformer(res.data.data.teamUsers),
      },
    };
  },

  update: async (id, data) => {
    var formdata = new FormData();
    formdata.append("teamImage", data.teamImage);
    formdata.append("teamDetails", JSON.stringify(data.teamDetails));
    const response = await axios.patch(`/team/${id}`, formdata);
    return response.data;
  },

  leave: async ({ teamId, userId }) => {
    const res = await axios.patch(
      `/admin/team/${teamId}/user/${userId}/leave-team`
    );
    return res.data;
  },

  delete: async (teamId) => {
    const res = await axios.delete(`/admin/team/${teamId}/delete-team`);
    return res.data;
  },

  getAllInvoices: async (teamId, next) => {
    const res = await axios.get(
      `/team/${teamId}/invoices${next ? "?next=" + next : ""}`
    );

    return {
      data: invoiceTransformer(res.data.data),
    };
  },

  industries: async () => {
    const res = await axios.get(`/industries`);
    return res.data;
  },
  
  createStarterTeam: async () => {
    const res = await axios.get("/create-starter-team");
    return res.data.data;
  },
};

export default teamService;
