import React, { useState } from "react";
import { Card as BSCard, Modal as BSModal } from "react-bootstrap";
import styled from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Button from "@ui-library/Button";
import { Formik } from "formik";
import { IoAddCircleSharp } from "react-icons/io5";
import PreviewAllAnswers from "@components/dataTables/PreviewAllAnswers";
import Tooltip from "@ui-library/Tooltip";
import * as Yup from "yup";
import striptags from "striptags";
import AnswerContent from "./AnswerContent";

export default function AddAnswerPopup({
  handleSubmit,
  question,
  CustomButton,
  showAllAnswersPreviewOption = true,
  isEditable = false, // prop to enable editing
  answer, // required if editing is enabled
  refetchSummaryView,
  isDetailView,
}) {
  const [showPopup, setShowPopup] = useState(false);

  const initialValues = ({ answer, isDetailView }) => {
    if (answer) {
      if (isDetailView) {
        return {
          answer: answer?.answerText,
          confidence: answer?.confidence,
          differentiation: answer?.differentiation,
          attachment: answer?.attachment ? answer?.attachment : [],
        };
      } else {
        return {
          ...answer,
          answer: answer.text,
          attachment: answer.attachment ? answer.attachment : [],
        };
      }
    } else {
      return { answer: "", confidence: 1, differentiation: 1, attachment: [] };
    }
  };

  return (
    <Formik
      initialValues={initialValues({
        answer: answer,
        isDetailView: isDetailView,
      })}
      validationSchema={schema}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        if (
          striptags(values.answer)
            .replaceAll(/&nbsp;/g, "")
            .trim() !== "" ||
          values.attachment.length > 0
        ) {
          handleSubmit(values);
          setShowPopup(false);
          resetForm();
        }
      }}
    >
      {(formik) => (
        <div className="bs">
          {!CustomButton ? (
          
              <button
                className="btn p-0"
                onClick={() => setShowPopup(true)}
                id="btn-add-answer"
              >
                <IoAddCircleSharp color="#393D3E" opacity={0.5} size={24} />
              </button>
            
          ) : (
            <div
              className="btn p-0"
              onClick={() => setShowPopup(true)}
              id="btn-add-answer-spl"
              style={{ lineHeight: 1 }}
            >
              <CustomButton />
            </div>
          )}

          <Modal
            className="bs"
            show={showPopup}
            onHide={() => {
              formik.resetForm();
              setShowPopup(false);
            }}
            size="lg"
            centered
          >
            <Card className="bs">
              <Tooltip text="Close" placement="left">
                <CloseButton
                  onClick={() => {
                    formik.resetForm();
                    setShowPopup(false);
                  }}
                >
                  <CloseIcon size={24} color="#969C9D" />
                </CloseButton>
              </Tooltip>

              <Card.Body>
                <Card.Title>
                  {isEditable
                    ? "Edit Your Answer for this Question:"
                    : "Add an Answer for this Question:"}
                </Card.Title>
                <Card.Text>{question?.text}</Card.Text>

                <AnswerContent />
              </Card.Body>
              <Card.Footer className="justify-content-end">
                {showAllAnswersPreviewOption && (
                  <PreviewAllAnswers
                    question={question}
                    refetchSummaryView={refetchSummaryView}
                  />
                )}

                <StyledButton
                  type="button"
                  onClick={() => formik.submitForm()}
                  disabled={
                    !formik.dirty && formik.values?.attachment?.length === 0
                  }
                >
                  Save and Review
                </StyledButton>
              </Card.Footer>
            </Card>
          </Modal>
        </div>
      )}
    </Formik>
  );
}

const schema = Yup.object().shape({
  answer: Yup.string().trim(),
  confidence: Yup.number().min(1).max(5).required(),
  differentiation: Yup.number().min(1).max(5).required(),
});

const StyledButton = styled(Button)`
  &&& {
    opacity: ${(props) =>
      props.disabled ? "0.25 !important" : "1 !important"};
  }
`;

const Modal = styled(BSModal)`
  &&& {
    .modal-dialog {
      //max-width: 900px !important;
    }
    .modal-content {
      background: none;
      border: none;
      display: flex;
      justify-content: end;
    }
  }
`;

const Card = styled(BSCard)`
  &&& {
    .card-title {
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 500;
      font-size: 30px;
      line-height: 36px;
      color: #1f5462;
      margin-top: 0.5rem;
    }

    .card-text {
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      color: #393d3e;
      max-height: 60px;
      overflow: auto;
    }

    @media (min-width: 1224px) {
      position: relative;
      //max-width: 830px;

      background: #ffffff;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      // margin: 1rem;

      .card-body {
        padding-bottom: 0;
      }

      .card-footer {
        background: none;
        border: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        padding-top: 0;
      }
    }
  }
`;
const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 12px;
  top: 16px;
`;
const ResetButton = styled.button`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #81c2c0;
  border: none;
  background: transparent;
`;
