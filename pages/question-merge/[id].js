import React, { useEffect, useState } from "react";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import Link from "next/link";
import styled from "styled-components";
import questionService from "@services/question.service";
import { useRouter } from "next/router";
import MergeCardView from "@components/questionMerge/MergeCardView";
import { Container } from "react-bootstrap";
import { useTeam } from "@contexts/TeamContext";
import { useQuery } from "react-query";
import { useAuthUser } from "@contexts/AuthContext";
import Bus from "@utils/Bus";

export function QuestionMerge() {
  const { team } = useTeam();
  const { auth } = useAuthUser();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: question, isError } = useQuery(
    ["question", { teamId: team?.id, questionId: router.query.id }],
    () =>
      questionService.get({
        teamId: team?.id,
        questionId: router.query.id,
      }),
    {
      enabled: !!team?.id,
      onSuccess: (data) => {
        setIsLoaded(true);
      },
      onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
    }
  );

  const userName = auth?.user?.firstName + " " + auth?.user?.lastName;

  return (
    <div className="bs">
      <DetailPageHeader />

      <StyledContainer>
        <Link href="/detail" passHref>
          <a>
            <Backbtn>&lt; Cancel & back</Backbtn>
          </a>
        </Link>
        {isLoaded && (
          <MergeCardView
            type="question"
            parentID={question?.data?.id}
            parentData={question?.data}
            userName={userName}
            adminName={team?.adminName}
            questionId={router.query.id}
            teamId={team?.id}
          />
        )}
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
      return <QuestionMerge />;
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
  const { BODY, HEAD } = await getPageFromWebflow("/question-merge");

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
