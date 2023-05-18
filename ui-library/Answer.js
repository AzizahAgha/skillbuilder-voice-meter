import React, { useState } from "react";
import Priority, { BadgeType } from "./Priority";
import styled from "styled-components";
import AnswerViewer from "./AnswerViewer";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Answer = ({
  differentiation,
  confidence,
  answer,
  previewAnswer = false,
}) => {
  const [counter, setCounter] = useState(1);
  const onPrev = () => {
    setCounter((count) => (count - 1 > 0 ? count - 1 : count));
  };
  const onNext = () => {
    setCounter((count) => (count + 1 <= answer.length ? count + 1 : count));
  };
  return (
    <Container>
      {!previewAnswer ? (
        <>
          {!answer ||
          answer.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s/g, "") === "" ? (
            ""
          ) : (
            <Priority
              type={BadgeType.Answer}
              differentiation={differentiation}
              confidence={confidence}
              showShowFullLabel={true}
            />
          )}
          <Text>
            <AnswerViewer content={answer} />
          </Text>
        </>
      ) : (
        <>
          <GridContainer>
            <Priority
              type={BadgeType.Answer}
              differentiation={answer[counter - 1]?.differentiation}
              confidence={answer[counter - 1]?.confidence}
              showShowFullLabel={true}
            />

            <Counter>
              <MdKeyboardArrowLeft
                color="#393D3E88"
                size={16}
                role="button"
                onClick={onPrev}
              />
              <span>
                {" "}
                {counter} of {answer.length}{" "}
              </span>
              <MdKeyboardArrowRight
                color="#393D3E88"
                size={16}
                role="button"
                onClick={onNext}
              />
            </Counter>
          </GridContainer>

          <Text>
            <AnswerViewer content={answer[counter - 1]?.answerText} />
          </Text>
        </>
      )}
    </Container>
  );
};

export default Answer;

const GridContainer = styled.div`
  &&& {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
`;

const Counter = styled.span`
  font-family: Barlow Condensed, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  display: flex;
  flex-direction: row;
  color: #393d3e88;
  user-select: none;
  min-width: 60px;
  padding-right: 8px;
  margin-right: 20px;
  margin-bottom: 5px;
  span {
    white-space: nowrap;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const Text = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #393d3e;
  margin-top: 10px;
  word-wrap: anywhere;
`;
