import flashcardTransformer from "./flashcard.transformer";

export default function flashcardListTransformer(data) {
  return data.map(flashcardTransformer);
}
