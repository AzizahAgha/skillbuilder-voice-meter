import React from "react";
import { Container, Row, Col as BsCol } from "react-bootstrap";
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

export default function FilterOptions({
  hideQuestionFilters = false,
  hideAnswerFilters = false,
  isFlashcardPages,
}) {
  return (
    <Container fluid>
      <Row xs={1} md={hideQuestionFilters || hideAnswerFilters ? 1 : 2}>
        {!hideQuestionFilters && (
          <>
            {/* FILTERS FOR QUESTIONS */}
            <Col order={0}>
              <Title>Questions</Title>
            </Col>
            <Col order={2}>
              <Frequency />
            </Col>
            <Col order={4}>
              <Importance type="questions" />
            </Col>
            <Col order={6}>
              <Priority />
            </Col>
            {!isFlashcardPages && (
              <Col order={8}>
                <Authors type="questions" />
              </Col>
            )}
            <Col order={10}>
              <Labels type="questions" />
            </Col>
            <Col order={12}>
              <DateRange type="questions" />
            </Col>
            <Col order={14}>
              <NumberOfAnswers />
            </Col>
          </>
        )}

        {!hideAnswerFilters && (
          <>
            {/* FILTERS FOR ANSWERS */}
            <Col order={1}>
              <Title>{!hideQuestionFilters && "Answers"}</Title>
            </Col>
            <Col order={3}>
              <Confidence />
            </Col>
            <Col order={5}>
              <Differentiation />
            </Col>
            <Col order={7}>
              <Risk />
            </Col>
            {!isFlashcardPages && (
              <Col order={9}>
                <Authors type="answers" />
              </Col>
            )}
            <Col order={11}>
              <Labels type="answers" />
            </Col>
            <Col order={13}>
              <DateRange type="answers" />
            </Col>
            {!isFlashcardPages && (
              <Col order={15}>
                <OtherFilters />
              </Col>
            )}
          </>
        )}
      </Row>

      {isFlashcardPages && <EmojiFilters />}
      <br />
    </Container>
  );
}

const Title = styled.h2`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  color: #1f5462;
  margin-bottom: 1.5rem;
`;

const Col = styled(BsCol)`
  &&& {
    @media screen and (min-width: 768px) {
      order: ${(props) => props.order};
      ${(props) =>
        props.order % 2 === 0
          ? "border-right: 1px solid #C4C4C4;"
          : "padding-left: 1.5rem;"}
    }
  }
`;
