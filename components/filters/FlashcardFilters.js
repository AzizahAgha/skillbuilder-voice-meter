import React, { useState, useEffect } from "react";
import { Modal as BsModal } from "react-bootstrap";
import styled from "styled-components";
import {
  BsSliders as SlidersIcon,
  BsArrowDown,
  BsArrowUp,
} from "react-icons/bs";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import Button from "@ui-library/Button";
import FiltersGrid from "./FiltersGrid";
import FiltersAccordion from "./FiltersAccordion";
import { Formik, Form } from "formik";
import { useMediaQuery } from "react-responsive";
import FormObserver from "./FormObserver";
import { useTeam } from "@contexts/TeamContext";
import { useRouter } from "next/router";
import flashcardFiltersToRequestTransformer from "@transformers/flashcardFiltersToRequest.transformer";
import { GetAllFlashcards } from "@components/queries/getAllFlashcards";
import DropdownButton from "react-bootstrap/DropdownButton";
import Checkbox from "@ui-library/Checkbox";
import BsDropdown from "react-bootstrap/Dropdown";
import { useQuery } from "react-query";
import flashcardService from "@services/flashcard.service";
import Bus from "@utils/Bus";
import flashcardEditFiltersToRequestTransformer from "@transformers/filtersToRequest.transformer";
import { TbArrowsSort } from "react-icons/tb";

const options = [
  { key: "createdAt", value: "Created Date" },
  { key: "updatedAt", value: "Updated Date" },
  { key: "setTitle", value: "Set Title" },
];

