import { Rules as PriorityRiskRules } from '@ui-library/Priority';

const transformAnswerForSaving = (data) =>{
  // console.log("data",data);
  return (
  {
  answerText: data.answer,
  confidence: data.confidence,
  differentiation: data.differentiation,
  risk: PriorityRiskRules.A[data.differentiation][data.confidence].label,
  attachment:data.attachment
});
}
export default transformAnswerForSaving;
