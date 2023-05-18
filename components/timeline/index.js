import React from "react";
import { useTeam } from "@contexts/TeamContext";
import { useQuery } from "react-query";
import styled from "styled-components";
import MainAccordion from "./MainAccordion";
import answerService from "@services/answer.service";
import moment from "moment";

export default function Timeline({ question, answers }) {
  const { team } = useTeam();

  const { data: years } = useQuery(
    ["answer-history-years", { teamId: team?.id, questionId: question?.id }],
    () => answerService.getYears(team.id, question.id),
    { enabled: team?.id ? true : false }
  );

  return (
    <TimelineWrapper>
      <TimelineHeader>
        <h1>Version History</h1>
        <div className="version-count">
          {years?.reduce((sum, year) => year.updateCount + sum, 0)} Versions
        </div>
      </TimelineHeader>

      <TimelineBody>
        {years && (
          <MainAccordion years={years} question={question} answers={answers} />
        )}

        <CreatedDate>
          <b>Question Created</b> <br />
          <span>
            {moment(new Date(question.createdAt)).format("MMM DD, YYYY")}
          </span>
        </CreatedDate>
      </TimelineBody>
    </TimelineWrapper>
  );
}

const TimelineWrapper = styled.div`
  height: 100%;
  overflow: auto;
  padding: 5px;
  max-height: 1800px;
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-bottom: 0.2rem;

  h1 {
    font-family: Barlow Condensed;
    font-weight: 500;
    font-size: 30px;
    line-height: 36px;
    color: #003647;
  }

  .version-count {
    font-family: Manrope;
    font-size: 12px;
    text-align: right;
    color: #393d3e;
  }
`;

const TimelineBody = styled.div`
  border: 1px solid #81c2c0;
  border-radius: 0.25rem;
  min-height: calc(100% - 60px);
`;

const CreatedDate = styled.div`
  font-family: Manrope;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;
  color: #969c9d;
  margin-top: 2rem;
  margin-bottom: 4rem;

  b {
    font-weight: 700;
  }

  span {
    font-weight: 400;
  }
`;
