import ProfileLayout from "@layouts/ProfileLayout";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { createReactPageFromHTML, getPageFromWebflow } from "@utils/helpers";
import InvoiceTable from "@components/dataTables/InvoicesTable";
import { useTeam } from "@contexts/TeamContext";
import teamService from "@services/team.service";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { Spinner } from "react-bootstrap";
import Authorization from "@contexts/Authorization";
import Error from "@components/error";
import moment from "moment";

function Invoices() {
  const { team } = useTeam();
  const { ref, inView } = useInView({ threshold: 1 });

  const {
    data,
    isLoading,
    isFetched,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["team-invoices", team?.id],
    async ({ pageParam = null }) =>
      await teamService.getAllInvoices(team?.id, pageParam),
    {
      // enabled: false,
      enabled: !!team,
      keepPreviousData: true,
      refetchOnMount: false,
      getNextPageParam: (lastPage, pages) =>
        lastPage?.pagination?.nextInvoiceId ?? undefined,
    }
  );

  useEffect(() => {
    if (inView) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, [inView]);

  const count = useMemo(
    () => (data?.pages?.flatMap((page) => page.data) || []).length,
    [data]
  );

  return (
    <Authorization
      allow={["admin", "superadmin"]}
      fallback={data && <Error code={401} />}
    >
      <ProfileLayout className="bs">
        {/* <h1>invoices</h1> */}
        <Page_Header>
          <Header className="me-3">Invoices</Header>
          <Count>{count} total</Count>
        </Page_Header>
        {isFetched && count > 0 && (
          <InvoiceTable
            data={data?.pages?.flatMap((page) => page.data) || []}
          />
        )}
        {isFetched && count <= 0 && team?.subscriptionDetails?.expirationDate && (
          <Message className="text-center mb-5">
            No Current Invoices, next billing cycle ends{" "}
            <b>
              {" "}
              {moment(team?.subscriptionDetails?.expirationDate).format(
                "MMM DD, YYYY"
              )}
            </b>{" "}
          </Message>
        )}
        {isLoading && <Header className="text-center mb-5">Loading</Header>}

        {isFetchingNextPage && (
          <LoadingIndicator>
            <Spinner
              animation="border"
              role="status"
              variant="secondary"
              className="me-1"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            Loading...
          </LoadingIndicator>
        )}

        {hasNextPage && (
          <span style={{ visibility: "hidden" }} ref={ref}>
            intersection observer marker
          </span>
        )}
      </ProfileLayout>
    </Authorization>
  );
}

const LoadingIndicator = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #81c2c0;
`;

const Header = styled.div`
  font-family: Barlow Condensed, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 55px;
  line-height: 66px;
  color: #81c2c0;
  align-self: center;

  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 29px;
  }
`;

const Page_Header = styled.div`
  display: flex;
  margin-left: 10%;
  align-items: flex-end;
  @media (max-width: 768px) {
    margin-left: 5%;
  }
`;

const Count = styled.span`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #393d3e;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const Message = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 32px;
  /* or 200% */
  letter-spacing: 0.02em;
  color: #393d3e;
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <Invoices />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/invoice");

  return {
    props: { HEAD, BODY },
  };
}

export default function InvoicesPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
