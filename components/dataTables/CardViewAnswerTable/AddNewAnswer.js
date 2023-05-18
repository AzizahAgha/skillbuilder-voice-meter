import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useTeam } from '@contexts/TeamContext';
import AddAnswerPopup from '../AddAnswerPopup';
import { IoAddCircleSharp } from 'react-icons/io5';
import Tooltip from 'ui-library/Tooltip';
import transformAnswerForSaving from "@transformers/answerForSaving.transformer";
import answerService from '@services/answer.service';
import Bus from "@utils/Bus";

export default function AddNewAnswer({ question }) {
  const { team, setTeam } = useTeam();
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (data) => answerService.create(team.id, question.id, data),
    {onSuccess: () => {
      queryClient.refetchQueries(['all-answers', { teamId: team?.id, questionId: question.id  }]);
      setTeam(old => ({
        ...old,
        answersCount: old.answersCount + 1
      }));
    },
    onError:(error) => {
      Bus.emit("error", { operation: "open",error:error.response});
    }}
  );

  return (
    <AddAnswerPopup
      question={question}
      handleSubmit={(values) => {
        mutation.mutate(transformAnswerForSaving(values))
      }}
      CustomButton={CustomButton}
      showAllAnswersPreviewOption={false}
    />
  );
}

const CustomButton = () => (
  <Tooltip text='Add Answer'>
    <button type='button' className="btn p-0" id='btn-new-add-question'>
      <IoAddCircleSharp color='#81C2C0' size={34} />
    </button>
  </Tooltip>
)
