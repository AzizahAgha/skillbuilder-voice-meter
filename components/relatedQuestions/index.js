import React, { useState } from "react";
import { useTeam } from "@contexts/TeamContext";
import { useQuery, useMutation, useQueryClient } from "react-query";
import relatedQuestionsService from "@services/relatedQuestions.service";
import { Container, Row, Col, Button } from "react-bootstrap";
import Filters from "./Filters";
import Questions from "./Questions";
import InfoPopup from "@ui-library/InfoPopup";
import styled from "styled-components";
import Link from "next/link";
import AddQuestionPopup from "@components/dataTables/AddQuestionPopup";
import { Rules as PriorityRiskRules } from "@ui-library/Priority";
import questionService from "@services/question.service";
import Select from "@ui-library/Select";

const Styles = styled.div`
  margin-top: 80px;
`;

const Title = styled.h2`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
  /* identical to box height */
  color: #003647;
`;

export default function RelatedQuestions({ questionId }) {
  const { team, refetchTeam } = useTeam();
  const [type, setType] = useState("");
  const queryClient = useQueryClient();

  const query = useQuery(
    ["related-question", { teamId: team?.id, questionId, type }],
    () =>
      relatedQuestionsService.getAll({
        teamId: team?.id,
        questionId,
        params: { type },
      }),
    {
      enabled: !!team,
    }
  );

  const mutation = useMutation(
    ({ teamId, data }) => questionService.create(teamId, data),
    {
      onSettled: () => {
        queryClient.invalidateQueries([
          "related-question",
          { teamId: team?.id, questionId, type },
        ]);
        refetchTeam();
      },
    }
  );

  return (
    <Styles>
      <Container fluid className="p-0">
        <Row>
          <Col lg={3}>
            <Title>
              Related Questions{" "}
              <InfoPopup
                title="Related Questions"
                text="Questions that relate by author, label, or content."
              />
            </Title>
          </Col>
          <Col lg={6} className="d-none d-lg-none d-xl-block">
            <Filters value={type} onChange={setType} />
          </Col>
          <Col lg={6} className="my-2 d-block d-lg-block d-xl-none">
            <Select value={type} onChange={(e) => setType(e?.target?.value)}>
              <option key={"All"} value={""}>
                All Questions
              </option>
              <option key={"SA"} value={"SA"}>
                Same Author
              </option>
            </Select>
          </Col>
          <Col
            lg={3}
            className="d-none d-lg-none d-xl-flex flex-row align-items-center justify-content-between"
          >
            <Link href="/detail" passHref>
              <ViewAllQuestionsLink>View All Questions</ViewAllQuestionsLink>
            </Link>
            <AddQuestionPopup
              handleSubmit={(val) => {
                mutation.mutate({
                  teamId: team.id,
                  data: {
                    questions: [
                      {
                        questionText: val.question,
                        frequency: val.frequency,
                        importance: Number(val.importance),
                        priority:
                          PriorityRiskRules.Q[val.frequency][val.importance]
                            .label,
                      },
                    ],
                  },
                });
              }}
              CustomButton={AddQuestionButton}
            />
          </Col>
        </Row>
        <Row>
          <Questions data={query?.data?.data} />
        </Row>

        <div className="d-flex d-lg-flex d-xl-none flex-row align-items-center justify-content-end mb-3">
          <div className="me-3">
            <Link href="/detail" passHref>
              <ViewAllQuestionsLink>View All Questions</ViewAllQuestionsLink>
            </Link>
          </div>
          <AddQuestionPopup
            handleSubmit={(val) => {
              mutation.mutate({
                teamId: team.id,
                data: {
                  questions: [
                    {
                      questionText: val.question,
                      frequency: val.frequency,
                      importance: Number(val.importance),
                      priority:
                        PriorityRiskRules.Q[val.frequency][val.importance]
                          .label,
                    },
                  ],
                },
              });
            }}
            CustomButton={AddQuestionButton}
          />
        </div>
      </Container>
    </Styles>
  );
}

const AddQuestionButton = () => (
  <Button variant="secondary" style={{ color: "white" }}>
    + Add Question
  </Button>
);

const ViewAllQuestionsLink = styled.a`
  &&& {
    white-space: nowrap;
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: #81c2c0;
    text-decoration: none;
  }
`;
