import axios from "./axiosInstance";
import questionListTransformer from "@transformers/question-list.transformer";
import questionTransformer from "@transformers/question.transformer";
import { async } from "regenerator-runtime";

const questionService = {
  create: async (teamId, data) => {
    const res = await axios.post(`/team/${teamId}/questions`, data);
    return res.data;
  },

  update: async (teamId, data) => {
    const res = await axios.post(`/team/${teamId}/questions/batch`, data);
    return res.data;
  },

  getAll: async ({ teamId, filters = defaultQuestionFilters, params }) => {
    const pageParam = params?.page || 1;
    const res = await axios.post(`/team/${teamId}/questions-list`, filters, {
      params,
    });
    return {
      ...res.data,
      data: questionListTransformer(res.data.data),
      page: pageParam,
      hasNextPage: res.data.count >= pageParam * 10,
    };
  },

  getAllQuestions: async ({
    teamId,
    filters = defaultQuestionFilters,
    params,
    searchString = "",
  }) => {
    const res = await axios.post(
      `/team/${teamId}/questions-list?searchString=${searchString}`,
      filters,
      {
        params,
      }
    );
    return {
      ...res.data,
      data: questionListTransformer(res.data.data),
    };
  },

  get: async ({ teamId, questionId }) => {
    const res = await axios.get(`/team/${teamId}/question/${questionId}`);
    return {
      ...res.data,
      data: questionTransformer(res.data.data),
    };
  },

  batchUpdate: async (teamId, data) => {
    const res = await axios.post(`/team/${teamId}/questions/batch`, data);
    return res.data;
  },

  statusUpdate: async ({ teamId, questionId, status }) => {
    const res = await axios.patch(
      `/team/${teamId}/question/${questionId}/status`,
      { status }
    );
    return res.data;
  },

  mergeQuestions: async ({ teamId, questionId, data }) => {
    const res = await axios.post(
      `/team/${teamId}/question/${questionId}/merge-questions`,
      data
    );
    return res.data;
  },
  mergeQuestionApproval: async ({ teamId, mergeId, data }) => {
    const res = await axios.patch(
      `/team/${teamId}/merge/${mergeId}/status`,
      data
    );
    return res.data;
  },
  mergePreview: async ({ teamId, mergeId, params }) => {
    const res = await axios.get(`/team/${teamId}/merge/${mergeId}/view`, {
      params,
    });
    return res.data;
  },
};

export default questionService;

export const defaultQuestionFilters = {
  questionFilters: {
    frequency: [],
    importance: [],
    priority: [],
    authors: [],
    questionLabels: [],
    questionDateRange: {
      questionStartDate: "",
      questionEndDate: "",
    },
    answerCount: {
      minAnswer: "",
      maxAnswer: "",
    },
  },
  answerFilters: {
    confidence: [],
    differentiation: [],
    risk: [],
    answersAuthors: [],
    answersLabels: [],
    answerDateRange: {
      answerStartDate: "",
      answerEndDate: "",
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
  },
};
