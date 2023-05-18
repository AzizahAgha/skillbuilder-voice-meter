import React, { useCallback, useMemo, useState } from 'react';
import Expandable from "@ui-library/Expandable";
import { getConfidenceLabel, getDifferentiationLabel } from "@utils/helpers";
import AnswerComponent from "@ui-library/AnswerComponent";
import { Factor } from '@ui-library/mobile/Factor';
import { Divider } from '@ui-library/mobile/Divider';
import { SrNo } from '@ui-library/mobile/SrNo';
import { HeaderText } from '@ui-library/mobile/HeaderText';
import { Container } from '@ui-library/mobile/Container';
import { Text } from '@ui-library/mobile/Text';

const CardsAnswer = ({ lastItem, answer, question, filters, searchKeyword, updateData }) => {

  const { number, questionText } = answer

  const [expanded, setExpanded] = useState(false)

  const memoSearchKeyword = useMemo(() => searchKeyword, [searchKeyword])

  const header = useMemo(() =>
    <div className="d-flex flex-row align-items-center overflow-hidden flex-grow-1">
      <SrNo className="me-3">{`${number}`.padStart(2, "0")}</SrNo>
      <HeaderText className="me-3">{expanded ? "" : questionText}</HeaderText>
      <div className="flex-grow-1" />
    </div>, [expanded, number, questionText])

  return (
    <div>
      <div className="pt-2 pb-1 px-2">
        <Expandable header={header} onChange={setExpanded}>
          <Container>
            <div className="px-2 py-4 align-self-stretch">
              <AnswerComponent
                showFactors={false}
                showNavigator={false}
                showAddButton={false}
                answer={answer}
                question={question}
                searchKeyword={memoSearchKeyword}
                enableActions
              />
            </div>
            <Divider negative={true} />
            <Factor label="Confidence" info={'confidence'} rightView={() =>
              <Text>
                {!answer.confidence
                  ? '- - -'
                  : <>{`${answer.confidence}/5`} {getConfidenceLabel(answer.confidence)}</>
                }
              </Text>
            } />
            <Divider negative={true} />
            <Factor label="Differentiation" info={'differentiation'} rightView={() =>
              <Text>
                {!answer.differentiation ? '- - -' : <>{`${answer.differentiation}/5`} {getDifferentiationLabel(answer.differentiation)}</>}
              </Text>
            } />
          </Container>
        </Expandable>
      </div>
      <Divider lastItem={lastItem} />
    </div>
  );
};

export default CardsAnswer;
