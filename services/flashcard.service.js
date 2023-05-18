import flashcardListTransformer from "@transformers/flashcard-list.transformer";
import { async } from "regenerator-runtime";
import axios from "./axiosInstance";

const flashcardService = {
  getAll: async ({
    teamId,
    filters = defaultFlashcardFilters,
    sortOn,
    sortBy,
    searchString,
    isActingSuperAdmin
  }) => {
    const res = await axios.post(
      `/team/${teamId}/flashcards?sortOn=${sortOn}&sortBy=${sortBy}&searchString=${searchString}&isActingSuperAdmin=${isActingSuperAdmin}`,
      filters
    );

    return { ...res.data, data: flashcardListTransformer(res.data.data) };
  },

  addReaction: async (teamId, flashId, data) => {
    const res = await axios.post(
      `/team/${teamId}/flashcard/${flashId}/reaction`,
      data
    );
    return res.data;
  },

  removeReaction: async (teamId, flashId) => {
    const res = await axios.patch(
      `/team/${teamId}/flashcard/${flashId}/remove-reaction`
    );
    return res.data;
  },

  create: async (teamId, data) => {
    const res = await axios.post(`/team/${teamId}/flashcard`, data);
    return res.data;
  },

  update: async (teamId, data) => {
    const res = await axios.put(`/team/${teamId}/flashcard`, data);
    return res.data;
  },

  get: async ({ teamId, flashcardSetId }) => {
    const res = await axios.get(
      `/team/${teamId}/flashcard/${flashcardSetId}/view`
    );
    return {
      ...res.data.data,
    };
  },

  playflashcard: async ({ teamId, flashcardSetId, userId }) => {
    if (userId === undefined || userId === "") {
      const res = await axios.get(
        `/team/${teamId}/flashcard/${flashcardSetId}/playmode`
      );
      return {
        ...res.data.data,
      };
    } else {
      const res = await axios.get(
        `/team/${teamId}/flashcard/${flashcardSetId}/playmode?userId=${userId}`
      );
      return {
        ...res.data.data,
      };
    }
  },

  addlogflashcard: async ({ teamId, flashcardSetId, data }) => {
    const res = await axios.post(
      `/team/${teamId}/flashcard/${flashcardSetId}/add-view`,
      data
    );
    return {
      ...res.data,
    };
  },

  getDetails: async ({ teamId }) => {
    const res = await axios.get(`/team/${teamId}/flashcard-details`);
    return res.data.data;
  },

  getAuthors: async ({ teamId }) => {
    const res = await axios.get(`/team/${teamId}/authors?type=flashcard`);
    return res.data;
  },

  getQuestionAuthors: async ({ teamId, flashId }) => {
    const res = await axios.get(`/team/${teamId}/flashcard/${flashId}/authors`);
    return res.data;
  },

  statusUpdate: async ({ teamId, flashcardSetId, data }) => {
    const res = await axios.patch(
      `/team/${teamId}/flashcard/${flashcardSetId}/status`,
      data
    );
    return res.data;
  },

  faqView: async ({ id }) => {
    const res = await axios.get(`/faq/${id}/faq-view`);
    return res.data.data;
  },

  faqAccess: async ({ teamId, flashId, privacy }) => {
    const res = await axios.patch(
      `team/${teamId}/flashcard/${flashId}/update-access`,
      { isFaqAccess: privacy }
    );
    return res.data;
  },
};

export default flashcardService;

export const defaultFlashcardFilters = {
  questionFilters: {
    frequency: [],
    importance: [],
    priority: [],
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
    answersLabels: [],
    answerDateRange: {
      answerStartDate: "",
      answerEndDate: "",
    },

    includeLinks: false,
    flaggedDateRange: {
      flaggedStartDate: "",
      flaggedEndDate: "",
    },
  },
  authors: [],
  reactions: {
    likes: 0,
    dislikes: 0,
    flags: 0,
  },
};
