import { useQuery } from "react-query";
import flashcardService from "@services/flashcard.service";

export const GetAllFlashcards = ({
  teamId,
  filters,
  sortOn,
  sortBy,
  searchString,
  editFlashcardPage,
}) => {
  return useQuery(
    [
      "flashcards",
      { teamId: teamId, filters: filters, sortOn, sortBy, searchString },
    ],
    () =>
      flashcardService.getAll({
        teamId: teamId,
        filters: filters,
        sortOn,
        sortBy,
        searchString,
        isActingSuperAdmin: localStorage.getItem('isSuperAdminView') === 'true' ? true:false,
      }),
    {
      enabled: teamId && !editFlashcardPage ? true : false,
    }
  );
};
