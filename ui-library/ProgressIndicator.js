import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";

const Container = styled.div`
  @media (max-width: 1224px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const Wrapper = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
`;

const Label = styled.p`
  font-family: Manrope,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: end;
  color: #393D3E;
  margin-bottom: 6px;
  
  @media (max-width: 1224px) {
    text-align: center;
  }
`;

const Step = styled.div`
  width: ${props => (160 - props.numOfSteps) / props.numOfSteps}px;
  height: 4px;
  display: inline-block;
  background: #81C2C0;
  opacity: ${props => props.completed ? 1 : 0.4};
  margin-left: 1px;
`;

function ProgressIndicator({numOfSteps, progress}) {
  return (
    <Container>
      <Label>{progress} / {numOfSteps} Questions</Label>
      <Wrapper>
        {[...Array(numOfSteps).keys()].map(step =>
        <Step key={step} numOfSteps={numOfSteps} completed={step < progress} />
        )}</Wrapper>
    </Container>
  );
}

ProgressIndicator.propTypes = {
  numOfSteps: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
};

export default ProgressIndicator;
