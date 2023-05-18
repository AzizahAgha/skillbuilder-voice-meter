import React from "react";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useTeam } from "@contexts/TeamContext";
import { useAuthUser } from "@contexts/AuthContext";
import AnswerMergeCardView from "@components/answerMerge/answerMergeCardView";

export function AnswerMerge() {
  const { team } = useTeam();
  const { auth } = useAuthUser();
  const router = useRouter();

  const userName = auth?.user?.firstName + " " + auth?.user?.lastName;

  return (
    <div className="bs">
      <DetailPageHeader />

      <StyledContainer>
        <a
          onClick={() => {
            router.push(`/question/${router.query.id}?view=timeline`);
          }}
        >
          <Backbtn>&lt; Cancel & Back to Question {router?.query?.qN}</Backbtn>
        </a>

        <AnswerMergeCardView
          type="answer"
          userName={userName}
          adminName={team?.adminName}
          questionId={router.query.id}
          teamId={team?.id}
          answerId={router?.query?.a}
        />
      </StyledContainer>
    </div>
  );
}

const Backbtn = styled.div`
  cursor: pointer;
  display: inline-block;
  font-family: "Manrope", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #393d3e;
`;

const StyledContainer = styled(Container)`
  &&& {
    max-width: 978px;
  }
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <AnswerMerge />;
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
  const { BODY, HEAD } = await getPageFromWebflow("/answer-merge");

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
