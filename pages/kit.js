import { getPageFromWebflow, createReactPageFromHTML } from "../utils/helpers";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import GetStartedForm2 from "@components/landingPageForms/GetStartedForm2";

export default function KitPage({ HEAD, BODY }) {
  const instructions = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
        return <HeaderSessionWidget />;
      }
      if (
        domNode.attribs &&
        domNode.attribs.id === "form-get-started-org-name"
      ) {
        return <GetStartedForm2 />;
      }
    },
  };

  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/kit");

  return {
    props: { HEAD, BODY },
  };
}
