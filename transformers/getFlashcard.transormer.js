export default function getFlashcardTransformer(flashcard) {
    return {
      ...flashcard,
      id: flashcard.flashcardSetId,
      isFavorite:
      typeof flashcard.isFavorite === "boolean"
        ? flashcard.isFavorite
        : flashcard.isFavorite === "true",
      setTitle: flashcard.setTitle,
      setDescription: flashcard.setDescription ?? "",
      questions: flashcard.questions ?? []
    };
  }