export default function FlashcardFilter({
  onFiltersChange,
  hideQuestionFilters = false,
  hideAnswerFilters = false,
  searchKeyword,
  sortOn,
  setSort,
  sortBy,
  setSortBy,
  isToggle,
  setiIsToggle,
  refetchFlashcard,
  editFlashcardPage = false,
  flashId,
  questionsFlashcardQuery,
}) {
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState(undefined);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const { team } = useTeam();
  const [authorsData, setAuthorsData] = useState({});
  const [formikValues, setformikValues] = useState({});

  const { data: flashcardAuthorsData } = useQuery(
    ["flashcardAuthors", { teamId: team?.id }],
    () => flashcardService.getAuthors({ teamId: team?.id }),
    {
      enabled: team?.id && !editFlashcardPage ? true : false,

      onSuccess: async (res) => {
        await res.data.map((e) => (e.isChecked = true));
        setAuthorsData(await res);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const { data: flashcardQuestionAuthorsData } = useQuery(
    ["flashcardAuthors", { teamId: team?.id, flashId: flashId }],
    () =>
      flashcardService.getQuestionAuthors({
        teamId: team?.id,
        flashId: flashId,
      }),
    {
      enabled: team?.id && editFlashcardPage ? true : false,

      onSuccess: async (res) => {
        await res.data.map((e) => (e.isChecked = true));
        setAuthorsData(await res);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const { data, isLoading } = GetAllFlashcards({
    teamId: team?.id,
    filters: filters,
    sortOn: sortOn,
    sortBy: sortBy,
    searchString: searchKeyword,
    editFlashcardPage: editFlashcardPage,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isFlashcardPages, setIsFlashcardPages] = useState();
  const router = useRouter();

  const onCheckboxChange = async (newValue, index, formikProps) => {
    const copy = await JSON.parse(JSON.stringify(authorsData));
    copy.data[index].isChecked = await newValue;
    setAuthorsData(await copy);

    formikProps.setFieldValue(
      "authors",
      copy.data
        .filter((e) => e.isChecked === true)
        .map((el) => {
          return el.id;
        })
    );
    const copy1 = await JSON.parse(JSON.stringify(formikProps));
    setformikValues({
      ...copy1.values,
      authors: copy.data
        .filter((e) => e.isChecked === true)
        .map((el) => {
          return el.id;
        }),
    });
  };

  useEffect(() => {
    if (Object.keys(formikValues).length !== 0 && editFlashcardPage === true) {
      setFilters(
        flashcardEditFiltersToRequestTransformer({
          filters: formikValues,
          type: "flashcardEdit",
        })
      );
    } else if (
      Object.keys(formikValues).length !== 0 &&
      editFlashcardPage === false
    ) {
      setFilters(flashcardFiltersToRequestTransformer(formikValues));
    }

    onFiltersChange(filters);
  }, [formikValues]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]);

  useEffect(() => {
    setIsFlashcardPages(router.asPath.includes("flashcards"));
  }, [router]);

  const sortValue = async (option) => {
    setSort(option);
    setiIsToggle((prevCheck) => !prevCheck);
    await onFiltersChange(filters);
    await refetchFlashcard();
  };

  return (
    <>
      {Object.keys(authorsData).length !== 0 && (
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
            likes: 0,
            dislikes: 0,
            flags: 0,
            authors: authorsData?.data
              ?.filter((e) => e.isChecked === true)
              ?.map((el) => {
                return el.id;
              }),
          }}
          onSubmit={() => {
            onFiltersChange(filters);
            handleClose();
          }}
        >
          {(formikProps) => (
            <Form className="bs">
              <FormObserver
                onChange={(values) => {
                  editFlashcardPage
                    ? setFilters(
                        flashcardEditFiltersToRequestTransformer({
                          filters: values,
                          type: "flashcardEdit",
                        })
                      )
                    : setFilters(flashcardFiltersToRequestTransformer(values));
                }}
              />

              <OptionsWrapper>
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
                <span className="mx-1" />
                <Dropdown>
                  <DropdownToggled>
                    <TbArrowsSort
                    // style={{ transform: "rotate(90deg)", marginRight: 6 }}
                    />
                    <span className="mx-1">Sort</span>
                  </DropdownToggled>
                  <Dropdown.Menu style={{ minWidth: "7rem" }}>
                    {options.map((option, idx) => (
                      <Dropdown.Item
                        key={option.key}
                        value={option.key}
                        onClick={() => sortValue(option.key)}
                        className="d-flex"
                      >
                        <div style={{ width: "70px", paddingTop: "4px" }}>
                          {option.value}
                        </div>
                        <div>
                          {sortOn == option.key ? (
                            <button
                              style={{
                                background: "transparent",
                                border: "none",
                              }}
                            >
                              {isToggle ? (
                                <BsArrowDown color={"#1F5462"} />
                              ) : (
                                <BsArrowUp color={"#1F5462"} />
                              )}
                            </button>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <span className="mx-1" />
                <StyledDropdownButton
                  id="dropdown-basic-button"
                  title="Select Author(s)"
                >
                  {authorsData?.data?.map((author, index) => (
                    <StyledCheckbox
                      key={index}
                      id={author.id}
                      label={author.name}
                      checked={!!authorsData?.data[index]?.isChecked}
                      onChange={(e) =>
                        onCheckboxChange(e.target.checked, index, formikProps)
                      }
                    />
                  ))}
                </StyledDropdownButton>
              </OptionsWrapper>
              <Modal
                show={show}
                className="bs"
                onHide={handleClose}
                size="lg"
                centered
              >
                <Modal.Header>
                  <Modal.Title>Filter Flashcards</Modal.Title>

                  <CloseButton onClick={handleClose}>
                    <CloseIcon size={24} color="#969C9D" />
                  </CloseButton>
                </Modal.Header>

                <Modal.Body>
                  {isTabletOrMobile ? (
                    <FiltersAccordion
                      hideQuestionFilters={hideQuestionFilters}
                      hideAnswerFilters={hideAnswerFilters}
                      isFlashcardPages={isFlashcardPages}
                    />
                  ) : (
                    <FiltersGrid
                      hideQuestionFilters={hideQuestionFilters}
                      hideAnswerFilters={hideAnswerFilters}
                      isFlashcardPages={isFlashcardPages}
                    />
                  )}
                </Modal.Body>

                <Modal.Footer>
                  <ResetButton
                    type="reset"
                    onClick={() => {
                      formikProps.resetForm();

                      editFlashcardPage
                        ? setAuthorsData(
                            flashcardQuestionAuthorsData?.data
                              ?.filter((e) => e.isChecked === true)
                              ?.map((el) => {
                                return el.id;
                              })
                          )
                        : setAuthorsData(
                            flashcardAuthorsData?.data
                              ?.filter((e) => e.isChecked === true)
                              ?.map((el) => {
                                return el.id;
                              })
                          );
                    }}
                  >
                    Reset Filter
                  </ResetButton>
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={() => formikProps.submitForm()}
                  >
                    {editFlashcardPage
                      ? questionsFlashcardQuery.isLoading
                        ? "Please Wait"
                        : `Show ${questionsFlashcardQuery?.data?.data?.length}`
                      : isLoading
                      ? "Please Wait"
                      : ` Show ${data?.data?.length} Results`}
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          )}
        </Formik>
      )}
    </>
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

const StyledDropdownButton = styled(DropdownButton).attrs(() => ({
  variant: "outline-primary",
}))`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: #003647;
    font-family: "Barlow Condensed", sans-serif;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
`;

const StyledCheckbox = styled(Checkbox)`
  &&& {
    margin-left: 10px;
  }
`;

const OptionsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const Dropdown = styled(BsDropdown)`
  &&& {
    font-family: "Barlow Condensed";
    font-style: normal;
  }
`;
export const DropdownToggled = styled(Dropdown.Toggle)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: #003647;
    font-family: "Barlow Condensed", sans-serif;

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:after {
      content: none;
    }

    &.btn-primary.dropdown-toggle {
      color: #003647;
      background-color: transparent;
      border-color: #003647;
      width: 100%;
      text-align: inherit;
    }

    &.btn-primary.dropdown-toggle:hover {
      color: #fff;
      background-color: #003647;
    }
  }
`;
