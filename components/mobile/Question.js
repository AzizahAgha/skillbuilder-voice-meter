import React from 'react';
import TextArea from "../dataTables/QuestionnaireTable/TextArea";
import styled from "styled-components";
import Text from "@ui-library/Text";
import FrequencyDropdown from "@components/dataTables/QuestionnaireTable/FrequencyDropdown";
import ImportanceSlider from "@components/dataTables/QuestionnaireTable/ImportanceSlider";
import PriorityBadge from "@components/dataTables/QuestionnaireTable/PriorityBadge";
import { getInfoText } from "@utils/helpers";
import InfoPopup from "@ui-library/InfoPopup";

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

export default function Question({ index, isExample = false }) {
  return (
    <Container isExample={isExample}>
      <TextArea row={{ index }} />
      <Divider />
      <Row>
        <Label>Frequency <InfoPopup title='Frequency' text={getInfoText('frequency')} /></Label>
        <FrequencyDropdown row={{ index }} />
      </Row>
      <Divider />
      <Row>
        <Label>Importance <InfoPopup title='Importance' text={getInfoText('importance')} /></Label>
        <ImportanceSlider row={{ index }} />
      </Row>
      <Divider />
      <Row>
        <Label>Priority <InfoPopup title='Priority' text={getInfoText('priority')} /></Label>
        <PriorityBadge row={{ index }} />
      </Row>
    </Container>
  );
}
