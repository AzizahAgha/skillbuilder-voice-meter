import React from "react";
import { Modal as BSModal, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import Button from "@ui-library/Button";
import thumbsUpIcon from "@public/svgs/thumbs-up.svg";
import { useRouter } from "next/router";
import Tooltip from "ui-library/Tooltip";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";

export default function MergeSuccessPopup({
  requestedName,
  adminName,
  showMergeSuccessPopup,
  setShowMergeSuccessPopup,
  type,
  mergeType,
  refetchActivitesNotifications,
  questionId,
  mergeCount,
  setShowActivityPopup,
  setShowQMergePopup,
}) {
  const router = useRouter();
  return (
    <Modal
      className="bs"
      show={showMergeSuccessPopup}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container fluid>
        <Row>
          <Col>
            <Card>
              {type === "Approve" && (
                <Tooltip text="Close" placement="left">
                  <CloseButton
                    type="button"
                    onClick={() => {
                      refetchActivitesNotifications &&
                        refetchActivitesNotifications();

                      setShowMergeSuccessPopup(false);
                    }}
                  >
                    <CloseIcon size={30} color="#969C9D" />
                  </CloseButton>
                </Tooltip>
              )}

              <ImageContainer>
                <Image
                  src={thumbsUpIcon.src}
                  alt="agree"
                  width="50px"
                  height="50px"
                />
              </ImageContainer>
              {type === "Approve" && (
                <>
                  {mergeType === "Answer" && (
                    <>
                      <Header>Answer Merged</Header>
                      <StyledText>
                        {requestedName}'s request to merge{" "}
                        {" " + mergeCount + " "}
                        answers was complete
                      </StyledText>
                    </>
                  )}
                  {mergeType === "Question" && (
                    <>
                      <Header>Question Merged</Header>
                      <StyledText>
                        {requestedName}'s request to merge{" "}
                        {" " + mergeCount + " "}
                        questions was complete
                      </StyledText>
                    </>
                  )}

                  <ButtonContainer>
                    <Button
                      onClick={() => {
                        if (mergeType === "Answer") {
                          router.push(`/question/${questionId}?view=timeline`);
                          setShowMergeSuccessPopup(false);
                          setShowActivityPopup(false);
                          setShowQMergePopup(false);
                        } else if (mergeType === "Question") {
                          router.push("/detail");
                          setShowMergeSuccessPopup(false);
                          setShowActivityPopup(false);
                          setShowQMergePopup(false);
                        }
                      }}
                    >
                      Thanks
                    </Button>
                  </ButtonContainer>
                </>
              )}
              {type === "Request" && (
                <>
                  <Header>Merge Request Sent</Header>
                  <StyledText>
                    Your request to merge{" "}
                    {mergeType === "Answer" ? "answers" : "questions"} has been
                    sent to {adminName}
                  </StyledText>
                  <ButtonContainer>
                    <Button
                      onClick={() => {
                        if (mergeType === "Answer") {
                          router.push(`/question/${questionId}?view=timeline`);
                          setShowMergeSuccessPopup(false);
                        } else if (mergeType === "Question") {
                          router.push("/detail");
                          setShowMergeSuccessPopup(false);
                        }
                      }}
                    >
                      Thanks
                    </Button>
                  </ButtonContainer>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const Modal = styled(BSModal)`
  &&& {
    background: #fffffff0;
    z-index: 2000;
    .modal-content {
      background: none;
      border: none;
      display: flex;
      justify-content: center;
    }

    a[href="__INVITE_LINK__"] {
      pointer-events: none;
    }
  }
`;

const Header = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 36px;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
  color: #003647;

  h1 {
    font-weight: 600;
    font-size: 28px;
  }

  h2 {
    margin-bottom: 0;
  }

  p {
    font-family: Manrope;
    font-weight: 400;
    font-size: 1rem;
  }
`;

const Card = styled.div`
  max-width: 700px;
  min-height: 356px;
  margin: auto;
  background: #ffffff;
  border: 1px solid #81c2c0;
  box-sizing: border-box;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1.2rem;
  overflow: auto;
  position: relative;
  max-height: fit-content;
`;

const StyledText = styled.div`
  &&& {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 10px;
    margin-top: 10px;
    text-align: center;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 4px;
  top: 6px;
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;
