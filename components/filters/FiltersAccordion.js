import React from "react";
import { Accordion as BSAccordion, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import Frequency from "./subFilters/Frequency";
import Importance from "./subFilters/Importance";
import Priority from "./subFilters/Priority";
import Confidence from "./subFilters/Confidence";
import Risk from "./subFilters/Risk";
import Authors from "./subFilters/Authors";
import Labels from "./subFilters/Labels";
import DateRange from "./subFilters/DateRange";
import NumberOfAnswers from "./subFilters/NumberOfAnswers";
import OtherFilters from "./subFilters/OtherFilters";
import Differentiation from "./subFilters/Differentiation";
import EmojiFilters from "./subFilters/EmojiFilters";

export default function FiltersAccordion({
  hideQuestionFilters = false,
  hideAnswerFilters = false,
  isFlashcardPages,
}) {
  return (
    <Accordion
      defaultActiveKey={
        hideQuestionFilters ? "1" : hideAnswerFilters ? "0" : null
      }
    >
      {!hideQuestionFilters && (
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <Title>Questions</Title>
          </Accordion.Header>
          <Accordion.Body>
            <Container fluid>
              <Row xs={1} md={1}>
                <Col>
                  <Frequency />
                </Col>
                <Col>
                  <Importance type="questions" />
                </Col>
                <Col>
                  <Priority />
                </Col>
                <Col>
                  <Authors type="questions" />
                </Col>
                <Col>
                  <Labels type="questions" />
                </Col>
                <Col>
                  <DateRange type="questions" />
                </Col>
                <Col>
                  <NumberOfAnswers />
                </Col>
              </Row>
            </Container>
          </Accordion.Body>
        </Accordion.Item>
      )}

      {!hideAnswerFilters && (
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <Title>Answers</Title>
          </Accordion.Header>
          <Accordion.Body>
            <Confidence />
            <Differentiation />
            <Risk />
            <Authors type="answers" />
            <Labels type="answers" />
            <DateRange type="answers" />
            {!isFlashcardPages && <OtherFilters />}
          </Accordion.Body>
        </Accordion.Item>
      )}
      {isFlashcardPages && (
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <Title>Reactions</Title>
          </Accordion.Header>
          <Accordion.Body>
            <EmojiFilters />
          </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
  );
}

const Title = styled.h2`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  color: #1f5462;
`;

const Accordion = styled(BSAccordion)`
  &&& {
    margin-bottom: 1rem;

    .accordion-item {
      border: none;
    }

    .accordion-header {
      border: 1px solid #969c9d;
    }

    .accordion-body {
      padding: 1rem;
    }

    .accordion-button {
      &:not(.collapsed) {
        background: white;
      }
      &:focus {
        box-shadow: none;
      }
    }
  }
`;
