import React from "react";
import Head from "next/head";
import {
  getPageFromWebflow,
  createReactPageFromHTML,
  replaceDomNode,
} from "../utils/helpers";

export default function Privacy({ HEAD, BODY }) {
  const instructions = {
    replace: (domNode) => replaceDomNode(domNode),
  };

  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/blog-1");

  return {
    props: { HEAD, BODY },
  };
}
