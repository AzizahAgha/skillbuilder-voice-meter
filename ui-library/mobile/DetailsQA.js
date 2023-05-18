
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import Expandable from "@ui-library/Expandable";
import { BsStar, BsStarFill } from "react-icons/bs";
import useFavouriteQuestionMutation from "@hooks/useFavouriteQuestionMutation";
import { useAppContext } from "@contexts/AppContext";
import { useTeam } from "@contexts/TeamContext";
import QuestionComponent from "@ui-library/QuestionComponent";
import questionFiltersToAnswerFiltersTransformer from "@transformers/questionFiltersToAnswerFilters.transformer";
import Answers from "@components/dataTables/DetailViewTable/Answers";
import {
  getConfidenceLabel,
  getDifferentiationLabel,
  getImportanceLabel,
} from "@utils/helpers";
import Dropdown, { Options } from "@ui-library/Dropdown";
import { SrNo } from "@ui-library/mobile/SrNo";
import { HeaderText } from "@ui-library/mobile/HeaderText";
import { Container } from "@ui-library/mobile/Container";
import { Text } from "@ui-library/mobile/Text";
import { Divider } from "@ui-library/mobile/Divider";
import { Factor } from "@ui-library/mobile/Factor";
import SerialNumber from "@ui-library/SerialNumber";
const DetailsQA = ({
  index,
  question,
  filters,
  searchKeyword,
  updateData,
  lastItem,
  isDetailView,
}) => {
  const { number, questionText } = question;

  const [expanded, setExpanded] = useState(false);
  const { team } = useTeam();

  const memoSearchKeyword = useMemo(() => searchKeyword, [searchKeyword]);
  const mutation = useFavouriteQuestionMutation(question, filters);

  const toggleFavourite = useCallback(
    (e) => {
      e.stopPropagation();
      mutation.mutate({
        teamId: team.id,
        questionId: question.id,
        favorite: !question.isFavorite,
      });
    },
    [mutation, question.id, question.isFavorite, team?.id]
  );

  const header = useMemo(
    () => (
      <div className="d-flex flex-row align-items-center flex-grow-1">
        <SrNo className="me-3">{`${number}`.padStart(2, "0")}</SrNo>
        <HeaderText className="me-3">{expanded ? "" : questionText}</HeaderText>
        <div className="flex-grow-1" />
        <SerialNumber
            value={index+1}
            showOptions={true}
            question={question}
            filters={filters}
            hideSrNo={true}
            view="row"
            mergeId={question.mergeId}
        />
      </div>
    ),
    [
      number,
      expanded,
      questionText,
      question.isFavorite,
      toggleFavourite,
      mutation.isLoading,
    ]
  );

  return (
    <div>
      <div className="pt-2 pb-1 px-2">
        <Expandable header={header} onChange={setExpanded} question={question}>
          <Container>
            <div className="px-2 py-4" style={{width: "100%"}}>
              <QuestionComponent
                id={question.id}
                labels={question.labels}
                frequency={question.frequency}
                importance={question.importance}
                author={question.author}
                createdAt={question.createdAt}
                value={question.questionText}
                clickable={true}
                showFactors={false}
                searchKeyword={searchKeyword}
                filters={filters}
              />
            </div>
            <Divider negative={true} />
            <Factor
              label="Frequency"
              info={"frequency"}
              rightView={() => (
                <Dropdown
                  placeholder="Select One"
                  name="frequency"
                  value={question.frequency}
                  disabled={true}
                  options={Options.Frequency}
                />
              )}
            />
            <Divider negative={true} />
            <Factor
              label="Importance"
              info={"importance"}
              rightView={() => (
                <Text>
                  {`${question.importance}/5`}{" "}
                  {getImportanceLabel(question.importance)}
                </Text>
              )}
            />
            <Divider negative={true} />
            <div className="px-2 py-4 align-self-stretch">
              <Answers
                index={index}
                question={question}
                updateData={updateData}
                isDetailView={true}
                searchKeyword={memoSearchKeyword}
                filters={questionFiltersToAnswerFiltersTransformer(filters)}
              />
            </div>
            <Divider negative={true} />
            <Factor
              label="Confidence"
              info={"confidence"}
              rightView={() => (
                <Text>
                  {!question.confidence ? (
                    "- - -"
                  ) : (
                    <>
                      {`${question.confidence}/5`}{" "}
                      {getConfidenceLabel(question.confidence)}
                    </>
                  )}
                </Text>
              )}
            />
            <Divider negative={true} />
            <Factor
              label="Differentiation"
              info={"differentiation"}
              rightView={() => (
                <Text>
                  {!question.differentiation ? (
                    "- - -"
                  ) : (
                    <>
                      {`${question.differentiation}/5`}{" "}
                      {getDifferentiationLabel(question.differentiation)}
                    </>
                  )}
                </Text>
              )}
            />
          </Container>
        </Expandable>
      </div>
      <Divider lastItem={lastItem} />
    </div>
  );
};

export const Label = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: #393d3e;
`;


export default DetailsQA;
