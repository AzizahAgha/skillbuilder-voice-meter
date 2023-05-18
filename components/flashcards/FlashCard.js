import React, { useState } from "react";
import styled from "styled-components";
import { Col, Row, Button as BsButton } from "react-bootstrap";
import Emojis from "./Emojis";
import Tooltip from "@ui-library/Tooltip";
import { Image } from "react-bootstrap";
import { useRouter } from "next/router";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import moment from "moment";
import favStar from "@public/svgs/favStar.svg";
import { useAuthUser } from "@contexts/AuthContext";
import DropDownComponent from "./DropDownComponent";
import Toast from "react-bootstrap/Toast";

const FlashCard = ({ data, refetchFlashcard }) => {
  const [show, setShow] = useState(false);
  const { user } = useAuthUser();
  const router = useRouter();
  const truncate = (str, limit) => {
    const actualChar = str?.length + str.split(" ").length - 1;
    return actualChar > limit ? `${str?.substring(0, limit - 3)}...` : str;
  };
  return (
    <>
      <OverlayTrigger
        placement="bottom"
        trigger={["hover", "hover"]}
        overlay={
          <StyledOverlay>
            <Wrapper>
              <Row>
                <Text>
                  <b>Created On:</b>{" "}
                  {moment(data?.createdAt).format("MM-DD-YYYY")}
                </Text>
              </Row>

              <Row>
                <Text>
                  <b>Last Edited:</b>
                  {moment(data?.updatedAt).format("MM-DD-YYYY")}
                </Text>
              </Row>

              <Row>
                <Text>
                  <b>Description:</b>
                  {data?.setDescription}
                </Text>
              </Row>
            </Wrapper>
          </StyledOverlay>
        }
      >
        <Container>
          <Row>
            <StyledCol>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    paddingRight: "5px",
                    paddingTop: "5px",
                  }}
                >
                  {data?.isFavorite && (
                    <Image src={favStar.src} alt="fav question" />
                  )}
                </div>
                {data?.isFavorite && data?.setTitle.includes("Favorites") ? (
                  <Header>
                    {truncate(
                      String(`${data?.setTitle}-${data?.createdBy}`),
                      24
                    )}
                  </Header>
                ) : (
                  <Header>{truncate(String(data?.setTitle), 25)}</Header>
                )}
              </div>

              <div className="mb-1">
                <Label>Created By:</Label>
                <Value>{data?.createdBy}</Value>
              </div>
              <div className="mb-1" style={{ minHeight: "20px" }}>
                <Description>
                  {truncate(String(data?.setDescription), 50)}
                </Description>
              </div>
            </StyledCol>
            <Col>
              <DropDownComponent
                data={data}
                user={user}
                refetchFlashcard={refetchFlashcard}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InfoHeading>Questions:</InfoHeading>
              <Numbers className="mx-2">{data?.questionCount}</Numbers>
            </Col>
            <Col>
              <InfoHeading>Answers:</InfoHeading>
              <Numbers className="mx-2">{data?.answerCount}</Numbers>
            </Col>
          </Row>
          <Row>
            {(data?.lastPlayedViewed == null &&
              data?.lastPlayedViewedDate == null) ||
            (data?.lastPlayedViewed?.length == 0 &&
              data?.lastPlayedViewedDate?.length == 0) ? (
              <LastViewed>No views yet</LastViewed>
            ) : (
              <LastViewed>
                Last viewed by {data?.lastPlayedViewed} on{" "}
                {moment(data?.lastPlayedViewedDate).format("MMM D,YYYY")}
              </LastViewed>
            )}
          </Row>
          <Row>
            <Col>
              <PlayButton
                onClick={() => {
                  if (
                    data?.flashId &&
                    data?.flashId !== 0 &&
                    data?.flashId !== ""
                  ) {
                    router.push(`/flashcards/${data?.flashId}/play`);
                  } else {
                    router.push(
                      `/flashcards/${data?.flashId}/play?c=${data?.createdById}`
                    );
                  }
                }}
                disabled={data?.questionCount < 1 ? true : false}
              >
                Play
              </PlayButton>
            </Col>
            <StyledColEmoji>
              <Emojis data={data} refetchFlashcard={refetchFlashcard} />
            </StyledColEmoji>
          </Row>
          <Row>
            <Col>
              <StyledToast
                onClose={() => setShow(false)}
                show={show}
                delay={3000}
                autohide
              >
                <Toast.Body>Copied to Clipboard!</Toast.Body>
              </StyledToast>
              <StyledDiv>
                <StyledUrl>{data?.faqUrl}</StyledUrl>
                <StyledCopyButton
                  onClick={() => {
                    navigator.clipboard.writeText(data?.faqUrl);
                    setShow(true);
                  }}
                >
                  Copy
                </StyledCopyButton>
              </StyledDiv>
            </Col>
          </Row>
        </Container>
      </OverlayTrigger>
    </>
  );
};

