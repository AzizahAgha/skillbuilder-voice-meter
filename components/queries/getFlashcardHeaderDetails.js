import { useQuery } from "react-query";
import flashcardService from "@services/flashcard.service";

export const GetFlashcardHeaderDetails = ({ teamId }) => {
  return useQuery(
    ["flashcardHeader", { teamId: teamId }],
    () => flashcardService.getDetails({ teamId: teamId }),
    {
      enabled: teamId ? true : false,
    }
  );
};
