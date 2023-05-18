import React, { useState } from "react";
import styled from "styled-components";
import subscriptionService from "@services/subscription.service";
import { useTeam } from "@contexts/TeamContext";
import { loadStripe } from "@stripe/stripe-js";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import { Modal } from "react-bootstrap";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51KWlanGSBC0p1FR4DOPCSyZIZMarj9rVIZKwqIuYSLOFkUlYmDzlIsg1F8VwYuB8MhX53lk395tBpaB2OOYI3fc800wPoxh7pg"
);

export default function BillingActions({
  cardNumber,
  email,
  planDetails,
  refetchPlan,
}) {
  const { team } = useTeam();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  function handleConfirmation(e) {
    e.preventDefault();
    setShow(true); // Here we change state
  }

  const changePaymentMethod = async (teamId) => {
    const { data } = await subscriptionService.changePaymentMethodCreateSession(
      teamId
    );
    let sessionId = data.sessionId;
    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });
  };

  return (
    <div>
      <Styled_item>
        <b>
          Future charges will be billed to the card{" "}
          {cardNumber?.slice(-4)?.padStart(12, "*")}.
        </b>
        <span className="mx-2" />
        {cardNumber !== "****" && (
          <Change_button_small
            type="submit"
            onClick={() => {
              changePaymentMethod(team.id);
            }}
          >
            Change payment method
          </Change_button_small>
        )}
      </Styled_item>
      <Styled_item>
        Billing emails are sent to <b>{email} </b>
      </Styled_item>
      <br />
      {planDetails?.subscriptionStatus === "canceled" ||
      planDetails?.planName === null ? null : (
        <>
          <Cancel_Subscription onClick={handleConfirmation}>
            Cancel Subscription
          </Cancel_Subscription>
          <Modal show={show} onHide={handleClose} className="bs" centered>
            <Modal.Body style={{ padding: 0 }}>
              <ConfirmAlert
                title="Cancel Subscription"
                message={`Are you sure you want to cancel,${team?.displayName}?`}
                doneLabel="Cancel Subscription"
                cancelLabel="I changed my mind"
                onCancel={handleClose}
                onDone={() => {
                  subscriptionService
                    .cancelSubscription(team.id)
                    .then((res) => {
                      refetchPlan();
                      handleClose();
                      process.browser
                        ? window.flash(
                            "Plan Cancelled successfully!",
                            "success"
                          )
                        : "";
                    })
                    .catch((error) => {
                      handleClose();
                      process.browser
                        ? window.flash("Error Occured", "danger")
                        : "";
                    });
                }}
              />
            </Modal.Body>
          </Modal>
          <Styled_item>
            <b>Note:</b> Do not cancel your subscription if you just want to
            change team size or change payment method.
          </Styled_item>
        </>
      )}
    </div>
  );
}

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
`;

const Cancel_Subscription = styled.button`
  &&& {
    font-family: Manrope;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 32px;
    /* identical to box height, or 200% */
    letter-spacing: 0.02em;
    color: #1f5462;
    background: none;
    padding-left: 0;
  }
`;
