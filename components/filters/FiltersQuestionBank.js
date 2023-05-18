import React, { useState,useRef,useEffect  } from "react";
import { Modal as BsModal } from "react-bootstrap";
import styled from "styled-components";
import { BsSliders as SlidersIcon } from "react-icons/bs";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import Button from "@ui-library/Button";
import { Formik, Form } from "formik";
import FormObserver from "./FormObserver";
import { useTeam } from "@contexts/TeamContext";
import { useQuery } from "react-query";
import QuestionBank from "./subFilters/QuestionBank";

export default function QuestionBankFiltersModal({
  filterData,
  initalVals,
  resultCount,
  onFiltersChange,
  resetForm,
  setResetForm,
}) {
  const [show, setShow] = useState(false);
  const { team } = useTeam();
  const formikRef = useRef();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if(resetForm == 1){
      formikRef.current?.resetForm()
      setResetForm(0);
    }
  }, [resetForm]);

  return (
    <Formik
      initialValues={initalVals}
      innerRef={formikRef}
      onSubmit={(values) => {
        if(Object.keys(values).length > 0)
          onFiltersChange(values);
        handleClose();
      }}
     
    >
      {(formikProps) => (
        <Form className="bs">
          <FormObserver
            onChange={(values) =>{
              if(Object.keys(values).length > 0)
              onFiltersChange(values)
            }
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
          >
            <Modal.Header>
              <Modal.Title>
                Filter
              </Modal.Title>

              <CloseButton onClick={handleClose}>
                <CloseIcon size={24} color="#969C9D" />
              </CloseButton>
            </Modal.Header>

            <Modal.Body>
                {filterData && 
                  <QuestionBank filterData={filterData}/>
                }
            </Modal.Body>

            <Modal.Footer>
              <ResetButton type="reset" onClick={() => { onFiltersChange({});formikProps.resetForm();}}>
                Reset Filter
              </ResetButton>
              <Button
                type="submit"
                variant="primary"
                onClick={() => formikProps.submitForm()}
              >
                Show{" "}
                {resultCount}
                {" "}Results
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
