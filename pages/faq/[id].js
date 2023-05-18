import React, { useState, useContext } from "react";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import Head from "next/head";
import styled from "styled-components";
import { useQuery } from "react-query";
import flashcardService from "@services/flashcard.service";
import { useRouter } from "next/router";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Markup } from "interweave";
import AttachmentList from "@components/mediarecorder/AttachmentList";
import { useAuthUser } from "@contexts/AuthContext";
import SkillbuilderLogoDark from "@public/svgs/skillbuilder-logo-dark.svg";
import Auth0SignIn from "@ui-library/Auth0SignIn";
import { Spinner } from "react-bootstrap";

export function Faq() {
  const router = useRouter();
  const [error, setError] = useState("");

  const { auth, isLoading, handlelogout, refetchAuthUser } = useAuthUser();
  const { data: faqData } = useQuery("FaqView", () =>
    flashcardService.faqView({ id: router?.query?.id })
  );
  function CustomToggle({ children, eventKey, callback }) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    );

    const isCollapsed = activeEventKey === eventKey;

    return (
      <StyledButton onClick={decoratedOnClick}>
        {isCollapsed ? (
          <div style={{ width: "100%" }}>
            <div
              className="d-inline-block"
              style={{ width: "80%", textAlign: "left" }}
            >
              {children}
            </div>
            <div
              className="d-inline-block"
              style={{ width: "20%", textAlign: "right" }}
            >
              <AiOutlineMinus size={20} color="#393D3E" />
            </div>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <div
              className="d-inline-block"
              style={{ width: "80%", textAlign: "left" }}
            >
              {children}
            </div>
            <div
              className="d-inline-block"
              style={{ width: "20%", textAlign: "right" }}
            >
              <AiOutlinePlus size={20} color="#393D3E" />
            </div>
          </div>
        )}
      </StyledButton>
    );
  }

  const onSuccess = () => {
    refetchAuthUser().then((res1) => {
      if (res1.status === "success") {
        setError("");
      } else if (res1.status === "error") {
        setError("Email address not found.");
        handlelogout();
      }
    });
  };

  const FAQPage = () => {
    return (
      <>
        <Header>{faqData?.flashcardSets?.setTitle}</Header>
        {faqData?.questionsData?.map((question, index) => (
          <StyledAccordion
            defaultActiveKey="0"
            key={`StyledAccordionQ${index}`}
          >
            <Card>
              <Card.Header>
                <CustomToggle eventKey={index.toString()}>
                  {question.questionText}
                </CustomToggle>
              </Card.Header>
              {question?.answers.length > 0 ? (
                question?.answers.map((answer, ansIndex) => (
                  <Accordion.Collapse
                    eventKey={index.toString()}
                    key={`StyledAccordionA${ansIndex}`}
                  >
                    <StyledCardBody
                      last={
                        ansIndex === question?.answers?.length - 1
                          ? "true"
                          : "false"
                      }
                    >
                      <Markup content={answer?.answerText} />
                      <AttachmentList
                        attachments={
                          answer?.attachment?.length !== 0
                            ? answer?.attachment
                            : null
                        }
                        faqView={true}
                      />
                    </StyledCardBody>
                  </Accordion.Collapse>
                ))
              ) : (
                <Accordion.Collapse eventKey={index.toString()}>
                  <StyledCardBody last="true">
                    No answers found. Check back soon or please get in touch for
                    this answer.
                  </StyledCardBody>
                </Accordion.Collapse>
              )}
            </Card>
          </StyledAccordion>
        ))}
        {faqData && (
          <StyledFooter>
            FAQs powered by &nbsp;{" "}
            <a href="https://skillbuilder.io/" style={{ color: "#000" }}>
              SkillBuilder.io
            </a>{" "}
          </StyledFooter>
        )}
      </>
    );
  };

  return (
    <Wrapper className="bs">
      {faqData?.flashcardSets?.faqAccess === true ? (
        auth?.token ? (
          <>{FAQPage()}</>
        ) : (
          <>
            <HeaderMessage>
              The FAQ page&apos;s privacy settings is private and only logged in
              users can view this page
            </HeaderMessage>
            <SignInCard>
              <Image src={SkillbuilderLogoDark.src} alt="Skillbuilder" />

              <p className="mt-4"></p>
              <LoginGrid>
                <Auth0SignIn callback={onSuccess} />
              </LoginGrid>

              {error && <Error>{error}</Error>}

              {isLoading && (
                <LoadingWrapper>
                  <Spinner animation="border" variant="secondary" />
                </LoadingWrapper>
              )}
            </SignInCard>
            <StyledFooter>
              FAQs powered by &nbsp;{" "}
              <a href="https://skillbuilder.io/" style={{ color: "#000" }}>
                SkillBuilder.io
              </a>{" "}
            </StyledFooter>
          </>
        )
      ) : (
        <>{FAQPage()}</>
      )}
    </Wrapper>
  );
}

const SignInCard = styled.div`
  margin: auto;
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
  position: relative;
  p {
    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #393d3e;
  }
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffffe6;
  border-radius: 1rem;
`;

const Error = styled.div`
  color: red;
  margin-top: 0.25rem;
`;

const LoginGrid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  padding: 5px;
  width: 100%;
`;

const BlankDiv = styled.div`
  min-width: 50px;
  min-height: 20px;
`;

const StyledFooter = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 60px;
  text-align: right;
  color: #000000;
  margin-top: 50px;
`;

const Wrapper = styled.div`
  width: 80%;
  height: 100%;
  margin: auto;
  margin-bottom: 200px;
`;

const Header = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 60px;
  line-height: 72px;
  text-align: center;
  color: #003647;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderMessage = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 72px;
  text-align: center;
  color: #003647;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledAccordion = styled(Accordion)`
  .card {
    border: none;
    border-bottom: 1px solid #c4c4c4;

    .card-header {
      background-color: #fff;
      font-family: "Manrope";
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 25px;
      color: #393d3e;
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1rem;
    }
  }
`;

const StyledCardBody = styled(Card.Body)`
  margin: auto;
  width: 95%;
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #393d3e;
  border-bottom: ${(props) =>
    props.last === "true" ? "none" : "1px dashed #969c9d;"};
`;

const StyledButton = styled.button`
  width: 100%;
  background-color: Transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  min-width: 30px;
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;
const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <Faq />;
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
  const { BODY, HEAD } = await getPageFromWebflow("/flashcard-faq");

  return {
    props: { HEAD, BODY },
  };
}

export default function FlashCardFAQ({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
