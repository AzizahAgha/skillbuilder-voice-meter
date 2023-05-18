import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import left from "@public/svgs/left.svg";
import right from "@public/svgs/right.svg";
import Image from "next/image";
import Button from "@ui-library/Button";
import { FieldArray, useFormikContext } from "formik";
import { Persist } from "formik-persist";
import Answer from "@components/mobile/Answer";
import TableFooter from "@components/dataTables/AnswersTable/TableFooter";
import LoginInWarning from "@ui-library/LoginInWarning";
import { useAuthUser } from "@contexts/AuthContext";
import { useMutation } from "react-query";
import teamService from "@services/team.service";
import Bus from "@utils/Bus";

export default function AnswersWrapper() {
  const { values: { questions } = { questions: [] } } = useFormikContext();
  const [index, setIndex] = useState(questions.length > 0 ? 1 : 0);
  const { auth } = useAuthUser();
  const [warningVisible, setWarningVisible] = useState(questions.length >= 20);

  useEffect(() => {
    if (!auth.isAuthenticated && questions.length >= 20) {
      setWarningVisible(true);
    }
  }, [auth, questions.length]);

  const onAdd = useCallback((values, arrayHelpers) => {
    const item = {
      ...values,
      confidence: 1,
      differentiation: 1,
    };
    arrayHelpers.push(item);
  }, []);

  const teamMutation = useMutation((teamData) => teamService.create(teamData), {
    onSuccess: (data) => {
      setTeam(data);
    },
    onError:(error) => {
      Bus.emit("error", { operation: "open",error:error.response});
    }
  });

  const onLoginSuccess = () => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");
    teamMutation.mutate({ teamName, displayName });
  };

  return (
    <>
      <FieldArray name="questions">
        {(arrayHelpers) => (
          <div className="d-flex flex-column mb-4 mt-4">
            <Wrapper>
              <span>
                Your Questions (click cell to edit, add with “+” at bottom)
              </span>
            </Wrapper>

            <Answer
              key={String(index)}
              index={index}
              question={questions[index]?.question}
            />

            <div className="d-flex justify-content-between align-items-center">
              <Img
                src={left}
                alt="previous-question"
                onClick={() => {
                  if (index - 1 >= 0) setIndex(index - 1);
                }}
              />
              <Label>
                {index + 1} / {questions.length} Questions
              </Label>
              <Img
                src={right}
                alt="next-question"
                onClick={() => {
                  if (index + 1 < questions.length) setIndex(index + 1);
                }}
              />
            </div>

            {(auth.isAuthenticated || questions.length < 20) && (
              <TableFooter
                customButton={AddQuestionButton}
                onAdd={(val) => onAdd(val, arrayHelpers)}
              />
            )}

            {!auth.isAuthenticated && warningVisible && (
              <div
                style={{ position: "absolute", top: "1020px", left: "-5px" }}
              >
                <LoginInWarning
                  dismissWarning={() => {
                    setWarningVisible(false);
                  }}
                  onLoginSuccess={onLoginSuccess}
                />
              </div>
            )}
          </div>
        )}
      </FieldArray>
      <Persist name="questions" />
    </>
  );
}

const AddQuestionButton = () => (
  <SaveButton type="button">+ Add Questions</SaveButton>
);

const Wrapper = styled.span`
  display: flex;
  flex-direction: column;
  color: #1f5462;
  font-size: 20px;
  font-family: Barlow Condensed, sans-serif;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 24px;

  small {
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-size: 14px;
    color: #393d3e;
    font-weight: 400;
    opacity: 0.5;
  }
`;

const SaveButton = styled(Button)`
  margin-bottom: 0;
  width: 100%;
`;

const Label = styled.span`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  text-align: end;
  color: #393d3e;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Img = styled(Image)`
  cursor: pointer;
`;
