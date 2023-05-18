import Head from "next/head";
// import getConfig from 'next/config';
import GetStartedForm1 from "@components/landingPageForms/GetStartedForm1";
import GetStartedForm2 from "@components/landingPageForms/GetStartedForm2";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";

// const { publicRuntimeConfig: { WEBFLOW_URL, GOOGLE_CLIENT_ID, BACKEND_URL } } = getConfig();

import React from "react";
import { getPageFromWebflow, createReactPageFromHTML } from "../utils/helpers";

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "form-get-started") {
      return <GetStartedForm1 />;
    }

    if (domNode.attribs && domNode.attribs.id === "form-get-started-org-name") {
      return <GetStartedForm2 />;
    }

    // if (domNode.attribs && domNode.attribs.id === 'schedule-demo') {
    //   return <></>;
    // }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export default function Home({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/home-new");

  return {
    props: { HEAD, BODY },
  };
}
