import React, { useState } from "react";
import { Button as BsButton, Table } from "react-bootstrap";
import styled from "styled-components";
import billingService from "@services/billing.service";
import { useQuery } from "react-query";
import getConfig from "next/config";
import { useTeam } from "@contexts/TeamContext";
import moment from "moment";
import Modal from "@ui-library/Modal";

export default function SelectPlanModal({ show, handleClose, planDetails }) {
  const { publicRuntimeConfig } = getConfig();
  const { team } = useTeam();
  const { data: plans } = useQuery("plans", billingService.getPlans);
  const [value, setValue] = React.useState(null);

  const closeModal = (event) => {
    setValue(null);
    handleClose();
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Modal show={show} onHide={closeModal} className="bs" centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            action={`${publicRuntimeConfig.BACKEND_URL}/team/${team?.id}/payments/checkout`}
            method="POST"
          >
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Plans</th>
                  <th>Monthly</th>
                  <th>Yearly</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3}>
                    {planDetails?.subscriptionStatus === "canceled" ? (
                      <label style={{ cursor: "pointer" }}>
                        Your Subscription has been cancelled and your current
                        plan will expire on{" "}
                        {moment(planDetails?.renewalDate).format(
                          "MMM DD, YYYY"
                        )}
                        <br />
                        Choose a new Plan to continue to enjoy our services
                      </label>
                    ) : (
                      <label style={{ cursor: "pointer" }}>
                        Your BETA/FREE plan will expire on{" "}
                        {moment(planDetails?.renewalDate).format(
                          "MMM DD, YYYY"
                        )}
                      </label>
                    )}
                  </td>
                </tr>

                {plans?.map((plan, key) => (
                  <tr key={key}>
                    {plan.monthlyPrice != "0" ? (
                      <>
                        <td>
                          <b>{plan.planName} Plan</b> :- Maximum {plan.maxUsers}{" "}
                          members allowed
                        </td>
                        <td>
                          <label style={{ cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="priceId"
                              value={plan.monthlyPriceId}
                              onChange={handleChange}
                              className="form-check-input"
                            />{" "}
                            {`$${plan.monthlyPrice.toLocaleString("en-US")}`}
                          </label>
                        </td>
                        <td>
                          <label style={{ cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="priceId"
                              value={plan.yearlyPriceId}
                              onChange={handleChange}
                              className="form-check-input"
                            />{" "}
                            {`$${plan.yearlyPrice.toLocaleString("en-US")}`}
                          </label>
                        </td>
                      </>
                    ) : (
                      <></>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              variant="outline-secondary"
              type="submit"
              className="float-end"
              disabled={!value}
            >
              Subscribe
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

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
