import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import Header from "@ui-library/AskAnswerInviteHeader";
import styled from "styled-components";
import { useRouter } from "next/router";
import SkillbuilderLogoDark from "@public/svgs/skillbuilder-logo-dark.svg";
import InvitesPopup from "@components/invites/InvitesPopup";
import InvitationsSentPopup from "@components/invites/InvitationsSentPopup";
import Question from "@ui-library/Question";
import Answer from "@ui-library/Answer";
import Table from "@ui-library/Table";
import { useMutation } from "react-query";
import teamService from "@services/team.service";
import questionService from "@services/question.service";
import { Rules as PriorityRiskRules } from "@ui-library/Priority";
import { useAuthUser } from "@contexts/AuthContext";
import { useTeam } from "@contexts/TeamContext";
import csv from "@public/svgs/csv.svg";
import striptags from "striptags";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import Auth0SignIn from "@ui-library/Auth0SignIn";

import {
  createReactPageFromHTML,
  getPageFromWebflow,
  download,
  Width,
} from "@utils/helpers";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import { useMediaQuery } from "react-responsive";
import QA from "@ui-library/QA";
import { toCSV } from "react-csv/lib/core";
import Bus from "@utils/Bus";

const SignInCard = styled.div`
  &&& {
    width: 370px;
    height: 250px;
    background: white;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;

    background: #ffffff;
    border: 1px solid #81c2c0;
    box-sizing: border-box;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    padding: 1.2rem;
    margin-bottom: 1.5rem;

    h3 {
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 500;
      font-size: 25px;
      line-height: 30px;
      text-align: center;
      color: #003647;
      margin-top: 1rem;
    }

    p {
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 19px;
      text-align: center;
      color: #393d3e;
    }
  }
`;

const Title = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
  margin-bottom: 19px;
  color: #81c2c0;
  text-align: center;
`;

const Caption = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #393d3e;
  margin-bottom: 28px;
`;

const Description = styled.span`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #393d3e;
`;

const Steps = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: #003647;
  text-align: center;
`;

const DownloadCSV = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 29px;
  margin-bottom: 100px;

  // width: 40%;
  // margin-left: auto ;
  // margin-right: auto ;

  @media (max-width: 1200px) {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  & span {
    cursor: pointer;
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    color: #393d3e;
    margin-left: 11px;
  }
`;

const HeaderOptionsWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ExitButton = styled(Button)`
  &&& {
    width: 170px;
    height: 43px;
    flex-basis: 60%;

    background: #003647;
    border-color: #003647;
    border-radius: 5px;
    margin-right: 1rem;
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    @media (min-width: 1400px) {
      flex-basis: 30%;
    }
  }
`;

const headers = [
  {
    name: "#",
    width: "51px",
    stretched: true,
    renderer: (item, row) => (
      <div className="w-100 text-center pt-2">
        {`${parseInt(row) + 1}`.padStart(2, "0")}
      </div>
    ),
  },
  {
    name: "Your Questions",
    stretched: true,
    renderer: ({ question, importance, frequency }) => (
      <Question
        frequency={frequency}
        importance={importance}
        question={question}
      />
    ),
  },
  {
    name: "Your Answers",
    stretched: true,
    renderer: ({ answer, differentiation, confidence }) => (
      <Answer
        differentiation={differentiation}
        confidence={confidence}
        answer={answer}
      />
    ),
  },
];

const headersMobile = [
  {
    name: "Your Questions",
    stretched: true,
    renderer: (
      { question, importance, frequency, differentiation, confidence, answer },
      row
    ) => (
      <QA
        srNo={`${parseInt(row) + 1}`.padStart(2, "0")}
        frequency={frequency}
        importance={importance}
        question={question}
        differentiation={differentiation}
        confidence={confidence}
        answer={answer}
      />
    ),
  },
];

