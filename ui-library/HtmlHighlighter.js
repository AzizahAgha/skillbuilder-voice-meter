import React from "react";
import styled from "styled-components";
import parse from "html-react-parser";

function HtmlHighlighter({ answerHtml, searchKeyword }) {
  const reactElements = parse(
    answerHtml.replaceAll(searchKeyword, `<mark>${searchKeyword}</mark>`)
  );

  return <StyledMark>{reactElements}</StyledMark>;
}

export default HtmlHighlighter;

const StyledMark = styled.div`
  mark {
    background-color: #fde87b;
  }
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #393d3e;
  word-wrap: anywhere;
`;
