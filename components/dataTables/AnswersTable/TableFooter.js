import React from "react";
import AddQuestionPopup from "../AddQuestionPopup";
import { useAuthUser } from "@contexts/AuthContext";
import { useMutation } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import { Rules as PriorityRiskRules } from "@ui-library/Priority";
import questionService from "@services/question.service";
import Bus from "@utils/Bus";

export default function TableFooter({ onAdd, customButton }) {
  const { auth } = useAuthUser();
  const { team } = useTeam();

  const mutation = useMutation(
    ({ teamId, data }) => questionService.create(teamId, data),
    {
      onSuccess: (res) => {
        onAdd({
          ...res.data[0],
          question: res.data[0].questionText,
          confidence: 1,
          differentiation: 1,
        });
      },
      onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
    }
  );

  return (
    <div>
      <AddQuestionPopup
        CustomButton={customButton}
        handleSubmit={(val) => {
          if (auth.isAuthenticated && team?.id) {
            // console.log({
            //   teamId: team.id,
            //   data: {
            //     questions: [{
            //       questionText: val.question,
            //       frequency: val.frequency,
            //       importance: Number(val.importance),
            //       priority: PriorityRiskRules.Q[val.frequency][val.importance].label,
            //     }]
            //   }
            // })
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
                  },
                ],
              },
            });
          } else {
            onAdd(val);
          }
        }}
      />
    </div>
  );
}
