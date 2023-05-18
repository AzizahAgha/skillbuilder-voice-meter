import moment from "moment";

export default function teamStatsTransformer(stats) {
  return {
    dateRange: {
      start: moment(stats.startDate).format("MM/DD/YY"),
      end: moment(stats.endDate).format("MM/DD/YY"),
    },
    data: [
      {
        label: "Questions",
        count: stats.questionCount,
        note:
          stats.thisWeekAnswerCount > 0
            ? `${stats.yesterdayAddedQuestions} Added Yesterday`
            : "",
      },
      {
        label: "Author",
        count: stats.authorCount,
      },
      {
        label: "Answers",
        count: stats.answerCount,
        note:
          stats.thisWeekAnswerCount > 0
            ? `(${stats.thisWeekAnswerCount} added this week)`
            : "",
      },
      {
        label: "Likes",
        count: stats.likes,
      },
      {
        label: "Dislikes",
        count: stats.dislikes,
      },
      {
        label: "Flags",
        count: stats.flags,
      },
    ],
  };
}
