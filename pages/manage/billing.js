import ProfileLayout from "@layouts/ProfileLayout";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import { useQuery } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import { useAuthUser } from "@contexts/AuthContext";
import billingService from "@services/billing.service";
import BillingContactForm from "@components/billing/BillingContactForm";
import PlanDetails from "@components/billing/PlanDetails";
import BillingActions from "@components/billing/BillingActions";
import Authorization from "@contexts/Authorization";
import Error from "@components/error";

import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";

function Billing() {
  const { team } = useTeam();
  const { auth } = useAuthUser();

  const { data, refetch: refetchPlan } = useQuery(
    ["billing-info", team?.id],
    () => billingService.get(team.id),
    { enabled: !!team && auth.isAuthenticated }
  );

  return (
    <Authorization
      allow={["admin", "superadmin"]}
      fallback={data && <Error code={401} />}
    >
      <ProfileLayout>
        <Container className="mt-5">
          <Row>
            <Col>
              <Title>Billing</Title>
            </Col>
          </Row>

          <Row>
            <SectionTitle>Plan Details</SectionTitle>
          </Row>
          <Row>
            <PlanDetails
              planDetails={data?.planDetails}
              refetchPlan={refetchPlan}
            />
          </Row>

          <Divider />

          <Row>
            <SectionTitle>Billing Actions</SectionTitle>
          </Row>
          <Row>
            <BillingActions
              cardNumber={
                data?.paymentDetails?.card?.last4
                  ? data.paymentDetails.card.last4
                  : "****"
              }
              email={data?.paymentDetails?.email || "email"}
              planDetails={data?.planDetails}
              refetchPlan={refetchPlan}
            />
          </Row>

          <Divider />

          <Row>
            <SectionTitle>Billing Contact</SectionTitle>
          </Row>
          <Row>
            <BillingContactForm initialValues={data?.billingContactDetails} />
          </Row>

          <Divider />
        </Container>
      </ProfileLayout>
    </Authorization>
  );
}

export const Title = styled.h1`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 600;
    font-size: 55px;
    line-height: 66px;
    /* identical to box height */
    color: #81c2c0;
    margin-bottom: 3.5rem;
  }
`;

export const SectionTitle = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  /* identical to box height */
  letter-spacing: 0.02em;
  color: #003647;
  margin-bottom: 2rem;
`;

export const Divider = styled.hr`
  &&& {
    margin: 3rem auto;
  }
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "placeholder-for-billing") {
      return <Billing />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/billing");

  return {
    props: { HEAD, BODY },
  };
}

export default function BillingPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
