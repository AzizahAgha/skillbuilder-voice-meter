import React from "react";
import styled from "styled-components";
import {
  ToggleButtonGroup as BsToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { useQuery } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import relatedQuestionsService from "@services/relatedQuestions.service";

const Styles = styled.div`
  label {
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    /* identical to box height */

    color: #393d3e;
  }
  
  overflow-y: auto;
  width: 100%;
  height: 52px;
`;

export default function Filter({ value, onChange }) {
  const { team } = useTeam();

  const { data: options } = useQuery(
    ["related-question-labels", { teamId: team?.id }],
    () => relatedQuestionsService.getLabels({ teamId: team?.id }),
    {
      enabled: !!team,
    }
  );

  return (
    <Styles>
      <ToggleButtonGroup
        type="radio"
        name="related-question-filters"
        defaultValue={""}
        value={value}
        onChange={onChange}
      >
        <ToggleButton
          id="all_questions"
          variant="outline-secondary"
          value=""
          active={value === ""}
        >
          All Questions
        </ToggleButton>
        <ToggleButton
          id="SA"
          variant="outline-secondary"
          value="SA"
          active={value === "SA"}
        >
          Same Author
        </ToggleButton>
        {options?.data?.map((option, idx) => (
          <ToggleButton
            key={idx}
            id={option}
            variant="outline-secondary"
            value={option}
            active={value === option}
          >
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Styles>
  );
}

const ToggleButtonGroup = styled(BsToggleButtonGroup)`
  &&& {
    .btn-outline-secondary {
      background: #fff;
      border-radius: 50px !important;
      text-align: center;
      color: #1f5462;
      border: none;
      white-space: nowrap;

      font-family: Barlow Condensed;
      font-style: normal;
      font-size: 20px;
      font-weight: 300;
      line-height: 36px;
      padding: 0rem 1.2rem;
      margin-right: 0.2rem;

      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
      vertical-align: bottom;

      &.active,
      &:hover {
        color: #fff;
        background: #81c2c0;
        box-shadow: none;
        outline: none;
      }
    }
  }
`;
