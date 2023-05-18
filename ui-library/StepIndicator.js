import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display:flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 38px;
`;

const Connector = styled.div`
  height: 0;
  flex: 1;
  border: 1px solid #D2D2D2;
`;

const Step = styled.div`
  width: 51px;
  height: 51px;
  border-radius: 51px;
  background: ${props => props.active ? "#81C2C0" : "#C4C4C4"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Manrope,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: #FFFFFF;
`;

const StepIndicator = ({numOfSteps = 3, progress = 1}) => (
  <Container>
    {[...Array(numOfSteps).keys()].map(step => <React.Fragment key={step}>
        <Step active={step < progress}>{`${step + 1}`.padStart(2, '0')}</Step>
        {step < numOfSteps - 1 && <Connector />}
      </React.Fragment>
    )}
  </Container>
);

export default StepIndicator;

