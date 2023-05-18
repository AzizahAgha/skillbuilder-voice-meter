import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button as BsButton,
  ButtonGroup,
  Col,
  Container,
  InputGroup,
  Row,
} from "react-bootstrap";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import FiltersModal from "@components/filters/FiltersModal";
import { IoSearchOutline } from "react-icons/io5";
import { useTeam } from "@contexts/TeamContext";
import { useQuery } from "react-query";
import questionService from "@services/question.service";
import answerService from "@services/answer.service";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import { useRouter } from "next/router";
import { DebounceInput } from "react-debounce-input";
import AddUserIcon from "@public/icons/add-user";
import QuestionTable from "@components/dataTables/CardViewQuestionTable/Table";
import AnswerTable from "@components/dataTables/CardViewAnswerTable/Table";
import Timeline from "@components/timeline";
import Link from "next/link";
import InvitesPopup from "@components/invites/InvitesPopup";
import InvitationsSentPopup from "@components/invites/InvitationsSentPopup";
import { useAuthUser } from "@contexts/AuthContext";
import { SelectionMode, useAppContext } from "@contexts/AppContext";
import { download, generateQsCsv, printQuestions } from "@utils/helpers";
import { pdf } from "@react-pdf/renderer";
import TableViewTemplate from "@layouts/pdf-templates/TableViewTemplate";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import {
  createReactPageFromHTML,
  getPageFromWebflow,
} from "../../utils/helpers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Tooltip from "@ui-library/Tooltip";
import RelatedQuestions from "@components/relatedQuestions";
import Error from "@components/error";
import Authorization from "@contexts/Authorization";
import { FaPlus } from "react-icons/fa";
import useFavouriteQuestionMutation from "@hooks/useFavouriteQuestionMutation";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineHistory,
  MdStar,
  MdStarOutline,
} from "react-icons/md";
import MergedHistoryPopup from "@components/questionMerge/MergedHistoryPopup";
import { GiBinoculars as WatchIcon } from "react-icons/gi";
import QWatchPopup from "@components/watchQuestion/watchPopup";
import TokensContextProvider from "@contexts/TokensContext";

