import { useMutation, useQueryClient } from 'react-query';
import favouriteService from '@services/favourite.service';
import { useTeam } from '@contexts/TeamContext';
import Bus from "@utils/Bus";

export default function useFavouriteQuestionMutation(question, filters, refetchData,refetchFavourites) {
  const queryClient = useQueryClient();
  const { team } = useTeam();

  const mutation = useMutation(
    ({ teamId, questionId, favorite }) => favouriteService.toggle({ teamId, questionId, favorite }),
    {
      onMutate: async (newFavourite) => {
        queryClient.setQueryData(['favourite-infinite', { teamId: team?.id }], old => {
          if(old) {
            if(newFavourite.favorite) {
              old.pages[old.pages.length - 1].data.push({ ...question, isFavorite: true });
              old.pages[0].count++;
              return old
            }

            return { 
              ...old, 
              pages: old.pages.map(page => ({ 
                ...page,
                count: page.count - 1,
                data: page.data.filter(fav => fav.questionId !== question.questionId) 
              }))
            }
          }
          return old
        })

        queryClient.setQueryData(['questionnaire-infinite', { teamId: team?.id, filters }], old => {
          if (old) {
            return {
              ...old,
              pages: old.pages.map(page => ({ 
                ...page, 
                data: page.data.map(_q => (_q.id === newFavourite.questionId) ? ({ ..._q, isFavorite: newFavourite.favorite}) : _q )
              }))
            }
          }
          return old
        })

        queryClient.setQueryData(['question', { teamId: team?.id, questionId: newFavourite.questionId }], old => {
          if(old) {
            return {
              ...old,
              data: {
                ...old.data,
                isFavorite: newFavourite.favorite
              }
            }
          }
          return old
        })
        

      },

      onError: (err, newTodo, context) => {
        queryClient.setQueryData(['favourite', { teamId: team?.id }], []);
        Bus.emit("error", { operation: "open",errorCode:err.code});
      },

      onSettled: async() => {
        refetchFavourites &&  await refetchFavourites();
        refetchData &&  await refetchData();
        // queryClient.invalidateQueries(['favourite', { teamId: team?.id }])
      }
    }
  );

  return mutation
}