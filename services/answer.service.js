import axios from "./axiosInstance";
import answerListTransformer from "@transformers/answer-list.transformer";
import answerHistoryTransformer from "@transformers/answer-history.transformer";
import answerHistoryYearsTransformer from "@transformers/answer-history-years.transformer";

const answerService = {
  create: async (teamId, questionId, data) => {
    const res = await axios.post(
      `/team/${teamId}/question/${questionId}/answer`,
      data
    );
    return res.data;
  },

  getAll: async ({
    teamId,
    questionId,
    filters = defaultAnswerFilters,
    params,
  }) => {
    const res = await axios.post(
      `/team/${teamId}/question/${questionId}/answers-list`,
      filters,
      { params }
    );

    return {
      ...res.data,
      data: answerListTransformer(res.data.data),
    };
  },

  getYears: async (teamId, questionId) => {
    const res = await axios.get(
      `/team/${teamId}/question/${questionId}/all-years`
    );
    return answerHistoryYearsTransformer(res.data.data);
  },

  getHistory: async (teamId, questionId) => {
    const res = await axios.get(
      `/team/${teamId}/question/${questionId}/version-history`
    );

    return answerHistoryTransformer(res.data.data[0] || []);
  },

  reaction: async (teamId, answerId, data) => {
    const res = await axios.post(
      `/team/${teamId}/answer/${answerId}/reaction`,
      data
    );
    return res.data;
  },
  reactionRemove: async (teamId, answerId) => {
    const res = await axios.patch(
      `/team/${teamId}/answer/${answerId}/remove-reaction`
    );
    return res.data;
  },

  update: async (teamId, answerId, data) => {
    const res = await axios.patch(`/team/${teamId}/answer/${answerId}`, data);
    return res.data;
  },

  updateView: async (teamId, answerId) => {
    const res = axios.post(`/team/${teamId}/answer/${answerId}/view`);
    return res.data;
  },

  getAllAnswers: async (teamId, questionIds) => {
    const res = await axios.post(`/team/${teamId}/all-answers-list`, {
      questions: questionIds,
    });
    return res.data.data;
  },

  batchAdd: async (teamId, data) => {
    const res = await axios.post(`/team/${teamId}/answers/batch`, data);
    return res.data;
  },
  fileUpload: async (formData) => {
    const res = await axios.post("/file-upload", formData);
    return res.data;
  },
  grantAccess: async (data, type) => {
    const res = await axios.post(`/public-access`, {
      fileData: data,
      type: type,
    });
    return res.data;
  },
};

export default answerService;

const defaultAnswerFilters = {
  confidence: [],
  differentiation: [],
  risk: [],
  authors: [],
  labels: [],
  dateRange: {
    startDate: "",
    endDate: "",
  },
  answers: {
    likes: 0,
    dislikes: 0,
    flags: 0,
  },
  includeLinks: false,
  flaggedDateRange: {
    flaggedStartDate: "",
    flaggedEndDate: "",
  },
};