export default FlashCard;

const StyledUrl = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledCopyButton = styled.button`
  background-color: Transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  font-family: "Manrope";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
  min-width: 50px;
`;

const StyledDiv = styled.div`
  background: #f5f5f5;
  border-radius: 5px;
  min-height: 30px;
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  cursor: auto;
`;

const Header = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.02em;
  color: #003647;
  margin-bottom: 4px;
  display: flex;
  flex-wrap: wrap;
`;

const StyledCol = styled(Col)`
  flex-basis: 70% !important;
`;
const StyledColEmoji = styled(Col)`
  flex-basis: 60% !important;
`;

const Container = styled.div`
  background: #ffffff;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  cursor: pointer;
  padding: 20px;
  &:hover {
    border-color: #81c2c0;
  }
  width: 100%;
`;

const Label = styled.span`
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
`;

const Value = styled.span`
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
  margin-left: 4px;
`;

const Description = styled.span`
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
`;

const InfoHeading = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 36px;
  letter-spacing: 0.02em;
  color: #003647;
  margin-bottom: 4px;
`;

const Numbers = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;

  font-size: 20px;
  line-height: 36px;
  letter-spacing: 0.02em;
`;

const Button = styled(BsButton)`
  &&& {
    display: flex;
    background-color: transparent;
    border: none;

    &:disabled {
      opacity: 0.4;
    }
  }
`;
const Overlay = styled(Popover)`
  display: flex;
  flex-direction: row;
  align-items: "flex-start";
  padding: 10px;
  background: #ffffff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  border: 1px solid transparent;

  & .popover-arrow {
    display: none;
  }
`;

const Text = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: regular;
  font-size: 12px;
  line-height: 14px;
  color: #969c9d;
`;

const Wrapper = styled.span`
  margin-left: 6px;
`;

const StyledOverlay = styled(Overlay)`
  inset: 0px auto auto -10% !important;
`;

const PlayButton = styled(BsButton)`
  &&& {
    background: #81c2c0;
    border: 1px solid #81c2c0;
    border-radius: 5px;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #ffffff;
    float: left;
    width: 60px;
    padding: 3px;
    &:hover,
    &:active,
    &:focus {
      background: #8ed0ce;
      border-color: #8ed0ce;
      outline: none;
      box-shadow: none;
    }
  }
`;

const LastViewed = styled.span`
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 26px;
  color: #969c9d;
  margin-left: 2px;
  margin-bottom: 10px;
`;

const StyledToast = styled(Toast)`
  &&& {
    display: inline-flex;
    z-index: 5100;
    position: absolute;
    opacity: 1;
    background-color: transparent;
    padding-top: 35px;
    padding-right: 35px;
    justify-content: flex-end;
    box-shadow: none;
    border: none;
  }
  .toast-body {
    background-color: #8ed0ce;
    align-self: flex-end;
    color: #ffffff;
    padding: 0.2rem;
  }
`;
