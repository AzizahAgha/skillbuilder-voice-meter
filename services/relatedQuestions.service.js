import axios from "./axiosInstance";
import questionListTransformer from "@transformers/question-list.transformer";

const relatedQuestionsService = {

  getAll: async ({ teamId, questionId, params }) => {
    const res = await axios.get(`/team/${teamId}/question/${questionId}/related-questions`, { params });
    return {
      ...res.data,
      data: questionListTransformer(res.data.data)
    };
  },


  getLabels: async ({ teamId }) => {
    const res = await axios.get(`/team/${teamId}/related-questions-labels`);
    return {
      ...res.data,
      data: res.data.data.map(_l => _l.label)
    };
  },

}

export default relatedQuestionsService;
