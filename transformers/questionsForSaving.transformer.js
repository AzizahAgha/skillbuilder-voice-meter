import { Rules as PriorityRiskRules } from "@ui-library/Priority";

const transformQuestionsForSaving = (questions) => ({
  questions: questions.map((val, idx) => {
    if (val?.questionId) {
      return {
        questionId: val?.questionId,
        questionText: val.question,
        frequency: val.frequency,
        importance: Number(val.importance),
        priority: PriorityRiskRules.Q[val.frequency][val.importance].label,
      };
    } else {
      return {
        questionText: val.question,
        frequency: val.frequency,
        importance: Number(val.importance),
        priority: PriorityRiskRules.Q[val.frequency][val.importance].label,
      };
    }
  }),
});

export default transformQuestionsForSaving;
