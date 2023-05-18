import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TinyLinkPreview from "./TinyLinkPreview";
import { Markup } from "interweave";
// import { extractUrls } from "@utils/helpers";

export default function AnswerViewer({ content }) {
  const [links, setLinks] = useState([]);
  const urls = Array.prototype.slice
    .call(
      new DOMParser()
        .parseFromString(content, "text/html")
        .getElementsByTagName("a")
    )
    .map((item) => item.getAttribute("href"));

  useEffect(() => {
    if (content) {
      let uniqueUrls = {};

      // extractUrls(content)
      urls.forEach((url) => {
        var domain = new URL(url);
        var uniKey =
          domain.hostname.replace("www.", "") + domain.pathname + domain.search;
        uniqueUrls[uniKey] = url;
      });
      setLinks(Object.keys(uniqueUrls).map((item) => uniqueUrls[item]));
      // console.log(links);
    }
  }, [content]);

  return (
    <Wrapper>
      <div className="answer-text">
        <Markup content={content} />
      </div>

      <LinkPreviewWrapper>
        {links.slice(0, 10).map((link, idx) => (
          <TinyLinkPreview key={idx} url={link} />
        ))}
      </LinkPreviewWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: transparent;
  min-height: 100px;
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  font-family: Manrope;
  font-size: 14px;
  word-wrap: anywhere;

  a {
    color: #22aaf2;
  }
`;

const LinkPreviewWrapper = styled.div`
  margin: 0.5rem 0;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`;
