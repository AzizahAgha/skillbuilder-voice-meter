import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Button as BsButton } from "react-bootstrap";
import { useTeam } from "@contexts/TeamContext";
import ChangePlanModal from "@components/subscription/ChangePlanModal";
import SubscriptionModal from "@components/subscription/SelectPlanModal";

export default function PlanDetails({ planDetails, refetchPlan }) {
  const { team } = useTeam();
  const [showSub, setShowSub] = useState(false);
  const handleCloseSub = () => setShowSub(false);
  const handleShowSub = () => setShowSub(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const closeModal = (event) => {
    refetchPlan();
    handleClose();
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("paymentStatus") == "success") {
      process.browser
        ? window.flash("Subscription successful!", "success")
        : "";
    }

    if (query.get("paymentStatus") == "failed") {
      process.browser ? window.flash("Payment failed", "danger") : "";
    }
  }, []);

  const RenewalDate = moment(planDetails?.renewalDate).format("MMM DD, YYYY");
  const truncate = (str) => {
    const actualChar = str?.length + str.split(" ").length - 1;
    return actualChar > 100 ? `${str?.substring(0, 97)}...` : str;
  };

  return (
    <div className="d-flex flex-column">
      <Styled_item>
        Your{" "}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {truncate(String(team?.displayName))}
        </span>{" "}
        is on <b>{planDetails?.name || "BETA/FREE"} Plan</b>{" "}
        {planDetails?.type ? `${planDetails.type}` : ""}.
        {planDetails?.stripeSubId !== null &&
        planDetails?.subscriptionStatus === "active" ? (
          <Change_button_small variant="outline-secondary" onClick={handleShow}>
            Change Plan
          </Change_button_small>
        ) : (
          <Change_button_small
            variant="outline-secondary"
            onClick={handleShowSub}
            className="p-0 px-lg-2"
          >
            Subscribe
          </Change_button_small>
        )}
        <ChangePlanModal
          show={show}
          handleClose={closeModal}
          refetchPlan={refetchPlan}
          planDetails={planDetails}
        />
        <SubscriptionModal
          show={showSub}
          handleClose={handleCloseSub}
          planDetails={planDetails}
        />
      </Styled_item>

      {planDetails?.planName ? (
        <>
          <Styled_item>
            You have <b>{planDetails?.totalSeats || "0"} seats</b>{" "}
            {/* {planDetails?.id && ( */}
            <span>
              ({planDetails?.allocatedSeats || "0"} of{" "}
              {planDetails?.totalSeats || "0"} seats allocated).
            </span>
            {/* )} */}
            <span className="mx-2" />
            {planDetails?.name ? (
              <Change_button_small type="submit" onClick={handleShow}>
                Change Team Size
              </Change_button_small>
            ) : (
              <Change_button_small onClick={handleShowSub}>
                Change Team Size
              </Change_button_small>
            )}
          </Styled_item>
          <Styled_item>
            {planDetails?.subscriptionStatus === "canceled" ? (
              <>
                Your Subscription is <b>Cancelled</b> and it will expire on{" "}
                <b>{RenewalDate}</b>
              </>
            ) : (
              <>
                Your plan will renew on&nbsp;<b>{RenewalDate}</b> ,charging your
                credit card&nbsp;<b> ${planDetails?.charges || "0.00"}</b>
              </>
            )}
          </Styled_item>
        </>
      ) : (
        <>
          <Styled_item>
            Your FREE/BETA Plan{" "}
            {new Date(RenewalDate).getTime() < new Date().getTime()
              ? "has expired"
              : "will expire"}{" "}
            on <Strong>{RenewalDate}</Strong>
          </Styled_item>
          <Styled_item>
            You need to&nbsp;<b>Subscribe to a Plan</b>&nbsp;to continue to
            enjoy our services.
          </Styled_item>
        </>
      )}

      <PlanDetails_change_item>
        {planDetails?.stripeSubId !== null &&
        planDetails?.subscriptionStatus === "active" ? (
          <Button
            type="submit"
            variant="outline-secondary"
            onClick={handleShow}
          >
            Change
          </Button>
        ) : (
          <Button variant="outline-secondary" onClick={handleShowSub}>
            Subscribe
          </Button>
        )}
      </PlanDetails_change_item>
    </div>
  );
}

const Strong = styled.span`
  font-weight: bold;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Styled_item = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 32px;
  letter-spacing: 0.02em;
  color: #393d3e;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const PlanDetails_change_item = styled.div`
  grid-area: 1 / 2 / span 3 / span 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 768px) {
    & {
      grid-area: unset;
    }
  }
`;

const Change_button = styled.button`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 30px;
    /* identical to box height */
    letter-spacing: 0.02em;
    color: #81c2c0;
    background: #ffffff;
    border: none;
    box-sizing: border-box;
  }
`;

const Change_button_small = styled.button`
  font-family: Manrope;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 32px;
  /* identical to box height, or 200% */
  letter-spacing: 0.02em;
  color: #81c2c0;
  background: #ffffff;
  border: none;
  box-sizing: border-box;

  @media (max-width: 768px) {
    & {
      display: block;
    }
  }
`;

const Button = styled(BsButton)`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 30px;
    letter-spacing: 0.02em;
    /* color: #81c2c0; */
  }
`;