export function Invite() {
  const router = useRouter();
  const [showInvitesPopup, setShowInvitesPopup] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const { auth } = useAuthUser();
  const { team, setTeam, refetchTeam } = useTeam();
  const [teamName, setTeamName] = useState("team");
  const [showExitConfirmBox, setShowExitConfirmBox] = useState(false);
  const isTabletOrMobile = useMediaQuery({ maxWidth: Width.mobile });

  const questionMutation = useMutation(
    ({ teamId, questions }) => questionService.create(teamId, questions),
    {
      onSuccess: () => {
        localStorage.removeItem("questionnaire");
        localStorage.removeItem("questions");
        localStorage.removeItem("ORG");
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const onTeamMutationSuccess = (data) => {
    setShowInvitesPopup(true);
    setTeam(data);
    questionMutation.mutate({
      teamId: data.id,
      questions: formatQuestionsForSaving(questions),
    });
  };

  const teamMutation = useMutation((teamData) => teamService.create(teamData), {
    onSuccess: onTeamMutationSuccess,
    onError: (error) => {
      Bus.emit("error", { operation: "open", error: error.response });
    },
  });

  useEffect(() => {
    if (auth.isAuthenticated) setShowInvitesPopup(true);
  }, [auth]);

  useEffect(() => {
    try {
      const localData = localStorage.getItem("questions");

      setTeamName(localStorage.getItem("teamName"));

      if (localData) {
        const { questions } = JSON.parse(localData).values;
        setQuestions(Array.isArray(questions) > 0 ? questions : []);
      } else if (!auth.isAuthenticated) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  }, [auth.isAuthenticated, router]);

  const onLoginSuccess = () => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");
    teamMutation.mutate({ teamName, displayName });
  };

  const formatQuestionsForSaving = (questions) => ({
    questions: questions.map((val, idx) => ({
      questionText: val.question,
      frequency: val.frequency,
      importance: Number(val.importance),
      priority: PriorityRiskRules.Q[val.frequency][val.importance].label,
      answer:
        striptags(val.answer) !== ""
          ? {
              answerText: val.answer,
              confidence: Number(val.confidence),
              differentiation: Number(val.differentiation),
              risk: PriorityRiskRules.A[val.differentiation][val.confidence]
                .label,
            }
          : undefined,
    })),
  });

  const formatToDownload = () => {
    const now = new Date().toISOString();
    const data = questions.map((val, idx) => [
      idx + 1,
      striptags(val.question),
      auth?.firstName ?? "",
      val.frequency ?? 1,
      val.importance,
      PriorityRiskRules.Q[val.frequency ?? "Always"][val.importance ?? 1].label,
      striptags(val.answer),
      auth?.firstName ?? "",
      PriorityRiskRules.A[val.differentiation ?? 1][val.confidence ?? 1].label,
      val.confidence,
      val.differentiation,
      now,
    ]);
    data.unshift([
      "QuestionID",
      "Question",
      "Author",
      "Frequency",
      "Importance",
      "Priority",
      "Answer",
      "Author",
      "Risk",
      "Confidence",
      "Differentiation",
      "Date Created",
    ]);
    download(
      new Blob([toCSV(data)], { type: "text/csv" }),
      `${teamName ?? "team"}-skillbuilderio.csv`
    );
    return true;
  };

  const onExit = () => {
    // localStorage.clear();
    router.push("/");
  };

  return (
    <div className="bs">
      <Header
        component={
          <>
            {!auth.isAuthenticated && !isTabletOrMobile && (
              <HeaderOptionsWrapper>
                <ExitButton onClick={() => setShowExitConfirmBox(true)}>
                  Exit Without Saving
                </ExitButton>
                <LoginGrid top>
                  <Auth0SignIn callback={onLoginSuccess} />
                </LoginGrid>
              </HeaderOptionsWrapper>
            )}
          </>
        }
      />

      <Modal
        show={showExitConfirmBox}
        onHide={() => setShowExitConfirmBox(false)}
        centered
      >
        <Modal.Body style={{ padding: 0 }}>
          <ConfirmAlert
            title="Are you sure you want to exit?"
            message="You will loose all your work!"
            doneLabel="Confirm"
            onDone={onExit}
            onCancel={() => setShowExitConfirmBox(false)}
          />
        </Modal.Body>
      </Modal>

      <Container className="mb-4">
        <TextButton onClick={() => router.push("/answer")}>
          &lt; Back to Answers
        </TextButton>
        <Row className="justify-content-center">
          <Steps>Step 3 of 3</Steps>
          <Title>Sign In, Save Your Work & Collaborate</Title>
          <Caption>
            Congratulations! You&apos;ve started your Q&A database for{" "}
            {auth.isAuthenticated
              ? team?.displayName
              : process.browser && localStorage.getItem("teamName")}
            !
            <br />
            <Description>
              Sign in with Google to save and activate your FREE trial
              <br />
              or download your questions and answers now.
            </Description>
            <br />
            <br />
            If you do not sign in, your work will NOT be saved when you exit.
          </Caption>

          {!auth.isAuthenticated && (
            <SignInCard>
              <Image src={SkillbuilderLogoDark.src} alt="Skillbuilder" />
              <h3>Get 30 Days Free</h3>
              <p>
                Login with Google and you can edit, add, and collaborate for 30
                days for free. Plus, you’ll be able to invite unlimited
                colleagues to collaborate!
              </p>

              <div>
                <LoginGrid>
                  <Auth0SignIn callback={onLoginSuccess} />
                </LoginGrid>
                <BlankDiv> </BlankDiv>
              </div>
            </SignInCard>
          )}

          <InvitesPopup
            show={showInvitesPopup}
            showCloseBtn
            onCloseBtn={() => {
              refetchTeam();
              router.push("/detail");
            }}
            handleClose={() => setShowInvitesPopup(false)}
            showConfirmationPopup={() => setShowConfirmationPopup(true)}
            teamId={auth.isAuthenticated ? team?.id : teamMutation?.data?.id}
            showPromoText
            isSignup
          />

          <InvitationsSentPopup
            show={showConfirmationPopup}
            handleClose={() => {
              setShowConfirmationPopup(false);
              router.push("/detail");
            }}
            onSendMoreInvites={() => setShowInvitesPopup(true)}
          />

          <DownloadCSV>
            <span onClick={formatToDownload}>
              <Image src={csv.src} alt="csv" />
              <span>Download your work as a CSV file </span>
            </span>
          </DownloadCSV>
        </Row>

        <Row>
          <Col>
            <Title>
              Questions and Answers your colleagues will see when they login for
              FREE
            </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              headers={isTabletOrMobile ? headersMobile : headers}
              showHeader={true}
              data={questions}
            />
          </Col>
        </Row>

        {isTabletOrMobile && !auth.isAuthenticated && (
          <Wrapper>
            <Footer>
              <FooterButton
                className="me-4"
                background={"#969C9D"}
                onClick={() => setShowExitConfirmBox(true)}
              >
                Exit Without Saving
              </FooterButton>
              <DownloadCSV onClick={formatToDownload}>
                <Image src={csv.src} alt="csv" />
                <span>Download your work as a CSV file </span>
              </DownloadCSV>
            </Footer>
          </Wrapper>
        )}
      </Container>
    </div>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const FooterButton = styled(Button)`
  margin-bottom: 0;
  align-self: center;
  width: 90%;
`;

const Footer = styled.div`
  position: fixed;
  background: white;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  padding: 8px 20px;
  width: 100%;
  box-shadow: 0px -26px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 1224px) {
    z-index: 1;
  }
`;

const TextButton = styled.span`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #969c9d;
  cursor: pointer;
  margin-bottom: 43px;
  display: inline-block;
`;
const BlankDiv = styled.div`
  min-width: 50px;
  min-height: 20px;
`;
const LoginGrid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  padding: 5px;
  @media (min-width: 1400px) {
    width: ${(props) => (props.top ? "52%" : "100%")};
  }
  width: ${(props) => (props.top ? "130%" : "100%")};
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;
const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "invite-placeholder") {
      return <Invite />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export default function InvitePage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/invite");

  return {
    props: { HEAD, BODY },
  };
}
