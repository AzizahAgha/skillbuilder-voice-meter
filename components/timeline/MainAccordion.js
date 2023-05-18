import React, { useEffect } from "react";
import styled from "styled-components";
import { Accordion as BsAccordion, Spinner } from "react-bootstrap";
import SubAccordion from "./SubAccordion";
import { useTeam } from "@contexts/TeamContext";
import { useQuery } from "react-query";
import answerService from "@services/answer.service";

export default function MainAccordion({ years = [], question, answers }) {
  const { team } = useTeam();
  const { data, isLoading, isError, refetch } = useQuery(
    ["answer-history", { teamId: team?.id, questionId: question?.id }],
    () => answerService.getHistory(team.id, question.id)
  );

  useEffect(() => {
    refetch();
  }, [answers]);

  return (
    <>
      {data && (
        <Accordion defaultActiveKey={Object.keys(years)} alwaysOpen>
          {years.map((history, idx) => (
            <AcordionItem
              history={history}
              idx={idx}
              key={idx}
              question={question}
              data={data[history?.year]}
              isLoading={isLoading}
              isError={isError}
            />
          ))}
        </Accordion>
      )}
    </>
  );
}

const AcordionItem = ({ history, idx, question, data, isLoading, isError }) => {
  return (
    <Accordion.Item eventKey={idx.toString()}>
      <Accordion.Header>
        <div className="header-content">
          <div className="title">{history.year}</div>
          <div className="info">{history.updateCount} updates</div>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        {isLoading && !isError && (
          <SpinnerWrapper>
            <Spinner animation="border" variant="primary" />
          </SpinnerWrapper>
        )}
        {data && <SubAccordion data={data} />}
      </Accordion.Body>
    </Accordion.Item>
  );
};

const Accordion = styled(BsAccordion)`
  &&& {
    .accordion-header > button {
      background: #003647;
      color: white;
      padding: 0.4rem 0.8rem;

      &::after {
        filter: brightness(730%) sepia(100%) hue-rotate(161deg) saturate(23%);
      }

      & > .header-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 1rem;

        & > .title {
          font-family: Barlow Condensed;
          font-weight: 500;
          font-size: 20px;
          line-height: 24px;
          color: #ffffff;
        }

        & > .info {
          font-family: Manrope;
          font-size: 12px;
          line-height: 16px;
          text-align: right;
          color: #ffffff;
          opacity: 0.5;
        }
      }
    }

    .accordion-body {
      padding: 0;
    }

    .accordion-item {
      border: none;
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1rem auto;
`;
