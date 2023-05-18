import React from "react";
import Priority, { BadgeType } from "./Priority";
import styled from "styled-components";

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
  color: #393d3e;
  margin-top: 10px;
  word-wrap: anywhere;
`;

const Question = ({ frequency, importance, question }) => (
  <Container>
    <Priority
      type={BadgeType.Question}
      frequency={frequency}
      importance={importance}
      showShowFullLabel={true}
    />
    <Text>{question}</Text>
  </Container>
);

export default Question;
