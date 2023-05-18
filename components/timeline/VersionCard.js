import React, { useState } from "react";
import moment from "moment";
import styled from "styled-components";
import { Card as BsCard, Button as BsButton } from "react-bootstrap";
import StarOutline from "@public/icons/star-outline";
import { BsHandThumbsUp as ThumbsUp } from "react-icons/bs";
import { useTeam } from "@contexts/TeamContext";
import MergedHistoryPopup from "@components/questionMerge/MergedHistoryPopup";

export default function VersionCard({
  isCurrentVersion = false,
  id,
  author,
  isMostPopular,
  isMostUpvoted,
  createdAt,
  upvotes,
  isMerged,
  mergeId,
}) {
  const [showMergedHistoryPopup, setShowMergedHistoryPopup] = useState(false);
  const { team } = useTeam();
  return (
    <Card $isCurrent={isCurrentVersion}>
      {" "}
      {/* Transient props: https://styled-components.com/docs/api#transient-props */}
      <Card.Body>
        <Card.Title>
          <div className="date fs-6">
            {moment(new Date(createdAt)).format("MMMM DD, hh:MM A")}
          </div>

          <div>
            {isMostPopular && (
              <Badge>
                <StarOutline />
                Most Popular
              </Badge>
            )}

            {isMostUpvoted && upvotes > 0 && (
              <Badge>
                <ThumbsUp />
                Most Upvoted
              </Badge>
            )}
          </div>
        </Card.Title>

        {isCurrentVersion && <Card.Subtitle>Current Version</Card.Subtitle>}
        {isMerged && (
          <>
            <Card.Subtitle>Answers Merged</Card.Subtitle>{" "}
            <MergedHistoryPopup
              show={showMergedHistoryPopup}
              setShow={setShowMergedHistoryPopup}
              teamId={team?.id}
              mergeId={mergeId}
              mergeType="Answer"
            />
          </>
        )}
        <Author>
          {author?.picture && <Profile src={author.picture} />}
          <strong>{author?.name}</strong>
          {isMerged && (
            <span className="mx-4">
              <StyledButton onClick={() => setShowMergedHistoryPopup(true)}>
                Details
              </StyledButton>
            </span>
          )}
        </Author>
      </Card.Body>
    </Card>
  );
}

const Card = styled(BsCard)`
  &&& {
    border: none;
    border-radius: 0;
    background: ${(props) =>
      props.$isCurrent ? "rgba(224, 244, 244, 0.5);" : "#FFF"};
    margin-left: ${(props) => (props.$isCurrent ? "0" : "1.5rem")};

    &:not(:last-child) {
      border-bottom: 0.5px solid #393d3e;
    }

    .card-title {
      font-family: Manrope;
      font-size: 16px;
      font-weight: 700;
      color: ${(props) => (props.$isCurrent ? "#1F5462" : "#393D3E")};

      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-subtitle {
      font-family: Manrope;
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 1rem;
      color: #1f5462;
    }

    .card-body {
      padding: 0.8rem;
      padding-left: ${(props) => (props.$isCurrent ? "1.5rem" : "0")};
    }
  }
`;

const Badge = styled.div`
  background: rgba(224, 244, 244, 0.5);
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  white-space: nowrap;

  border-radius: 50px;
  color: #003647;
  padding: 0.2rem 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Author = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  font-weight: bold;
  color: #1f5462;
  font-family: Manrope;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
`;

const Profile = styled.img`
  width: 30px !important;
  height: 30px !important;
  border: 1px solid #00364744 !important;
  border-radius: 30px;
  margin-right: 0.5rem;
`;

const StyledButton = styled(BsButton)`
  &&& {
    background: #ffffff;
    border: 1px solid #969c9d;
    border-radius: 5px;
    color: ${(props) => (props.text ? props.text : "#969c9d")};
    width: 60px;
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    background: ${(props) => (props.color ? props.color : "")};
    align-self: flex-end;
  }
`;
