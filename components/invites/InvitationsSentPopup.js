import React from "react";
import { Modal as BSModal } from "react-bootstrap";
import Button from "@ui-library/Button";
import styled from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";

export default function InvitationsSentPopup({
  show = false,
  handleClose,
  onSendMoreInvites,
  refetchFlashcard,
  FlashcardName,
}) {
  return (
    <Modal className="bs" centered show={show}>
      <Modal.Body>
        <CloseButton
          onClick={() => {
            handleClose();
            refetchFlashcard && refetchFlashcard();
          }}
        >
          <CloseIcon size={24} color="#969C9D" />
        </CloseButton>

        <h4>Invitations Sent</h4>
        <p>
          {FlashcardName
            ? `Team Members are invited to collaborate on ${FlashcardName} flashcard set`
            : "Your invitations have been successfully sent."}{" "}
        </p>
        <Button
          onClick={() => {
            handleClose();
            refetchFlashcard && refetchFlashcard();
          }}
        >
          Thanks
        </Button>
        {!refetchFlashcard && (
          <button
            className="btn-invite-more"
            onClick={() => {
              onSendMoreInvites();
            }}
          >
            + Invite More
          </button>
        )}
      </Modal.Body>
    </Modal>
  );
}

const Modal = styled(BSModal)`
  &&& {
    .modal-dialog {
      display: flex;
      justify-content: center;
    }

    .modal-content {
      max-width: auto;
    }

    h4 {
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 600;
      font-size: 40px;
      line-height: 48px;
      text-align: center;
      color: #003647;
    }

    p {
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      letter-spacing: 0.02em;
      color: #393d3e;
    }

    button {
      display: block;
      margin: 0 auto;
    }

    .btn-invite-more {
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      letter-spacing: 0.02em;
      color: #393d3e;
      display: block;
      margin: 0 auto;
      margin-top: 1rem;
      border: none;
      background: none;
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 2px;
  top: 2px;
`;
