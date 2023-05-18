import React from "react";
import styled from "styled-components";
import { AiOutlineCloseCircle as CloseIcon } from "react-icons/ai";

function FLashcardQuestionCard({ handleIconDelete, question }) {
  return (
    <QuestionCard>
      <div>Question {question?.number}</div>

      <StyledColorIcon
        color="#969C9D"
        size={20}
        onClick={() => handleIconDelete(question)}
      />
    </QuestionCard>
  );
}

export default FLashcardQuestionCard;

const StyledColorIcon = styled(CloseIcon)`
  cursor: pointer;
`;

const QuestionCard = styled.div`
  background: #ffffff;
  border: 1px solid #969c9d;
  border-radius: 55px;
  width: 130px;
  padding: 0.25rem 0.75rem 0.25rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;
`;
