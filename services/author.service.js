import axios from "./axiosInstance";

const authorService = {

  getAll: async ({ teamId, type }) => {
    const res = await axios.get(`/team/${teamId}/authors`, { params: { type } });
    return res.data.data;
  }

}

export default authorService;
