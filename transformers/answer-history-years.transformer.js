
export default function answerHistoryYearsTransformer(data) {
  return data?.map(year => ({
    year: year.year,
    updateCount: year.totalUpdated,
  }))
};
