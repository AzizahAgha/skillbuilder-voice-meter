import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import InfoPopup from "@ui-library/InfoPopup";
import { getInfoText } from "@utils/helpers";
import left from "@public/svgs/left.svg";
import right from "@public/svgs/right.svg";
import Image from "next/image";
import Button from "@ui-library/Button";
import { FieldArray, useFormikContext } from "formik";
import { Persist } from "formik-persist";
import Question from "@components/mobile/Question";
import LoginInWarning from "@ui-library/LoginInWarning";
import { useAuthUser } from "@contexts/AuthContext";
import { useMutation } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import teamService from "@services/team.service";
import Bus from "@utils/Bus";

export default function QuestionsWrapper() {
  const { values: { questions } = { questions: [] } } = useFormikContext();
  const [warningVisible, setWarningVisible] = useState(questions.length >= 20);
  const [index, setIndex] = useState(questions.length > 0 ? 1 : 0);
  const { auth } = useAuthUser();
  const { setTeam } = useTeam();

  useEffect(() => {
    if (!auth.isAuthenticated && questions.length >= 20) {
      setWarningVisible(true);
    }
  }, [auth, questions.length]);

  const onAdd = useCallback((arrayHelpers) => {
    const item = {
      question: "",
      frequency: "Sometimes",
      importance: 1,
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

  const onLoginSuccess = useCallback(() => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");
    teamMutation.mutate({ teamName, displayName });
  }, [teamMutation]);

  return (
    <>
      <FieldArray name="questions">
        {(arrayHelpers) => (
          <div className="d-flex flex-column mb-4 mt-4">
            <Wrapper>
              <span>
                START HERE: Your Questions{" "}
                <InfoPopup title="Questions" text={getInfoText("question")} />
              </span>
              <small>
                Click on a cell to and start typing your
                <br />
                question, we&apos;ll save automatically.
              </small>
            </Wrapper>

            <Question index={index} />

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
              <SaveButton type="button" onClick={() => onAdd(arrayHelpers)}>
                + Add Questions
              </SaveButton>
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
      <Persist name="questionnaire" />
    </>
  );
}

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
  align-self: stretch;
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
