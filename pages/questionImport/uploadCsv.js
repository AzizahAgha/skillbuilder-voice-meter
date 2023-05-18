import React from "react";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import DragAndDropFile from "@components/uploadCSV/DragAndDropFile";

export function UploadCsv() {
  return (
    <div className="bs">
      <DetailPageHeader />
      <StyledContainer>
        <Link href="/detail" passHref>
          <a>
            <Backbtn>&lt; Cancel & back to Questions</Backbtn>
          </a>
        </Link>
        <DragAndDropFile />
      </StyledContainer>
    </div>
  );
}

const StyledContainer = styled(Container)`
  &&& {
    max-width: 978px;
    min-height: 500px;
  }
`;

const Backbtn = styled.div`
  cursor: pointer;
  display: inline-block;
  font-family: "Manrope", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #393d3e;
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <UploadCsv />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/question-import");

  return {
    props: { HEAD, BODY },
  };
}

export default function QuestionImport({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
