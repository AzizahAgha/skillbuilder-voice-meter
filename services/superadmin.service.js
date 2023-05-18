import { async } from "regenerator-runtime";
import axios from "./axiosInstance";

const superadminService = {

  getAccounts: async (type, searchString, page, size = 12) => {
    const res = await axios.get('/super-admin/accounts', { params: { type, searchString, page, size } });
    return {
      ...res.data,
      page,
      hasNextPage: res.data.data.length >= 12
    };
  },

  updateUserStatus: async (teamId, userId, status) => {
    const res = await axios.patch(`/super-admin/team/${teamId}/user/${userId}/status`, { status });
    return res.data;
  },

  deleteUser: async (teamId, userId) => {
    const res = await axios.patch(`/super-admin/team/${teamId}/user/${userId}/delete`);
    return res.data;
  },

  addAsAdmin: async(teamId, userId) =>{
    const res = await axios.patch(`/team/${teamId}/user/${userId}/admin`);
    return res.data;
  }
}

export default superadminService;
