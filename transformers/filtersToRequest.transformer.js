export default function filtersToRequestBodyTransformer({
  filters,
  type = "detailView",
}) {
  let qAndAFilters = {
    questionFilters: {
      frequency: filters.frequency.map(
        (a) => a.charAt(0).toUpperCase() + a.substr(1)
      ),
      importance: filters.importance,
      priority: filters.priority.map(
        (a) => a.charAt(0).toUpperCase() + a.substr(1)
      ),
      authors: filters.questionsByAuthors,
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
      answersAuthors: filters.answersByAuthors,
      answersLabels: filters.answersByLabels,
      answerDateRange: {
        answerStartDate: filters.answersByDateRange.start,
        answerEndDate: filters.answersByDateRange.end,
      },
      answers: {
        likes: filters.agreedCount,
        dislikes: filters.disagreedCount,
        flags: filters.flaggedCount,
      },
      includeLinks: filters.includeLinks,
      flaggedDateRange: {
        flaggedStartDate: filters?.flaggedDateRange?.start ?? "",
        flaggedEndDate: filters?.flaggedDateRange?.end ?? "",
      },
    },
  };
  if (type === "detailView") {
    return {
      ...qAndAFilters,
    };
  } else if (type === "flashcardEdit") {
    return {
      ...qAndAFilters,
      authorsFilters: filters.authors ? filters.authors : [],
    };
  }
}
