import React from 'react';
import styled from "styled-components";
import Text from "@ui-library/Text";
import { getInfoText } from "@utils/helpers";
import InfoPopup from "@ui-library/InfoPopup";
import Question from "@components/dataTables/AnswersTable/Question";
import DifferentiationSlider from "@components/dataTables/AnswersTable/DifferentiationSlider";
import ConfidenceSlider from "@components/dataTables/AnswersTable/ConfidenceSlider";
import AnswerEditor from "@components/dataTables/AnswersTable/AnswerEditor";
import RiskBadge from '@components/dataTables/AnswersTable/RiskBadge';

const Container = styled.div`
  background: #FFFFFF;
  border: 1px solid #969C9D;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  & textarea {
    color: ${props => props.isExample ? '#AEAEAE' : 'black'};
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 12px 8px;
  justify-content: space-between;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  height: 0;
  border-top: 1px solid #969C9D;
`;

const Label = styled(Text)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #393D3E;
`

export default function Answer({ index, question, isExample = false }) {
  return (
    <Container isExample={isExample}>
      <Question row={{ index }} value={question} />
      <Divider />
      <Column>
        <Label className="p-2">Give Your Best Answer</Label>
        <AnswerEditor row={{ index }} />
      </Column>
      <Divider />
      <Row>
        <Label>Confidence <InfoPopup title='Confidence' text={getInfoText('confidence')} /></Label>
        <ConfidenceSlider row={{ index }} />
      </Row>
      <Divider />
      <Row>
        <Label>Differentiation <InfoPopup title='Differentiation' text={getInfoText('differentiation')} /></Label>
        <DifferentiationSlider row={{ index }} />
      </Row>
      <Divider />
      <Row>
        <Label>Risk <InfoPopup title='Risk' text={getInfoText("risk")} /></Label>
        <RiskBadge row={{ index }} />
      </Row>
    </Container>
  );
}
