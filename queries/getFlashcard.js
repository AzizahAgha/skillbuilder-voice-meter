import { useQuery } from "react-query";
import flashcardService from "@services/flashcard.service";

export const getFlashcard = (teamId, flashcardSetId) => {
  return useQuery(
    ["flashcard", { teamId, flashcardSetId }],
    () =>
      flashcardService.get({
        teamId: teamId,
        flashcardSetId: flashcardSetId,
      }),
    {
      enabled: !!teamId && flashcardSetId !== "0",
    }
  );
};
