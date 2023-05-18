import React, { useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import Auth0SignIn from "@ui-library/Auth0SignIn";
import { useRouter } from "next/router";
import { useTeam } from "@contexts/TeamContext";
import placeholderTextImg from "@public/images/loginpage-placeholder-text.png";
import styled from "styled-components";
import SkillbuilderLogoDark from "@public/svgs/skillbuilder-logo-dark.svg";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "../utils/helpers";
import { useAuthUser } from "@contexts/AuthContext";
import teamService from "@services/team.service";
import Bus from "@utils/Bus";
export function Login() {
  const router = useRouter();
  const { team, setTeam } = useTeam();
  const { auth, isLoading, handlelogout, user, refetchAuthUser } =
    useAuthUser();

  const [error, setError] = useState("");

  useEffect(() => {
    if (auth?.isAuthenticated && auth?.user) {
      if (auth?.user?.isValidUser) router.push("/detail");
      else if (!user?.data?.lastTeamVisitedId) {
        //if user has no team then create a starter team
        if(!user?.data?.lastTeamVisitedId){
          teamService
          .createStarterTeam()
          .then(async(res) => {
            
            await setTeam(res.data);
            await router.push("/detail");
          })
          .catch((error) => {
            Bus.emit("error", {
              operation: "open",
              error: error.response,
            });
          });
        }
      } else {
        handlelogout();
      }
    }
  }, [auth]);

  return (
    <Container className="bs">
      <Row>
        <Col className="vh-100 d-flex justify-content-center align-items-center">
          <SignInCard>
            <Image src={SkillbuilderLogoDark.src} alt="Skillbuilder" />

            <p className="mt-4"></p>
            <LoginGrid>
              <Auth0SignIn />
            </LoginGrid>

            {error && <Error>{error}</Error>}

            {isLoading && (
              <LoadingWrapper>
                <Spinner animation="border" variant="secondary" />
              </LoadingWrapper>
            )}
          </SignInCard>
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <Image src={placeholderTextImg.src} alt="placeholder text" />
        </Col>
      </Row>
    </Container>
  );
}

const BlankDiv = styled.div`
  min-width: 50px;
  min-height: 20px;
`;
const LoginGrid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  padding: 5px;
  width: 100%;
`;

const SignInCard = styled.div`
  width: 370px;
  height: 250px;
  background: white;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #81c2c0;
  box-sizing: border-box;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1.2rem;
  position: relative;
  p {
    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #393d3e;
  }
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffffe6;
  border-radius: 1rem;
`;

const Error = styled.div`
  color: red;
  margin-top: 0.25rem;
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "login-placeholder") {
      return <Login />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/login");

  return {
    props: { HEAD, BODY },
  };
}

export default function LoginPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
