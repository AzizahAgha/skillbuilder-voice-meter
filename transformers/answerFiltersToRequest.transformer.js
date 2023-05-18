export default function answerFiltersTransformer(filters) {
  return ({
    confidence: filters.confidence,
    differentiation: filters.differentiation,
    risk: filters.risk.map(a => a.charAt(0).toUpperCase() + a.substr(1)),
    authors: filters.answersByAuthors,
    labels: filters.answersByLabels,
    dateRange: {
      startDate: filters.answersByDateRange.start,
      endDate: filters.answersByDateRange.end
    },
    answers: {
      likes: filters.agreedCount,
      dislikes: filters.disagreedCount,
      flags: filters.flaggedCount
    },
    includeLinks: filters.includeLinks,
    flaggedDateRange: {
      flaggedStartDate: filters?.flaggedDateRange?.start ?? "",
      flaggedEndDate: filters?.flaggedDateRange?.end ?? ""
    }
  })
}
