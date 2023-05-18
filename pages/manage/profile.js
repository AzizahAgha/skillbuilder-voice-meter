import React, { useEffect } from "react";
import userService from "@services/user.service";
import ProfileLayout from "@layouts/ProfileLayout";
import ProfileDetailsForm from "@components/profile/ProfileDetailsForm";
import styled from "styled-components";
import { useAuthUser } from "@contexts/AuthContext";
import { useQuery } from "react-query";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import ProfileContactForm from "@components/profile/ProfileContactForm";
import ProfilePrivacyForm from "@components/profile/ProfilePrivacyForm";
import { useRouter } from "next/router";
import Authorization from "@contexts/Authorization";
import Error from "@components/error";
import Alert from "react-bootstrap/Alert";
import { Container } from "react-bootstrap";

const MyProfilePage = () => {
  // const { auth } = useAuthUser();
  const router = useRouter();
  const { auth, auth: { user: { isSuperAdmin } = {} } = {} } = useAuthUser();

  const {
    data: list = "",
    isLoading,
    refetch: refetchProfile,
  } = useQuery(
    ["profile", router.query?.userId ?? auth?.user?.id],
    () => userService.get(router.query?.userId ?? auth?.user?.id),
    {
      enabled: !!router.query?.userId || auth.isAuthenticated,
    }
  );
  // console.log(auth.user);

  return (
    <Authorization allow={["member"]} fallback={list && <Error code={401} />}>
      <ProfileLayout>
        <div className="bs">
          <Container>
            {isSuperAdmin && router.query?.fromAccountsToUsersToProfile && (
              <StyledAlert key="primary" variant="primary">
                You are viewing this account as a Super Admin
              </StyledAlert>
            )}
          </Container>
          <br />
          <Container>
            <ProfileDetailsForm
              refetchProfile={refetchProfile}
              list={list && list.data}
            />
            
            <EndOfSection />
            <br />
           
            <ProfileContactForm list={list && list.data} />
            <br />
            <EndOfSection />
            <br />
            {list && <ProfilePrivacyForm list={list && list.data} />}
          </Container>
        </div>
      </ProfileLayout>
    </Authorization>
  );
};

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <MyProfilePage />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/profile");

  return {
    props: { HEAD, BODY },
  };
}

export default function ProfilePage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

const EndOfSection = styled.div`
  border-top: 2px solid #969c9d;
`;

const StyledAlert = styled(Alert)`
  &&& {
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 14px;
    // display: inline-block;
    font-weight: 400;
    color: #ffffff;
    background-color: #81c2c0;
  }
`;
