import React, { useEffect, useState } from "react";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import {
  Container,
  Row,
  Spinner,
  Col,
  InputGroup,
  Form,
  Button as BsButton,
} from "react-bootstrap";
import DetailViewTable from "@components/dataTables/DetailViewTable";
import { useRouter } from "next/router";
import { useTeam } from "@contexts/TeamContext";
import { useAppContext } from "@contexts/AppContext";
import { useQuery, useMutation } from "react-query";
import questionService from "@services/question.service";
import * as _ from "lodash";
import { Formik, Field } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import Tooltip from "@ui-library/Tooltip";
import flashcardService from "@services/flashcard.service";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import SaveButtonFlashcard from "@ui-library/SaveButtonFlashcard";
import FormGroup from "@ui-library/FormGroup";
import Bus from "@utils/Bus";
import FLashcardQuestionCard from "@components/flashcards/FLashcardQuestionCard";
import { IoAddCircleSharp, IoSearchOutline } from "react-icons/io5";
import AddFlashcardQuestionsPopup from "@components/flashcards/AddFlashcardQuestionsPopup";
import { DebounceInput } from "react-debounce-input";
import { IoIosCloseCircleOutline } from "react-icons/io";
import FlashcardFilter from "@components/filters/FlashcardFilters";

export function FlashCard() {
  const router = useRouter();
  const [sort, setSort] = useState("Question No");
  const [selectedArray, setSelectedArray] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isdeleted, setIsdeleted] = useState(false);
  const [flashcardData, setFlashcardData] = useState({});
  const [showAddQuestionsPopup, setShowAddQuestionsPopup] = useState(false);
  const { team } = useTeam();
  const { setInSelectMode, selection, setSelection, alert } = useAppContext();
  const [saveButtonPressed, setSaveButtonPressed] = useState(false);

  const [filters, setFilters] = useState(undefined);
  const [sortOn, setSortOn] = useState("createdAt");
  const [sortBy, setSortBy] = useState("ASC");
  const [isToggle, setiIsToggle] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const schema = yup.object().shape({
    setTitle: yup.string().trim().required(),
    setDescription: yup.string().trim(),
  });

  const setSelectionValue = (res) => {
    let selected = {};
    for (const key of res.questions) {
      selected[key] = true;
    }
    setSelection(selected);
  };

  if (router.query.id?.includes("&isFavorite=true")) {
    router.query.id = router.query.id.substr(0, router.query.id.indexOf("&"));
  }

  const flashcardDetails = useQuery(
    "flashcard-details",
    () =>
      flashcardService.get({
        teamId: team?.id,
        flashcardSetId: router.query.id,
      }),
    {
      enabled: !!team?.id && router.query.id !== "0",
      onSuccess: (res) => {
        if (Object.keys(res).length !== 0) {
          setFlashcardData(res);
          setSelectionValue(res);
          setShowAddQuestionsPopup(false);
        }
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const questionsFlashcardQuery = useQuery(
    [
      "questionnaire-flashcard",
      {
        teamId: team?.id,
        filters,
        sortOn,
        sortBy,
        searchKeyword,
      },
    ],
    () =>
      questionService.getAllQuestions({
        teamId: team?.id,
        filters,
        searchString: searchKeyword,
        params: {
          type: "all",
          flashcardSetId: router.query.id,
          sortOn: sortOn,
          sortBy: sortBy,
          pageType: "details",
        },
      }),
    {
      enabled: !!team?.id,

      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  useEffect(() => {
    if (isToggle) {
      setSortBy("DESC");
    } else {
      setSortBy("ASC");
    }
  }, [isToggle]);

  useEffect(() => {
    if (router.query.fromInvite) {
      router.reload();
    }
    setInSelectMode(true);
  }, []);

  useEffect(() => {
    console.log(questionsFlashcardQuery?.data?.data);
    let result = [];
    const ques = Object.keys(selection).filter((key) => {
      if (selection[key]) {
        return key;
      }
    });
    setQuestions(ques);
    ques.forEach((key) => {
      questionsFlashcardQuery?.data?.data?.forEach((quest) => {
        if (quest.questionId == key) {
          result.push(quest);
        }
      });
    });

    setSelectedArray(result);
    setIsdeleted(false);
  }, [selection, isdeleted, questionsFlashcardQuery.data]);

  const handleIconDelete = (quest) => {
    const alertDialog = alert.show(
      <ConfirmAlert
        title={"Do you want to remove this Question from the Set?"}
        message={`Q${quest.number}: ${quest.text}`}
        onDone={() => {
          deleteQuestion(quest);
          alertDialog.close();
        }}
        onCancel={() => alertDialog.close()}
      />
    );
  };

  const deleteQuestion = (quest) => {
    const newArray = selectedArray.filter(
      (obj) => obj.questionId !== quest.questionId
    );
    setSelectedArray(newArray);

    let tempObj = { ...selection };
    delete tempObj[quest.questionId];
    setSelection(tempObj);

    setIsdeleted(true);
  };

  const flashcardMutation = useMutation(
    ({ data }) => flashcardService.create(team?.id, data),
    {
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },

      onSuccess: (res) => {
        router.query.id = res.flashcardSetId;
        questionsFlashcardQuery.refetch();
        flashcardDetails.refetch();
      },
    }
  );

  return (
    <>
      <div className="bs">
        <Formik
          enableReinitialize
          initialValues={{
            flashcardSetId: flashcardData?.id ?? 0,
            isFavorite: flashcardData?.isFavorite ?? false,
            setTitle: flashcardData?.setTitle ?? "",
            setDescription: flashcardData?.setDescription ?? "",
            questions: flashcardData?.questions ?? [],
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            if (questions?.length <= 50) {
              flashcardMutation
                .mutateAsync({
                  data: {
                    flashcardSetId: flashcardData?.id ?? 0,
                    isFavorite: flashcardData?.isFavorite ?? false,
                    setTitle: values.setTitle,
                    setDescription: values.setDescription,
                    questions: questions,
                  },
                })
                .then((res) => {
                  questionsFlashcardQuery.refetch();
                  if (saveButtonPressed) {
                    router.push("/flashcards/learn");
                  }
                });
            } else {
              const alertLimitDialog = alert.show(
                <ConfirmAlert
                  title={"Flashcard Question Limit Exceeded"}
                  message={`Upto 50 questions can be added to a Flashcard Set`}
                  onDone={() => {
                    alertLimitDialog.close();
                  }}
                  onCancel={() => alertLimitDialog.close()}
                  doneLabel="Ok"
                />
              );
            }
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <DetailPageHeader
                editFlashcardPage={true}
                setTitle={formik.values.setTitle}
              />
              <FlashCardDetailsWrapper>
                <Container>
                  <Row className="align-items-center d-lg-block">
                    <StyledFlashDetailsWrapper>
                      <FormGroup controlId="setTitle" className="p-2 flex-fill">
                        <Form.Label>Set Title</Form.Label>
                        <Field
                          as={Form.Control}
                          name="setTitle"
                          // value={values.setTitle}
                          type="text"
                          placeholder="Set Title here"
                          required
                          minLength={3}
                          maxLength={100}
                        />
                        {formik.touched.setTitle && formik.errors.setTitle ? (
                          <div>{formik.errors.setDescription}</div>
                        ) : null}
                      </FormGroup>
                      <FormGroup
                        controlId="setDescription"
                        className="p-2 flex-fill"
                      >
                        <Form.Label>Set Description</Form.Label>
                        <Field
                          as={Form.Control}
                          name="setDescription"
                          // value={values.setDescription}
                          type="text"
                          placeholder="Briefly describe the purpose of this set"
                          minLength={3}
                          maxLength={500}
                        />
                        {formik.touched.setDescription &&
                        formik.errors.setDescription ? (
                          <div>{formik.errors.setDescription}</div>
                        ) : null}
                      </FormGroup>
                      <div
                        style={{
                          marginLeft: "30px",
                          marginRight: "30px",
                          marginTop: "10px",
                        }}
                      >
                        <StyledButtonOutlined
                          onClick={() => router.push("/flashcards/learn")}
                        >
                          Cancel
                        </StyledButtonOutlined>
                      </div>
                      <SaveButtonFlashcard
                        type="submit"
                        style={{ marginTop: "10px" }}
                        onClick={() => setSaveButtonPressed(true)}
                      >
                        Save set
                      </SaveButtonFlashcard>
                    </StyledFlashDetailsWrapper>
                  </Row>
                </Container>
              </FlashCardDetailsWrapper>

              <Container>
                <Row className="mb-4 align-items-center d-lg-block">
                  <SelectedQuestionsContainer>
                    <SelectedQuestionsHeader>
                      {`${selectedArray?.length} Selected Questions in [${
                        formik.values.setTitle
                          ? formik.values.setTitle
                          : "Set Title"
                      }]`}
                    </SelectedQuestionsHeader>
                    <SelectedQuestionsText>
                      You have selected {selectedArray?.length} out of 20
                      questions. Hover to view the questions or click the “x” to
                      remove the questions from the set.
                    </SelectedQuestionsText>
                    <SelectedQuestionsCardWrapper>
                      {selectedArray.map((question, index) => (
                        <FLashcardQuestionCard
                          key={index}
                          handleIconDelete={handleIconDelete}
                          question={question}
                        />
                      ))}
                      {selectedArray.length > 0 && (
                        <IoAddCircleSharp
                          color="#81C2C0"
                          size={34}
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowAddQuestionsPopup(true)}
                        />
                      )}
                    </SelectedQuestionsCardWrapper>
                  </SelectedQuestionsContainer>
                  <StyledHr />
                </Row>

                <AddFlashcardQuestionsPopup
                  show={showAddQuestionsPopup}
                  setShow={setShowAddQuestionsPopup}
                  title={formik.values.setTitle}
                  questions={questions}
                  setTitle={formik.values.setTitle}
                  setSelection={setSelection}
                  handleSubmit={formik.submitForm}
                  questionsFlashcardQuery={questionsFlashcardQuery}
                  flashcardMutation={flashcardMutation}
                />

                <Row>
                  <StyledCol position="flex-start">
                    <FlashcardFilter
                      onFiltersChange={setFilters}
                      searchKeyword={searchKeyword}
                      sortOn={sortOn}
                      sortBy={sortBy}
                      isToggle={isToggle}
                      setSort={setSortOn}
                      setSortBy={setSortBy}
                      setiIsToggle={setiIsToggle}
                      editFlashcardPage={true}
                      refetchFlashcard={questionsFlashcardQuery.refetch}
                      flashId={router.query.id}
                      questionsFlashcardQuery={questionsFlashcardQuery}
                    />
                  </StyledCol>
                  <StyledCol position="center">
                    <StyledAddQuestionButton
                      onClick={() => setShowAddQuestionsPopup(true)}
                      disabled={
                        formik.values.setTitle.trim() === "" ? true : false
                      }
                    >
                      + Add Questions
                    </StyledAddQuestionButton>
                  </StyledCol>
                  <StyledCol position="flex-end">
                    <StyledInputSearchGroup>
                      <InputGroup.Text>
                        <IoSearchOutline color="#003647" size={20} />
                      </InputGroup.Text>

                      <Input
                        type="search"
                        minLength={2}
                        debounceTimeout={300}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Search"
                        className="form-control"
                      />

                      {searchKeyword && (
                        <Tooltip text="Clear" placement="right">
                          <ClearButton
                            variant="default"
                            onClick={() => setSearchKeyword("")}
                          >
                            <IoIosCloseCircleOutline
                              color="#969C9D"
                              size={20}
                            />
                          </ClearButton>
                        </Tooltip>
                      )}
                    </StyledInputSearchGroup>
                  </StyledCol>
                </Row>
              </Container>
            </Form>
          )}
        </Formik>
        <Container>
          {questionsFlashcardQuery.isLoading ? (
            <LoadingIndicator>
              <Spinner
                animation="border"
                role="status"
                variant="secondary"
                style={{ width: "3rem", height: "3rem", marginBottom: 20 }}
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </LoadingIndicator>
          ) : (
            <Wrapper>
              {questionsFlashcardQuery?.data?.data.length > 0 &&
                router.query.id !== 0 && (
                  <DetailViewTable
                    data={questionsFlashcardQuery?.data?.data}
                    searchKeyword={searchKeyword}
                    isDetailView={false}
                    filters={filters}
                    sort={sort}
                    refetchData={questionsFlashcardQuery.refetch}
                    showOptions={false}
                    disableAnswerOptions={true}
                  />
                )}
            </Wrapper>
          )}
        </Container>
      </div>
    </>
  );
}

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <FlashCard />;
    }
    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticPaths() {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/flashcard");

  return {
    props: { HEAD, BODY },
  };
}

export default function FlashCardPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

const StyledCol = styled(Col)`
  display: flex;
  justify-content: ${(props) => props.position};
`;

const StyledAddQuestionButton = styled(BsButton)`
  height: 40px;
  min-width: 100px;
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
  background-color: #81c2c0 !important;
  border: 1px solid #81c2c0 !important;
  border-radius: 5px;
`;

const FlashCardDetailsWrapper = styled.div`
  width: 100%;
  margin: auto;
  background: #f8f8f8;
  min-height: 110px;
  margin-bottom: 20px;
`;

const StyledFlashDetailsWrapper = styled.div`
  &&& {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
`;

const StyledButtonOutlined = styled(ButtonOutlined)`
  &&& {
    min-height: 40px;
    min-width: 100px;
  }
`;
const StyledHr = styled.hr`
  &&& {
    border-top: 1px solid #969c9d;
    width: 98%;
    margin: auto;
  }
`;

const SelectedQuestionsContainer = styled.div`
  min-height: 150px;
`;

const SelectedQuestionsHeader = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
  color: #81c2c0;
`;

const SelectedQuestionsText = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.0275em;
  color: #393d3e;
  margin-bottom: 10px;
`;

const SelectedQuestionsCardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const StyledInputSearchGroup = styled(InputGroup)`
  &&& {
    width: fit-content;
    margin-left: 0.5rem;
    color: #003647;
    font-family: "Barlow Condensed", sans-serif;
    border: 0.5px solid #003647;
    border-radius: 0.25rem;
    .input-group-text {
      background: none;
      border: none;
      padding: 0.375rem 0.5rem;
    }
  }
`;

const Input = styled(DebounceInput)`
  &&& {
    border: none;
    padding-left: 0;
    margin-right: 150px;
  }
`;

const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
  }
`;

const LoadingIndicator = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #81c2c0;
`;

const Wrapper = styled.div`
  overflow-y: auto;
  max-height: 800px;
  margin-bottom: 30px;
  margin-top: 40px;
`;
