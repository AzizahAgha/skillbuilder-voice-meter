import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "../utils/helpers";
import GetStartedForm2 from "@components/landingPageForms/GetStartedForm2";
import { useTeam } from "@contexts/TeamContext";
import { useAuthUser } from "@contexts/AuthContext";
import Modal from "react-bootstrap/Modal";
import SkillbuilderLogoDark from "@public/svgs/skillbuilder-logo-dark.svg";
import Auth0SignIn from "@ui-library/Auth0SignIn";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import getConfig from "next/config";
import { useQuery } from "react-query";
import billingService from "@services/billing.service";
import Bus from "@utils/Bus";

export default function Pricing({ HEAD, BODY }) {
  const { auth, isLoading, handlelogout, refetchAuthUser } = useAuthUser();
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { team, refetchTeam } = useTeam();
  const [planSelection, setPlanSelection] = useState(undefined);
  const { publicRuntimeConfig } = getConfig();
  const [priceId, setPriceId] = useState(null);

  const { data: plans, refetch: refetchPlans } = useQuery(
    "plans",
    () => billingService.getPlans(),
    {
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const handleAccessToken = (token) => {
    setAccessToken(token);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const createEventListener = (domNodeId) => {
    let planButton = document.getElementById(domNodeId.toString());

    planButton.addEventListener("click", () => {
      setPlanSelection(domNodeId);
      if (auth.token) {
        routeToPayment({ data: domNodeId, teamId: team?.id, plans: plans });
      } else {
        handleShow();
      }
    });
  };

  const onSuccess = () => {
    refetchAuthUser().then((res1) => {
      if (res1.status === "success") {
        handleClose();
        refetchPlans().then((res2) => {
          refetchTeam().then((res3) => {
            routeToPayment({
              data: planSelection,
              teamId: res3.data.id,
              plans: res2.data,
            });
          });
        });
      } else if (res1.status === "error") {
        setError("Email address not found.");
        handlelogout();
      }
    });
  };

  const routeToPayment = ({ data, teamId, plans }) => {
    const planName = data.toLowerCase().split("-")[2];
    const planType = data.toLowerCase().split("-")[1];

    const priceId = plans
      ?.map((e) => {
        if (e.planName.toLowerCase().includes(planName)) {
          if (planType === "year") {
            return e.yearlyPriceId;
          } else {
            return e.monthlyPriceId;
          }
        }
      })
      .filter((n) => n !== undefined)[0];

    setPriceId(priceId);

    priceId && teamId && document.getElementById("plan-submit-form").submit();
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const instructions = {
    replace: (domNode) => {
      if (domNode.attribs) {
        if (domNode.attribs.id === "form-get-started-org-name") {
          return (
            <div className="bs">
              <StyledForm
                id="plan-submit-form"
                action={`${publicRuntimeConfig.BACKEND_URL}/team/${team?.id}/payments/checkout`}
                method="POST"
              >
                <input
                  name="priceId"
                  value={priceId ? priceId : ""}
                  onChange={handleChange}
                ></input>
              </StyledForm>

              <StyledModal size="md" show={show} onHide={handleClose}>
                <ModalHeader>
                  You need to sign-in to Subscribe to a Plan
                </ModalHeader>
                <Modal.Body>
                  <div className="bs">
                    <SignInCard>
                      <Image
                        src={SkillbuilderLogoDark.src}
                        alt="Skillbuilder"
                      />

                      <p className="mt-4"></p>
                      <LoginGrid>
                        <Auth0SignIn callback={onSuccess} />
                      </LoginGrid>

                      {error && (
                        <Error>
                          {error} Please{" "}
                          <Link href="/" passHref>
                            <a>Sign up</a>
                          </Link>{" "}
                          to continue!
                        </Error>
                      )}

                      {isLoading && (
                        <LoadingWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </LoadingWrapper>
                      )}
                    </SignInCard>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <PlanButton variant="secondary" onClick={handleClose}>
                    Close
                  </PlanButton>
                </Modal.Footer>
              </StyledModal>
              <GetStartedForm2 />
            </div>
          );
        }

        const planArray = [
          "btn-year-pro",
          "btn-year-business",
          "btn-year-enterprise",
          "btn-month-pro",
          "btn-month-business",
          "btn-month-enterprise",
        ];

        if (process.browser) {
          planArray.forEach((e) => {
            if (domNode.attribs.id === e) {
              createEventListener(domNode.attribs.id);
            }
          });
        }

        if (domNode.attribs.id === "btn-my-account") {
          return <HeaderSessionWidget />;
        }
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
  const { BODY, HEAD } = await getPageFromWebflow("/pricing");

  return {
    props: { HEAD, BODY },
  };
}

const StyledModal = styled(Modal)`
  &&& {
    & .modal-content {
      align-items: center;
    }
  }
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

const LoginGrid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  padding: 5px;
  width: 100%;
`;

const BlankDiv = styled.div`
  min-width: 50px;
  min-height: 20px;
`;

const PlanButton = styled.div`
  &&& {
    -webkit-text-size-adjust: 100%;
    box-sizing: border-box;
    display: inline-block;
    padding: 9px 15px;
    color: white;
    border: 0;
    line-height: inherit;
    cursor: pointer;
    padding-right: 20px;
    padding-left: 20px;
    border-style: solid;
    border-width: 3px;
    border-color: #003647;
    border-radius: 5px;
    background-color: #003647;
    font-family: "Barlow Condensed", sans-serif;
    font-size: 18px;
    text-align: center;
    text-decoration: none;
    min-width: 130px;
    align-self: center;

    &:hover {
      background-color: #fff;
      color: #003647;
    }
  }
`;

const ModalHeader = styled(Modal.Header)`
  &&& {
    -webkit-text-size-adjust: 100%;
    box-sizing: border-box;
    margin: 0.67em 0;
    margin-bottom: 10px;
    line-height: 44px;
    margin-top: 20px;
    font-family: "Barlow Condensed", sans-serif;
    color: #003647;
    font-weight: 400;
    text-align: center;
    font-size: 30px;
  }
`;

const StyledForm = styled.form`
  &&& {
    display: none;
  }
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;
