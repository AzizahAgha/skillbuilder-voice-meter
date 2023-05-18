import React, { useState,useEffect } from "react";
import { Card as BSCard, Modal as BSModal } from "react-bootstrap";
import styled from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Button from "@ui-library/Button";
import Table from "./Table";
import AddQuestionPopupSM from "./AddQuestionPopupSM";
import { Formik } from "formik";
import { useMediaQuery } from "react-responsive";
import { IoAddCircleSharp } from "react-icons/io5";
import Tooltip from "@ui-library/Tooltip";
import * as Yup from "yup";
import { useRouter } from "next/router";

export default function AddQuestionPopup({
  title,
  buttonText,
  handleSubmit,
  CustomButton,
  question,
  refetchData
}) {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const [isFlashcardPages, setIsFlashcardPages] = useState();


  useEffect(() => {
    setIsFlashcardPages(router.asPath.includes("flashcards"));
  }, [router]);

  return (
    <Formik
      initialValues={
        question
          ? { ...question }
          : { question: "", frequency: "Sometimes", importance: 1 }
      }
      validationSchema={schema}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        resetForm();
        setShowPopup(false);
        handleSubmit(values);
      }}
    >
      {(formik) => (
        <div>
          {/* <Button
            id='btn-add-question'
            type='button'
            onClick={() => setShowPopup(true)}
            style={{ width: '100%' }}
          >
            + Add Question
          </Button> */}

          {!CustomButton ? (
            <Tooltip text="Add Question">
              <button
                type="button"
                className="btn p-0"
                onClick={() => setShowPopup(true)}
                id="btn-add-question"
                style={{display:isFlashcardPages? "none":"block"}}
              >
                <IoAddCircleSharp color="#81C2C0" size={34} />
              </button>
            </Tooltip>
          ) : (
            <CustomWrapper
              className="btn p-0"
              onClick={() => setShowPopup(true)}
              id="btn-add-answer"
            >
              <CustomButton />
            </CustomWrapper>
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
            <Card>
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
                <Card.Title>{title ?? "Add a Question"}</Card.Title>

                {isTabletOrMobile ? <AddQuestionPopupSM /> : <Table />}

                <Button type="button" onClick={() => formik.submitForm()}>
                  {buttonText ?? "Add New Question"}
                </Button>
              </Card.Body>
            </Card>
          </Modal>
        </div>
      )}
    </Formik>
  );
}

const schema = Yup.object().shape({
  question: Yup.string().max(1000).trim().required(),
  importance: Yup.number().min(1).max(5).required(),
  frequency: Yup.string().required(),
});

const Modal = styled(BSModal)`
  &&& {
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

    @media (min-width: 1224px) {
      position: relative;
      height: 455px;

      background: #ffffff;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      margin: 1rem;

      table tbody tr {
        td {
          background: white;
        }

        td:first-child {
          padding: 0.5rem;
          width: auto;
          height: 230px;
          min-width: 330px;
        }

        textarea {
          height: 90%;
        }
      }
    }

    button {
      float: right;
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

const CustomWrapper = styled.div`
  @media (max-width: 1224px) {
    width: 100%;
  }
`;
