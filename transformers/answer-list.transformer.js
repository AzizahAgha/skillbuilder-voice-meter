import answerTransformer from './answer.transformer';

export default function answerListTransformer(data) {
  return data.map(answerTransformer)
}
