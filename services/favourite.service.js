import axios from "./axiosInstance";
import questionListTransformer from "@transformers/question-list.transformer";

const favouriteService = {
  toggle: async ({ teamId, questionId, favorite = true }) => {
    const res = await axios.post(
      `/team/${teamId}/question/${questionId}/favorite`,
      { favorite }
    );
    return res.data;
  },

  getAll: async ({ teamId, params }) => {
    const pageParam = params?.page || 1;
    const res = await axios.get(`/team/${teamId}/questions/favorite`, {
      params,
    });
    return {
      ...res.data,
      data: questionListTransformer(res.data.data),
      page: pageParam,
      hasNextPage: res.data.count >= pageParam * 10,
    };
  },

  getAllFavourites: async ({ teamId, params }) => {
    const res = await axios.get(`/team/${teamId}/questions/favorite`, {
      params,
    });
    return {
      ...res.data,
      data: questionListTransformer(res.data.data),
    };
  },
};

export default favouriteService;
