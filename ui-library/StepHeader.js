import React from 'react';
import styled from 'styled-components';
import StepIndicator from "./StepIndicator";
import ProgressIndicator from "./ProgressIndicator";
import { useMediaQuery } from "react-responsive";
import Button from "./Button";
import { useAuthUser } from '@contexts/AuthContext';

const Steps = styled.div`
  font-family: Manrope,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: #003647;
`;

const Title = styled.div`
  font-family: "Barlow Condensed",sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
  margin-bottom: 5px;
  color: #81C2C0;
  
  @media (max-width: 1224px) {
    text-align: center;
    font-size: 30px;
    line-height: 36px;
    margin-bottom: 21px;
  }
`;

const Description = styled.span`
  font-family: Manrope,sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  color: #393D3E;
  
  & span {
    font-family: Manrope,sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #393D3E;
  }
  
  @media (max-width: 1224px) {
    text-align: center;
  }
`;

const RightColumn = styled.div`
  flex-direction: column;
  align-items: end;
  margin-left: 98px;
  
  @media (max-width: 1224px) {
    margin-left: 0;
    margin-top: 34px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  
  @media (max-width: 1224px) {
    align-items: center;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 34px;
  
  @media (max-width: 1224px) {
    flex-direction: column;
  }
`;

const SaveButton = styled(Button)`
  align-self: end;
  margin-bottom: 43px;
`;

export default function StepHeader({ step, title, children, onSavePress, numOfQuestions, currentQuestions, showProgress = true }) {
  const { auth } = useAuthUser();
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  return <React.Fragment>
    <div className='d-block d-lg-none'>
      <StepIndicator numOfSteps={3} progress={step} />
    </div>

    <Row>
      <Column>
        <Steps>{`Step ${step} of 3`}</Steps>
        <Title>{title}</Title>
        <Description>
          {children}
        </Description>
      </Column>
      <RightColumn>
        {auth.isAuthenticated &&
          <SaveButton
            className='d-none d-lg-block'
            type='button'
            onClick={onSavePress}
            disabled={currentQuestions <= 0}
          >
            Save & Continue
          </SaveButton>}
        {showProgress && <ProgressIndicator numOfSteps={numOfQuestions} progress={currentQuestions} />}
      </RightColumn>
    </Row>

  </React.Fragment>
};
