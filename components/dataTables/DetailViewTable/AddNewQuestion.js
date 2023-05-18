import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import AddQuestionPopup from "../AddQuestionPopup";
import { Rules as PriorityRiskRules } from "@ui-library/Priority";
import questionService from "@services/question.service";
import questionTransformer from "@transformers/question.transformer";
import { useAuthUser } from "@contexts/AuthContext";
import { useFavourites } from "@contexts/FavouritesContext";
import Bus from "@utils/Bus";

export default function AddNewQuestion({ refetchFavourites, refetchData }) {
  const { team, setTeam } = useTeam();
  const { showFavourites } = useFavourites();
  // const { inSelectMode } = useAppContext();
  const queryClient = useQueryClient();
  const {
    auth: { user },
  } = useAuthUser();

  const mutation = useMutation(
    ({ teamId, data }) => questionService.create(teamId, data),
    {
      onSuccess: (res) => {
        const newQuestion = {
          ...questionTransformer(res.data[0]),
          author: {
            id: user.id,
            name: user.firstName.concat(" ", user.lastName),
            picture: user.avtarUrl,
          },
          createdAt: new Date().toString(),
        };

        setTeam((old) => ({
          ...old,
          questionsCount: old.questionsCount + 1,
        }));
        //commenting caching
        // queryClient.setQueryData(
        //   ["questionnaire-infinite", { teamId: team?.id }],
        //   (old) => {
        //     // console.log(old);
        //     let copy = { ...old };
        //     copy.pages[copy.pages.length - 1].data.push(newQuestion);
        //     return copy;
        //   }
        // );
        showFavourites && refetchFavourites && refetchFavourites();
        refetchData && refetchData();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  return (
    <>
      {/* {!inSelectMode && ( */}
      <AddQuestionPopup
        handleSubmit={(val) => {
          mutation.mutate({
            teamId: team.id,
            data: {
              questions: [
                {
                  questionText: val.question,
                  frequency: val.frequency,
                  importance: Number(val.importance),
                  priority:
                    PriorityRiskRules.Q[val.frequency][val.importance].label,
                  isFavorite: showFavourites ? true : false,
                },
              ],
            },
          });
        }}
      />
      {/* )} */}
    </>
  );
}
