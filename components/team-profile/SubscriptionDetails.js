import React, { useState } from "react";
import { Container, Row, Col, Button as BsButton } from "react-bootstrap";
import styled from "styled-components";
import { useTeam } from "@contexts/TeamContext";
import moment from "moment";
import SelectPlanModal from "../subscription/SelectPlanModal";
import ChangePlanModal from "../subscription/ChangePlanModal";

export default function SubscriptionDetails({ planDetails, refetchPlan }) {
  const { team, refetchTeam } = useTeam();
  const [showSelectPlanModal, setShowSelectPlanModal] = useState(false);
  const handleClosePlanModal = () => setShowSelectPlanModal(false);
  const handleShowPlanModal = () => setShowSelectPlanModal(true);

  const [showChangeModal, setShowChangeModal] = useState(false);
  const handleCloseChangeModal = () => {
    setShowChangeModal(false);
    refetchPlan();
  };
  const handleShowChangeModal = () => setShowChangeModal(true);

  return (
    <Container fluid>
      <Row xs={1} md={2}>
        <Col>
          <SubscriptionItem>
            <b>Plan:</b> {planDetails?.planName || "BETA/FREE"}
            {planDetails?.planType && `(${planDetails?.planType})`}
          </SubscriptionItem>

          {planDetails?.planName ? (
            <>
              <SubscriptionItem>
                <b>Licenses Purchased:</b> {planDetails?.totalSeats || 0}
              </SubscriptionItem>
              <SubscriptionItem>
                <b>Licenses Allocated:</b> {planDetails?.allocatedSeats}
              </SubscriptionItem>
              <SubscriptionItem>
                <b>Renewal Date:</b>{" "}
                {moment(planDetails?.renewalDate).format("MMM DD, YYYY")}
              </SubscriptionItem>
              <Styled_item>
                {planDetails?.subscriptionStatus === "canceled" ? (
                  <>
                    Your Current Subscription is <b>Cancelled</b>
                  </>
                ) : null}
              </Styled_item>
            </>
          ) : (
            <>
              <SubscriptionItem>
                Your FREE/BETA Plan{" "}
                {new Date(planDetails?.renewalDate).getTime() <
                new Date().getTime()
                  ? "has expired"
                  : "will expire"}{" "}
                on{" "}
                <b>
                  {" "}
                  {moment(planDetails?.renewalDate).format("MMM DD, YYYY")}
                </b>
              </SubscriptionItem>
              <SubscriptionItem>
                You need to <b>Subscribe to a Plan</b> to continue to enjoy our
                services.
              </SubscriptionItem>
            </>
          )}
        </Col>

        <Col className="d-flex align-items-center justify-content-end">
          {planDetails?.stripeSubId !== null &&
          planDetails?.subscriptionStatus === "active" ? (
            <Button variant="outline-secondary" onClick={handleShowChangeModal}>
              Change
            </Button>
          ) : (
            <Button variant="outline-secondary" onClick={handleShowPlanModal}>
              Subscribe
            </Button>
          )}
          <ChangePlanModal
            show={showChangeModal}
            handleClose={handleCloseChangeModal}
            // refetchPlan={refetchTeam}
            refetchPlan={refetchPlan}
            planDetails={planDetails}
          />
          <SelectPlanModal
            show={showSelectPlanModal}
            handleClose={handleClosePlanModal}
            planDetails={planDetails}
          />
        </Col>
      </Row>
    </Container>
  );
}

const SubscriptionItem = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 32px;
  /* or 200% */
  letter-spacing: 0.02em;
  color: #393d3e;
`;

const Button = styled(BsButton)`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 30px;
    letter-spacing: 0.02em;
  }
`;

const Styled_item = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 32px;
  /* identical to box height, or 200% */
  letter-spacing: 0.02em;
  color: #393d3e;
`;
