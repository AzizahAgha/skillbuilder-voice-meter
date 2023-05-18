import Head from "next/head";
import React from "react";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import ProfileLayout from "@layouts/ProfileLayout";
import { Container, Row, Col } from "react-bootstrap";
import { Title, SectionTitle, Divider } from "./billing";
import TeamProfileForm from "@components/team-profile/TeamProfileForm";
import SubscriptionDetails from "@components/team-profile/SubscriptionDetails";
import LeaveOrDelete from "@components/team-profile/LeaveOrDelete";
import Authorization from "@contexts/Authorization";
import Error from "@components/error";
import { useTeam } from "@contexts/TeamContext";
import { useAuthUser } from "@contexts/AuthContext";
import { useQuery } from "react-query";
import billingService from "@services/billing.service";

function Team() {
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
      <ProfileLayout className="bs">
        <Container className="mt-5">
          <Row>
            <Col>
              <Title>Team Profile</Title>
            </Col>
          </Row>

          <Row>
            <TeamProfileForm />
          </Row>

          <Divider />

          <Row>
            <SectionTitle>Subscription Details</SectionTitle>
          </Row>
          <Row>
            <SubscriptionDetails
              planDetails={data?.planDetails}
              refetchPlan={refetchPlan}
            />
          </Row>

          <Divider />

          <Row>
            <SectionTitle>Leave or Delete</SectionTitle>
          </Row>
          <Row>
            <LeaveOrDelete />
          </Row>
        </Container>
      </ProfileLayout>
    </Authorization>
  );
}

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <Team />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/team");

  return {
    props: { HEAD, BODY },
  };
}

export default function TeamPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
