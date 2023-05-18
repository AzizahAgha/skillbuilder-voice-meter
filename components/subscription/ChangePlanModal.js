import React, { useState } from "react";
import { Button as BsButton, Table, Spinner } from "react-bootstrap";
import styled from "styled-components";
import billingService from "@services/billing.service";
import getConfig from "next/config";
import { Formik, Field, Form } from "formik";
import { useTeam } from "@contexts/TeamContext";
import subscriptionService from "@services/subscription.service";
import { useQuery, useQueryClient } from "react-query";
import Modal from "@ui-library/Modal";

// const changePlan = (teamId, priceId) => {
//   subscriptionService.changeSubscriptionPlan(teamId, priceId);
// };

export default function ChangePlanModal({
  show,
  handleClose,
  triggerRerender,
  refetchPlan,
  planDetails,
}) {
  const { publicRuntimeConfig } = getConfig();
  const { team } = useTeam();
  const { data: plans } = useQuery("plans", billingService.getPlans);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} className="bs" centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Change Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              priceId: planDetails?.planPrice || "",
            }}
            onSubmit={(values) => {
              setIsLoading(true);
              subscriptionService
                .changeSubscriptionPlan(team.id, values.priceId)
                .then((res) => {
                  // queryClient.invalidateQueries("billing-info");
                  setTimeout(() => refetchPlan(), 2000);
                  // refetchPlan();
                  process.browser
                    ? window.flash("Plan changed successfully!", "success")
                    : "";
                })
                .catch((err) =>
                  process.browser ? window.flash("Error Occured", "danger") : ""
                )
                .finally(() => {
                  setIsLoading(false);
                  handleClose();
                });
            }}
          >
            {({ values, dirty, isSubmitting }) => (
              <Form>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Plans</th>
                      <th>Monthly</th>
                      <th>Yearly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans?.map((plan, key) => (
                      <tr key={key}>
                        {plan.monthlyPrice != "0" ? (
                          <>
                            <td>
                              <b>{plan.planName} Plan</b> :- Maximum{" "}
                              {plan.maxUsers} members allowed
                            </td>
                            <td>
                              <label style={{ cursor: "pointer" }}>
                                <Field
                                  type="radio"
                                  name="priceId"
                                  value={plan.monthlyPriceId}
                                  className="form-check-input"
                                />{" "}
                                {`$${plan.monthlyPrice.toLocaleString(
                                  "en-US"
                                )}`}
                              </label>
                            </td>
                            <td>
                              <label style={{ cursor: "pointer" }}>
                                <Field
                                  type="radio"
                                  name="priceId"
                                  value={plan.yearlyPriceId}
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
                  disabled={!dirty || isSubmitting || isLoading}
                  type="submit"
                  className="float-end"
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                      Changing Plan...
                    </>
                  ) : (
                    "Change Plan"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
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

    display: flex;
    align-items: center;
  }
`;