export function Questions() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState();
  const [isTimelineView, setTimelineView] = useState(false);
  const { team } = useTeam();
  const { auth } = useAuthUser();
  const { inSelectMode, selectionMode, setSelectionMode } = useAppContext();
  const [showQWatchPopup, setshowQWatchPopup] = useState(false);

  const [showInvitesPopup, setShowInvitesPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  useEffect(() => {
    if (!inSelectMode) {
      if (selectionMode === SelectionMode.CSV) {
        downloadCSV(true);
      } else if (selectionMode === SelectionMode.PDF) {
        downloadPDF(true);
      } else if (selectionMode === SelectionMode.PRINT) {
        printQ(true);
      }
      setSelectionMode(null);
    }
  }, [selectionMode]);

  useEffect(() => {
    if (router.query?.view) setTimelineView(router.query.view === "timeline");
  }, [router.query.view]);

  // Get all questions of the team
  const {
    data: question,
    isError,
    refetch: refetchData,
  } = useQuery(
    ["question", { teamId: team?.id, questionId: router.query.id }],
    () =>
      questionService.get({
        teamId: team?.id,
        questionId: router.query.id,
      }),
    {
      enabled: !!team?.id,
    }
  );

  // Then get all answers of selected question
  const { data: { data: answers = [] } = {}, refetch: refetchCardView } =
    useQuery(
      [
        "all-answers",
        {
          teamId: team?.id,
          questionId: question?.data?.id,
          filters,
          answerType: "card",
          type: "all",
        },
      ],
      () =>
        answerService.getAll({
          params: { answerType: "card", type: "all" },
          teamId: team?.id,
          questionId: question?.data?.id,
          filters,
        }),
      {
        refetchOnMount: true,
        enabled: !!question,
      }
    );

  async function downloadCSV() {
    const answers = await answerService.getAllAnswers(team?.id, [
      question?.data?.id,
    ]);
    const blob = generateQsCsv([question?.data], answers);
    download(blob, `${team.teamName}-skillbuilderio.csv`);
  }

  async function downloadPDF() {
    const PDFDoc = pdf(
      <TableViewTemplate
        data={[question?.data]}
        teamId={team?.id}
        onReady={async () => {
          const blob = await PDFDoc.toBlob();
          download(blob, `${team.teamName}-skillbuilderio.pdf`);
        }}
      />
    );
  }

  async function printQ() {
    printQuestions([question?.data], team?.id);
  }

  useEffect(() => {
    if (router.query.fromInvite) {
      router.reload();
    }
  }, []);

  const mutation = useFavouriteQuestionMutation(question?.data);
  const toggleFavourite = useCallback(() => {
    mutation.mutate({
      teamId: team.id,
      questionId: question?.data?.id,
      favorite: !question?.data?.isFavorite,
    });
  }, [mutation, team?.id, question?.data]);

  const [showMergedHistoryPopup, setShowMergedHistoryPopup] = useState(false);

  return (
    <Authorization allow={["member"]} fallback={<Error code={401} />}>
      <div className="bs">
        <TokensContextProvider>
          <DetailPageHeader />

          {question && (
            <Container>
              <Link href="/detail" passHref>
                <a>
                  <TextButton>&lt; All Questions</TextButton>
                </a>
              </Link>

              <Row className="d-none d-lg-flex">
                <Col className="d-flex align-items-center justify-content-start">
                  {question?.pagination?.prevQuestionId && (
                    <NavLink>
                      <Link
                        href={`/question/${question?.pagination?.prevQuestionId}?view=timeline`}
                        passHref
                      >
                        <a>
                          <MdKeyboardArrowLeft color="#393D3E88" size={16} />{" "}
                          Question {question?.data.number - 1}
                        </a>
                      </Link>
                    </NavLink>
                  )}
                </Col>
                <Col className="d-flex align-items-center justify-content-center">
                  <div className="d-flex align-items-center">
                    <QuestionTxt className="px-2 m-0 d-inline-block">
                      Question {question?.data.number}
                    </QuestionTxt>
                    <span
                      onClick={toggleFavourite}
                      className="d-inline-block px-1"
                      style={{ cursor: "pointer" }}
                    >
                      {question?.data.isFavorite ? (
                        <MdStar color="#FDE87B" size={28} />
                      ) : (
                        <MdStarOutline color="#969C9D" size={28} />
                      )}
                    </span>
                    {question?.data?.mergeId && (
                      <span
                        className="d-inline-block px-1"
                        style={{ cursor: "pointer" }}
                      >
                        <MergedHistoryPopup
                          show={showMergedHistoryPopup}
                          setShow={setShowMergedHistoryPopup}
                          teamId={team?.id}
                          mergeId={question?.data?.mergeId}
                          mergeType="Question"
                        />
                        <MdOutlineHistory
                          color="#969C9D"
                          size={28}
                          onClick={() => setShowMergedHistoryPopup(true)}
                        />
                      </span>
                    )}
                    {question?.data?.watchCount !== 0 && (
                      <span
                        className="d-inline-block px-1"
                        style={{ cursor: "pointer" }}
                      >
                        <QWatchPopup
                          show={showQWatchPopup}
                          setShow={setshowQWatchPopup}
                          teamId={team?.id}
                          questionId={question?.data?.id}
                          refetchData={refetchData}
                        />
                        <WatchIcon
                          size={28}
                          color="#969C9D"
                          onClick={() => setshowQWatchPopup(true)}
                        />
                      </span>
                    )}
                  </div>
                </Col>
                <Col className="d-flex align-items-center justify-content-end">
                  {question?.pagination?.nextQuestionId && (
                    <NavLink>
                      <Link
                        href={`/question/${question?.pagination?.nextQuestionId}?view=timeline`}
                        passHref
                      >
                        <a>
                          Question {question?.data.number + 1}{" "}
                          <MdKeyboardArrowRight color="#393D3E88" size={16} />
                        </a>
                      </Link>
                    </NavLink>
                  )}
                </Col>
              </Row>
              <QuestionTable
                data={[question?.data]}
                pagination={question?.pagination}
                refetchData={refetchData}
              />

              <Row className="mb-5 align-items-center mt-5" lg={3}>
                <Col className="d-flex">
                  <ButtonGroup className="me-2">
                    <StyledButton
                      active={isTimelineView}
                      onClick={() =>
                        router.push(
                          `/question/${question?.data?.id}?view=timeline`,
                          undefined,
                          { scroll: false }
                        )
                      }
                    >
                      Timeline
                    </StyledButton>
                    <StyledButton
                      active={!isTimelineView}
                      onClick={() =>
                        router.push(
                          `/question/${question?.data?.id}?view=list`,
                          undefined,
                          { scroll: false }
                        )
                      }
                    >
                      List
                    </StyledButton>
                  </ButtonGroup>
                  <FiltersModal
                    onFiltersChange={setFilters}
                    hideQuestionFilters
                    question={question?.data}
                  />
                </Col>

                <Col className="d-flex">
                  <StyledInputGroup>
                    <InputGroup.Text>
                      <IoSearchOutline color="#003647" size={20} />
                    </InputGroup.Text>

                    <Input
                      type="search"
                      minLength={2}
                      value={searchKeyword}
                      debounceTimeout={300}
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
                          <IoIosCloseCircleOutline color="#969C9D" size={20} />
                        </ClearButton>
                      </Tooltip>
                    )}
                  </StyledInputGroup>
                </Col>

                {/* INVITE TO ANSWER POPUP */}
                {question && (
                  <>
                    <InvitesPopup
                      show={showInvitesPopup}
                      handleClose={() => setShowInvitesPopup(false)}
                      showConfirmationPopup={() =>
                        setShowConfirmationPopup(true)
                      }
                      teamId={team?.id}
                      questionId={question?.data?.id}
                      showCloseBtn
                      inviteType="Question"
                      inviteMessage={`
                  <div style='overflow-y: auto;max-height: 200px;'>
                  <b>Question: <br />
                  ${question?.data?.text}</b>
                  </div>
                  <br /><br />
                  Enter your question by heading <a href="__INVITE_LINK__">HERE</a> where you’ll be able to give us your POV.
                  <br /><br />
                  Thanks for your help! <br />
                  ${auth?.user?.firstName} ${auth?.user?.lastName || ""}.
                `}
                    />

                    <InvitationsSentPopup
                      show={showConfirmationPopup}
                      handleClose={() => setShowConfirmationPopup(false)}
                      onSendMoreInvites={() => setShowInvitesPopup(true)}
                    />
                  </>
                )}
                {/**************************/}

                <Col className="d-none d-lg-block">
                  <InviteButton
                    variant="primary"
                    onClick={() => setShowInvitesPopup(true)}
                  >
                    <AddUserIcon className="me-1" />
                    Invite to Answer
                  </InviteButton>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      document.getElementById("btn-new-add-question").click()
                    }
                  >
                    + Add Answer
                  </Button>
                </Col>
              </Row>

              <div className="d-block d-lg-none mb-5">
                {isTimelineView && <Timeline question={question?.data} />}
              </div>

              <div className="d-flex d-lg-none flex-row justify-content-between mb-2">
                <Label>Answers ({answers.length})</Label>
                <div className="flex-grow-1" />
                <Button
                  variant="secondary"
                  onClick={() =>
                    document.getElementById("btn-new-add-question").click()
                  }
                >
                  <FaPlus />
                </Button>
                <InviteButton
                  variant="primary"
                  onClick={() => setShowInvitesPopup(true)}
                >
                  <AddUserIcon />
                </InviteButton>
              </div>

              <Row>
                {isTimelineView && (
                  <Col lg={3} className="d-none d-lg-block">
                    <Timeline question={question?.data} answers={answers} />
                  </Col>
                )}
                <Col lg={9} className={!isTimelineView ? "w-100 " : ""}>
                  {answers && (
                    <AnswerTable
                      data={answers}
                      searchKeyword={searchKeyword}
                      question={question?.data}
                      isTimelineView={isTimelineView}
                      refetchCardView={refetchCardView}
                    />
                  )}
                </Col>
              </Row>

              <Row className="mt-5">
                <RelatedQuestions questionId={question?.data?.id} />
              </Row>
            </Container>
          )}
        </TokensContextProvider>
        {isError && <Error code={404} />}
      </div>
    </Authorization>
  );
}

