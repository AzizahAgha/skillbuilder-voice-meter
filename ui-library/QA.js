import React from 'react';
import Priority, { BadgeType } from "./Priority";
import styled from 'styled-components';
import AnswerViewer from "@ui-library/AnswerViewer";
import Expandable from "@ui-library/Expandable";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Text = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #393D3E;
  margin-top: 10px;
  word-wrap: anywhere;
`;

const SrNo = styled.span`
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 26px;
  color: #393D3E;
`

const Label = styled.span`
  font-family: 'Barlow Condensed', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #1F5462;
`

const QA = ({ srNo, frequency, importance, question, differentiation, confidence, answer }) => (
  <div className="w-100">
    <Expandable header={<div className="d-flex flex-row align-items-center w-100">
      <SrNo className="me-2">{srNo}</SrNo>
      <Priority type={BadgeType.Question} frequency={frequency} importance={importance} filled={true} showShowFullLabel={true} />
    </div>}>
      <Container>
        <Text>{question}</Text>

        <Label className="mt-4 mb-3">And Answers</Label>
        {answer && <Priority type={BadgeType.Answer} differentiation={differentiation} confidence={confidence} filled={true} showShowFullLabel={true} />}

        <Text>
          <AnswerViewer content={answer} />
        </Text>
      </Container>
    </Expandable>
  </div>
);

export default QA;
