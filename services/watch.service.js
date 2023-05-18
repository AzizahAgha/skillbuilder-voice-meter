import { async } from "regenerator-runtime";
import axios from "./axiosInstance";

const watchService = {
  update: async (teamId, questionId, data) => {
    const res = await axios.post(
      `/team/${teamId}/question/${questionId}/watch`,
      data
    );
    return res.data;
  },

  getUsers: async ({ teamId, questionId }) => {
    const res = await axios.get(
      `/team/${teamId}/question/${questionId}/watches`
    );
    return res.data;
  },
  watchUsers: async (teamId, searchString) => {
    const res = await axios.get(
      `/team/${teamId}/watch-users?searchString=${searchString}`
    );
    return res.data;
  },
};

export default watchService;
