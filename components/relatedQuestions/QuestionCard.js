import React from "react";
import Priority from "@ui-library/Priority";
import { Card, Image } from "react-bootstrap";
import { getImportanceLabel } from "@utils/helpers";
import styled from "styled-components";
import Link from "next/link";

const StyledCard = styled.div`
  .card {
    background: #ffffff;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    margin: 0 12px;

    .card-header,
    .card-footer {
      background: transparent;
      border: 0;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-text {
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-height: 100%;
    }

    a {
      text-decoration: none;
    }
  }
`;

const Tag = styled.div`
  margin-left: 20px;
  color: #1f5462;
  font-size: 0.9rem;

  & span {
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;

    & strong {
      font-weight: bold;
    }
  }
`;

const Author = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & span {
    margin-left: 6px;
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-size: 12px;
    line-height: 16px;
    color: #1f5462;

    & strong {
      font-weight: bold;
    }
  }
`;

const AnswersCount = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  @media only screen and (max-width: 490px) {
    font-size: 16px;
  }
  line-height: 24px;
  color: #003647;
`;

const QuestionCard = ({ question }) => {
  return (
    <StyledCard>
      <Card>
        <Link href={`/question/${question?.id}`} passHref>
          <a>
            <Card.Header>
              <div className="d-flex align-items-center">
                <Priority
                  type="Q"
                  frequency={question?.frequency}
                  importance={question?.importance}
                  filled={true}
                  showShowFullLabel={true}
                  linebreak={false}
                />

                <Tag>
                  <strong>Frequency: </strong> {question?.frequency}
                </Tag>
                <Tag>
                  <strong>Importance:</strong>{" "}
                  {getImportanceLabel(question?.importance).split(" ")[0]}
                </Tag>
              </div>
            </Card.Header>
            <Card.Body style={{ height: "10rem" }}>
              <Card.Text>{question?.text}</Card.Text>
            </Card.Body>
          </a>
        </Link>
        <Card.Footer style={{ height: "3rem" }} className="mb-1">
          <Author>
            {question?.author?.picture && (
              <Image
                roundedCircle="true"
                style={{ height: "30px", width: "30px" }}
                variant="buttom"
                src={question?.author?.picture}
                alt={`profile picture of ${question?.author?.name}`}
              />
            )}
            <span>
              <strong>{question?.author?.name}</strong> | &nbsp;
              {question?.createdAt
                ? new Date(question?.createdAt).toString().slice(4, 10)
                : ""}
            </span>
          </Author>

          <AnswersCount>Answer: {question?.answerCount}</AnswersCount>
        </Card.Footer>
      </Card>
    </StyledCard>
  );
};

export default QuestionCard;
