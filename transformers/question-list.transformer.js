import questionTransformer from './question.transformer';

export default function questionListTransformer(data) {
  return data.map(questionTransformer)
}
