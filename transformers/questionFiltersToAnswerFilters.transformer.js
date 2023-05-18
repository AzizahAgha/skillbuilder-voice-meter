import { defaultQuestionFilters } from '@services/question.service'

export default function questionFiltersToAnswerFiltersTransformer(
  filters = defaultQuestionFilters
) {
  const { answerFilters } = filters

  return {
    ...answerFilters,
    authors: answerFilters.answersAuthors,
    labels: answerFilters.answersLabels,
    dateRange: {
      startDate: answerFilters.answerDateRange.answerStartDate,
      endDate: answerFilters.answerDateRange.answerEndDate
    }
  }
}