const StyledButton = styled(ButtonOutlined)`
  width: 80px;
`;

const StyledInputGroup = styled(InputGroup)`
  &&& {
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
  }
`;

const QuestionTxt = styled.p`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 50px;
  line-height: 60px;
  color: #1f5462;
`;

const NavLink = styled.div`
  a {
    font-family: "Barlow Condensed", sans-serif;
    border: 1px solid #888b8b;
    padding: 8px 12px;
    border-radius: 4px;
    text-decoration: none !important;
    color: #888b8b !important;
    font-size: 20px;
    line-height: 1.1;
    svg {
      vertical-align: baseline;
    }
  }
`;

const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
  }
`;

const Button = styled(BsButton)`
  &&& {
    background: #81c2c0;
    border: 1px solid #81c2c0;
    border-radius: 5px;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #ffffff !important;
    float: right;

    &:hover,
    &:active,
    &:focus {
      color: #ffffff !important;
      background: #8ed0ce;
      border-color: #8ed0ce;
      outline: none;
      box-shadow: none;
    }
  }
`;

const InviteButton = styled(BsButton)`
  &&& {
    background: #1f5462;
    border: 1px solid #1f5462;
    border-radius: 5px;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #ffffff;
    float: right;
    margin-left: 10px;

    &:hover,
    &:active,
    &:focus {
      background: #1f5462dd;
      border-color: #1f5462dd;
      outline: none;
      box-shadow: none;
    }
  }
`;

const TextButton = styled.span`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: #81c2c0;
  cursor: pointer;
  margin-bottom: 14px;
  display: inline-block;

  @media (max-width: 992px) {
  }
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "card-placeholder") {
      return <Questions />;
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
  const { BODY, HEAD } = await getPageFromWebflow("/card");

  return {
    props: { HEAD, BODY },
  };
}

export default function DetailPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

const Label = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  color: #1f5462;
`;
