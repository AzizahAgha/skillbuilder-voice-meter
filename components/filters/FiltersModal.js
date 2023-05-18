import React, { useState, useEffect } from "react";
import { Modal as BsModal } from "react-bootstrap";
import styled from "styled-components";
import { BsSliders as SlidersIcon } from "react-icons/bs";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import Button from "@ui-library/Button";
import FiltersGrid from "./FiltersGrid";
import FiltersAccordion from "./FiltersAccordion";
import { Formik, Form } from "formik";
import { useMediaQuery } from "react-responsive";
import FormObserver from "./FormObserver";
import { useTeam } from "@contexts/TeamContext";
import { useQuery } from "react-query";
import questionService from "@services/question.service";
import answerService from "@services/answer.service";
import filtersToRequestBodyTransformer from "@transformers/filtersToRequest.transformer";
import answerFiltersTransformer from "@transformers/answerFiltersToRequest.transformer";

export default function FiltersModal({
  onFiltersChange,
  hideQuestionFilters = false,
  hideAnswerFilters = false,
  question,
  setResults,
  isAnswerMerge,
  addQuestionPopup = false,
}) {
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState(undefined);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const { team } = useTeam();

  const questionsQuery = useQuery(
    ["questionnaire", { teamId: team?.id, filters }],
    () => questionService.getAll({ teamId: team?.id, filters }),
    {
      enabled: team && !hideQuestionFilters && show ? true : false,
      refetchOnMount: false,
    }
  );

  const answerQuery = useQuery(
    ["all-answers", { teamId: team?.id, questionId: question?.id, filters }],
    () =>
      answerService.getAll({
        teamId: team?.id,
        questionId: question?.id,
        filters,
      }),
    {
      enabled: hideQuestionFilters && !!question && show,
      refetchOnMount: false,
    }
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setResults && setResults(questionsQuery?.data?.data?.length);
  }, [questionsQuery.data]);

  return (
    <Formik
      initialValues={{
        frequency: [],
        priority: [],
        risk: [],
        confidence: [],
        differentiation: [],
        importance: [],
        questionsByAuthors: [],
        answersByAuthors: [],
        questionsByLabels: [],
        answersByLabels: [],

        questionsByDateRange: { start: "", end: "" },
        answersByDateRange: { start: "", end: "" },
        noOfAnswers: { min: "", max: "" },
        includeLinks: false,
        agreedCount: 0,
        disagreedCount: 0,
        flaggedCount: 0,
      }}
      onSubmit={(values) => {
        // console.log(values);
        onFiltersChange(filters);
        handleClose();
      }}
    >
      {(formikProps) => (
        <Form className="bs">
          <FormObserver
            onChange={(values) =>
              setFilters(
                hideQuestionFilters && !!question
                  ? answerFiltersTransformer(values)
                  : filtersToRequestBodyTransformer({
                      filters: values,
                      type: "detailView",
                    })
              )
            }
          />
          <ButtonOutlined
            className="d-flex"
            type="button"
            variant="outline-primary"
            onClick={handleShow}
          >
            <SlidersIcon
              style={{ transform: "rotate(90deg)", marginRight: 6 }}
            />
            Filter
          </ButtonOutlined>
          <Modal
            show={show}
            className="bs"
            onHide={handleClose}
            size="lg"
            centered
            addQuestionPopup={addQuestionPopup}
          >
            <Modal.Header>
              <Modal.Title>
                {hideQuestionFilters ? "Filter Answers" : "Filters"}
              </Modal.Title>

              <CloseButton onClick={handleClose}>
                <CloseIcon size={24} color="#969C9D" />
              </CloseButton>
            </Modal.Header>

            <Modal.Body>
              {isTabletOrMobile ? (
                <FiltersAccordion
                  hideQuestionFilters={hideQuestionFilters}
                  hideAnswerFilters={hideAnswerFilters}
                />
              ) : (
                <FiltersGrid
                  hideQuestionFilters={hideQuestionFilters}
                  hideAnswerFilters={hideAnswerFilters}
                />
              )}
            </Modal.Body>

            <Modal.Footer>
              <ResetButton
                id="filter-modal-reset"
                type="reset"
                onClick={() => formikProps.resetForm()}
              >
                Reset Filter
              </ResetButton>

              <Button
                type="submit"
                variant="primary"
                onClick={() => formikProps.submitForm()}
                disabled={answerQuery.isLoading || questionsQuery.isLoading}
              >
                {answerQuery.isLoading || questionsQuery.isLoading
                  ? "Loading"
                  : isAnswerMerge
                  ? `Show
              ${
                questionsQuery?.data?.count ||
                Math.max(answerQuery.data?.count - 1, 0)
              }
               
              Results`
                  : `Show
              ${questionsQuery?.data?.count || answerQuery.data?.count || 0}
              Results`}
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      )}
    </Formik>
  );
}

const Modal = styled(BsModal)`
  &&& {
    z-index: ${(props) => (props.addQuestionPopup ? "3000" : "1060")};
    .modal-content {
      background: #ffffff;
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
      border: none;
    }
    .modal-header {
      border: none;
      .modal-title {
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: 500;
        font-size: 35px;
        line-height: 42px;
        color: #81c2c0;
        margin-left: 0.7rem;
      }
    }
    .modal-body {
      height: 65vh;
      overflow: hidden scroll;
      padding-bottom: 0;
    }
    .modal-footer {
      justify-content: space-between;
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 12px;
  top: 12px;
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
