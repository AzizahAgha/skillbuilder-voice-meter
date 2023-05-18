import { async } from "regenerator-runtime";
import axios from "./axiosInstance";

const authService = {
  signIn: async ({ accessToken }) => {
    const res = await axios.post("/signup-test", { accessToken: accessToken });
    return res.data;
  },

  logout: async (teamId) => {
    const res = await axios.post("/logout", { teamId: teamId });
    return res.data;
  },
  getToken: async (code) => {
    const res = await axios.post("/user-token", { code: code });
    return res.data;
  },
  getRefreshToken: async (refreshToken) => {
    const res = await axios.post("/refresh-token", {
      refreshToken: refreshToken,
    });
    return res.data;
  },

  getMSToken: async (code, type) => {
    const res = await axios.post("/microsoft-user-token", {
      code: code,
      type: type,
    });
    return res.data;
  },
  getUserTokens: async (code) => {
    const res = await axios.get("/user/tokens");
    return res.data;
  },
};

export default authService;
