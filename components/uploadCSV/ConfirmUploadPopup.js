import React from "react";
import {
  Modal as BSModal,
  Container,
  Row,
  Col,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import styled from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Tooltip from "ui-library/Tooltip";
import Button from "@ui-library/Button";

function ConfirmUploadPopup({
  showConfirmPopup,
  setShowConfirmPopup,
  questionCount,
  answerCount,
  uploadData,
}) {
  return (
    <Modal
      className="bs"
      show={showConfirmPopup}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Header>Confirm Upload</Header>
              <Tooltip text="Close" placement="left">
                <CloseButton
                  type="button"
                  onClick={() => setShowConfirmPopup(false)}
                >
                  <CloseIcon size={30} color="#969C9D" />
                </CloseButton>
              </Tooltip>
              <StyledText>
                You are about to upload: <br />{" "}
                <b>{`[${questionCount}] Questions + [${answerCount}] Answers`}</b>{" "}
                <br /> <br />
                Once you do this you will not be able to undo it and you will
                have to manually delete the questions and/or answers if you want
                to remove them.
                <br />
              </StyledText>
              <ButtonContainer>
                <StyledButton cancel onClick={() => setShowConfirmPopup(false)}>
                  Cancel
                </StyledButton>
                <StyledButton
                  onClick={() => {
                    uploadData();
                  }}
                >
                  Agree & Upload
                </StyledButton>
              </ButtonContainer>
            </Card>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

export default ConfirmUploadPopup;

const StyledButton = styled(Button)`
  &&& {
    background: ${(props) => (props.cancel ? "#FFFFFF" : "#81C2C0")};
    box-shadow: ${(props) =>
      props.cancel ? "0px 0px 5px rgba(0, 0, 0, 0.25)" : "none"};
    border-radius: 5px;
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => (props.cancel ? "#c10840" : "#FFFFFF")};
    border: ${(props) => (props.cancel ? "1px solid #C10840" : "")};
  }
`;

const ButtonContainer = styled.div`
  &&& {
    display: flex;
    justify-content: space-around;
  }
`;

const Header = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 42px;
  /* identical to box height, or 105% */

  text-align: center;
  text-transform: capitalize;

  color: #003647;
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

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 4px;
  top: 6px;
`;
const Card = styled.div`
  min-height: 356px;
  max-width: 700px;
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
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    width: 90%;
    color: #393d3e;
    margin: auto;
    padding-top: 15px;
    padding-bottom: 25px;
  }
`;
