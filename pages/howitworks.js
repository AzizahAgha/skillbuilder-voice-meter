import React from "react";
import Head from 'next/head';
import HeaderSessionWidget from '@components/session-widgets/HeaderSessionWidget';
import { getPageFromWebflow, createReactPageFromHTML } from "../utils/helpers"

export default function HowItWorks({ HEAD, BODY }) {

  const instructions = {
    replace: domNode => {

      if (domNode.attribs && domNode.attribs.id === 'btn-my-account') {
        return <HeaderSessionWidget />;
      }

    }
  }

  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  )
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow('/howitworks');

  return {
    props: { HEAD, BODY },
  };
}