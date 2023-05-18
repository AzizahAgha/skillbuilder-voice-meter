import React, { useState, useEffect } from "react";
import {
  Modal as BSModal,
  Container,
  Row,
  Col,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import styled from "styled-components";
import SkillbuilderLogoDark from "@public/svgs/skillbuilder-logo-dark.svg";
import Button from "@ui-library/Button";
import { useAuthUser } from "@contexts/AuthContext";
import inviteService from "@services/invite.service";
import { useMutation } from "react-query";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Tooltip from "ui-library/Tooltip";
import { Markup } from "interweave";
import { useTeam } from "@contexts/TeamContext";
import InviteCard from "@components/invites/InviteCard.js";
import * as Yup from "yup";
import Bus from "@utils/Bus";

export default function InvitesPopup({
  show,
  handleClose,
  showConfirmationPopup,
  teamId,
  questionId,
  showCloseBtn = false,
  onCloseBtn, // pass a function to overried the handleClose function on click of the close button
  inviteMessage = "",
  inviteType = "Team", // inviteType: 'Team' | 'Question' | 'Flashcard'
  showPromoText = false,
  isSignup = false,
  flashcardSetId,
  invitesCount,
  refetchFlashcard,
}) {
  const { auth } = useAuthUser();
  const { refetchTeam } = useTeam();
  const [resendList, setResendList] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState(
    inviteType === "Team"
      ? "Hi! I want to build out a database of prospect and customer questions we can all search and share about our products and services. Please accept this invitation and answer any questions you can, thanks!"
      : inviteType === "Question"
      ? "Hi! I am working on getting together our best answers to our toughest sales questions. We are hoping you would weigh in on the below:"
      : inviteType === "Flashcard"
      ? "Hi! I want to build out a database of prospect and customer questions we can all search and share about our products and services. Please accept this invitation and edit the Flashcard, thanks!"
      : ""
  );
  const mutation = useMutation((data) => inviteService.create(data), {
    onError: (error) => {
      if (Number(error.toString().match(/\d/g).join("")) !== 409) {
        Bus.emit("error", { operation: "open", errorCode: error.code });
      }
    },
  });

  const handleSubmit = (emails, type) => {
    if (type === "resend") {
      mutation
        .mutateAsync({
          emails: emails,
          inviteText: (message + inviteMessage).replaceAll("\n", "<br />"),
          type: inviteType,
          teamId,
          questionId,
          isSignup,
          flashcardSetId,
        })
        .then(() => {
          setEmailList([]);
          setTags([]);
        })
        .then(() => {
          refetchTeam();
        });
    } else {
      mutation
        .mutateAsync({
          emails: emails,
          inviteText: (message + inviteMessage).replaceAll("\n", "<br />"),
          type: inviteType,
          teamId,
          questionId,
          isSignup,
          flashcardSetId,
        })
        .then(() => {
          setEmailList([]);
          setTags([]);
        })
        .then(() => {
          handleClose();
          showConfirmationPopup();
          refetchTeam();
        });
    }
  };

  const clearEmails = () => {
    setEmailList([]);
    setTags([]);
  };

  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  const ValidateEmail = (el) => {
    if (el) {
      if (Yup.string().email().isValidSync(el)) {
        if (
          !tags.map((e) => e.email.toLowerCase()).includes(el.toLowerCase())
        ) {
          // setTags([...tags, { type: "typed", email: el }]);
          setError("");
          setEmail("");
          const emails = [...tags, { type: "typed", email: el }].map(
            (e) => e.email
          );

          handleSubmit([...new Set([...emails])]);
        } else {
          setError("Duplicate Email Entered!");
        }
      } else {
        setError("Enter Valid Emails");
      }
    } else {
      handleSubmit(emailList);
    }
  };

  useEffect(() => {
    if (tags) {
      const emails = tags.map((e) => e.email);
      setEmailList([...new Set([...emails])]);
    }
    if (flashcardSetId && tags.length > 0) {
      if (
        Number(emailList.length) + (email ? 1 : 0) + Number(invitesCount) >=
        5
      ) {
        setEmail("");
        document.getElementById("tags-input").value = "";
      }
    }
  }, [tags]);

  return (
    <Modal className="bs" show={show} fullscreen={true}>
      <Container fluid>
        {showPromoText && (
          <Row>
            <Col>
              <Header>
                <h1>Hi {auth?.user?.firstName?.split(" ")[0]}!</h1>
                <h2>
                  Invite collegues with <b>Unlimited Collaboration</b> for the
                  first 30 days!
                </h2>
                <p>
                  If 4 or more colleagues are invited then you&apos;ll get FREE
                  60 days instead!
                </p>
              </Header>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <Card>
              {showCloseBtn && (
                <Tooltip text="Close" placement="left">
                  <CloseButton
                    type="button"
                    onClick={() => {
                      clearEmails();
                      setError("");
                      setEmail("");
                      onCloseBtn ? onCloseBtn() : handleClose();
                    }}
                  >
                    <CloseIcon size={30} color="#969C9D" />
                  </CloseButton>
                </Tooltip>
              )}
              <Image src={SkillbuilderLogoDark.src} alt="Skillbuilder" />

              <InviteCard
                mutation={mutation}
                flashcardSetId={flashcardSetId}
                invitesCount={invitesCount}
                inviteType={inviteType}
                tags={tags}
                setTags={setTags}
                emailList={emailList}
                setEmailList={setEmailList}
                setEmail={setEmail}
                error={error}
                setError={setError}
                email={email}
                handleSubmit={handleSubmit}
                setResendList={setResendList}
                resendList={resendList}
                questionId={questionId}
              />
              <Line />
              <StyledInputGroup className="mt-3" $inviteType={inviteType}>
                <textarea
                  value={message}
                  required
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />

                {inviteType !== "Team" && <Markup content={inviteMessage} />}
              </StyledInputGroup>

              <Button
                onClick={() => {
                  ValidateEmail(email);
                }}
                style={{ float: "right", marginTop: "1rem" }}
                disabled={
                  mutation.isLoading ||
                  Number(emailList.length) + (email ? 1 : 0) === 0 ||
                  !!error
                }
              >
                {mutation.isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Invites ({Number(emailList.length) + (email ? 1 : 0)})
                  </>
                )}
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

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

const Header = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
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

const StyledInputGroup = styled(InputGroup)`
  &&& {
    width: 100%;
    background: rgba(150, 156, 157, 0.05);
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0.5rem;

    .input-group-text {
      height: 34px;
      width: 34px;
      background: #81c2c0;
      border: none;
      border-radius: 50% !important;
      padding: 0.375rem 0.45rem;
      margin-right: 0.5rem;
    }

    input,
    textarea {
      background: transparent;
      border: none;
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.02em;
      color: #393d3e;

      &:focus {
        outline: none;
        border-color: none;
        box-shadow: none;
        background: transparent;
      }
    }

    textarea {
      height: ${(props) =>
        props.$inviteType === "Team" || props.$inviteType === "Flashcard"
          ? "120px"
          : "auto"};
      resize: none;
      width: 100%;
    }
  }
`;

const Line = styled.hr`
  margin: 2px !important;
`;
const Image = styled.img`
  margin: 7px auto;
  max-width: 100%;
  height: auto;
`;
