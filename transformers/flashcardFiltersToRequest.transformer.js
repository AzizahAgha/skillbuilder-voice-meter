export default function flashcardFiltersToRequestTransformer(filters) {
  return {
    questionFilters: {
      frequency: filters.frequency.map(
        (a) => a.charAt(0).toUpperCase() + a.substr(1)
      ),
      importance: filters.importance,
      priority: filters.priority.map(
        (a) => a.charAt(0).toUpperCase() + a.substr(1)
      ),
      questionLabels: filters.questionsByLabels,
      questionDateRange: {
        questionStartDate: filters.questionsByDateRange.start,
        questionEndDate: filters.questionsByDateRange.end,
      },
      answerCount: {
        minAnswer: filters.noOfAnswers.min,
        maxAnswer: filters.noOfAnswers.max,
      },
    },
    answerFilters: {
      confidence: filters.confidence,
      differentiation: filters.differentiation,
      risk: filters.risk.map((a) => a.charAt(0).toUpperCase() + a.substr(1)),
      answersLabels: filters.answersByLabels,
      answerDateRange: {
        answerStartDate: filters.answersByDateRange.start,
        answerEndDate: filters.answersByDateRange.end,
      },

      includeLinks: filters.includeLinks,
      flaggedDateRange: {
        flaggedStartDate: filters?.flaggedDateRange?.start ?? "",
        flaggedEndDate: filters?.flaggedDateRange?.end ?? "",
      },
    },
    authors: filters.authors ? filters.authors : [],
    reactions: {
      likes: filters.likes,
      dislikes: filters.dislikes,
      flags: filters.flags,
    },
  };
}
