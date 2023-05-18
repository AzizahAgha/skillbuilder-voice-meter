import React from "react";
import Button from "@ui-library/Button";
import styled from "styled-components";
import { useRouter } from "next/router";

const CreateFlashCard = () => {
  const router = useRouter();
  return (
    <Container>
      <Submit>
        <SaveButton onClick={() => router.push(`/flashcards/${0}`)}>
          + Create New Set
        </SaveButton>
      </Submit>
    </Container>
  );
};

export default CreateFlashCard;

const SaveButton = styled(Button)`
  &&& {
    margin-bottom: 25px;
    margin-top: 25px;
    float: right;
    &:active {
      opacity: 0.5;
    }
    }
  }
`;
const Submit = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  background: #ffffff;
  border: 2px solid transparent;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  cursor: pointer;
  padding: 20px;
  &:hover {
    border-color: #81c2c0;
  }
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
`;
