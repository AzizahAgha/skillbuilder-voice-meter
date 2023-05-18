import React from "react";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Form,
  Button as BsButton,
  Spinner,
  FormGroup,
} from "react-bootstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import * as Yup from "yup";
import "yup-phone";
import { useMutation, useQueryClient } from "react-query";
import billingService from "@services/billing.service";
import { useTeam } from "@contexts/TeamContext";
import billingContactDetailsTransformer from "@transformers/billingContactDetails.transformer";
import {
  InputField,
  PhoneInput,
  CountrySelect,
  StateSelect,
} from "@ui-library/Form";
import { getCode } from "country-list";
import isValidZipcode from "is-valid-zipcode";

export default function BillingContactForm({ initialValues }) {
  const defaultValues = {
    firstName: "",
    lastName: "",
    companyName: "",
    phone: "",
    address: "",
    unit: "",
    city: "",
    state: "",
    country: "",
    taxId: "",
    isCompanyAddress: false,
    zipcode: "",
  };

  const queryClient = useQueryClient();
  const { team } = useTeam();
  const mutation = useMutation((data) => billingService.update(team.id, data), {
    onMutate: (req) => {
      queryClient.setQueryData(["billing-info", team?.id], (old) => {
        return {
          ...old,
          billingContactDetails: billingContactDetailsTransformer(
            req.billingContactDetails
          ),
        };
      });
    },
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues || defaultValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        mutation.mutate({
          billingContactDetails: {
            blFirstName: values.firstName,
            blLastName: values.lastName,
            blCompanyName: values.companyName,
            blPhone: values.phone,
            blAddress: values.address,
            blUnit: values.unit,
            blCity: values.city,
            blState: values.state,
            blCountry: values.country,
            blTaxId: values.taxId,
            isCompanyAddress: values.isCompanyAddress,
            blZipCode: values.zipcode,
          },
        });
      }}
    >
      {(formik) => (
        <FormikForm>
          <Container fluid className="p-0">
            <Row xs={1} sm={1} md={3} className="g-4">
              <Col>
                <InputField name="firstName" label="First Name" />
              </Col>
              <Col>
                <InputField name="lastName" label="Last Name" />
              </Col>
              <Col>
                <InputField name="companyName" label="Company Name" />
              </Col>
              <Col>
                <PhoneInput name="phone" label="Phone Number" />
              </Col>
              <Col>
                <InputField name="address" label="Street Address" />
              </Col>
              <Col>
                <InputField name="unit" label="Suite/Unit" />
              </Col>

              <Col>
                <CountrySelect name="country" label="Country" />
              </Col>
              <Col>
                <StateSelect
                  name="state"
                  label="State"
                  country={formik.values?.country}
                  disableWhenEmpty={true}
                />
              </Col>
              <Col>
                <InputField name="city" label="City" />
              </Col>

              <Col>
                <InputField
                  name="zipcode"
                  label="ZIP Code"
                  maxLength={
                    formik.errors.zipcode ? null : formik?.values?.zipcode?.length
                  }
                  disabled={!formik?.values?.country}
                />
              </Col>
              <Col>
                <InputField name="taxId" label="VAT/Tax ID (Optional)" />
              </Col>
              <Col></Col>

              <Col className="d-flex align-items-end">
                <Field
                  as={Styled_Checkbox}
                  label="Company address is the same as billing contact."
                  name="isCompanyAddress"
                  type="checkbox"
                  id="company-address-same"
                />
              </Col>
              <Col></Col>

              <Col className="d-flex align-items-end justify-content-end">
                <Button
                  type="submit"
                  variant="outline-secondary"
                  disabled={!formik.dirty || mutation.isLoading}
                >
                  {mutation.isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Col>
            </Row>
          </Container>
        </FormikForm>
      )}
    </Formik>
  );
}

const Styled_Checkbox = styled(Form.Check)`
  &&& {
    font-family: Manrope;
    letter-spacing: 0.02em;
    color: #393d3e;
    display: flex;
    align-items: center;

    input {
      height: 20px;
      width: 20px;
      margin-right: 0.25rem;
    }

    label {
      font-weight: 400 !important;
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

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Too short")
    .max(50, "Must be 50 characters or less")
    .trim()
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short")
    .max(50, "Must be 50 characters or less")
    .trim()
    .required("Required"),
  companyName: Yup.string()
    .min(2, "Too Short")
    .max(50, "Must be 50 characters or less")
    .trim()
    .required("Required"),
  phone: Yup.string().phone().required("Required"),
  address: Yup.string()
    .min(2, "Too short")
    .max(50, "Must be 50 characters or less")
    .trim()
    .required("Required"),
  unit: Yup.string()
    // .min(2, "Too short")
    .max(50, "Must be 50 characters or less")
    .trim(),
  city: Yup.string()
    .min(2, "Too short")
    .max(50, "Must be 50 characters or less")
    .trim()
    .required("Required"),
  state: Yup.string()
    .min(2, "Too short")
    .max(100, "Invalid URL")
    .trim()
    .required("Required"),
  country: Yup.string()
    .min(2, "Too short")
    .max(50, "Invalid phone number")
    .trim()
    .required("Required"),
  zipcode: Yup.string()
    .test({
      message: "Invalid ZipCode",
      test: function (value) {
        if (value) {
          return isValidZipcode(value, getCode(this.parent.country));
        }
        return false;
      },
    })
    .required("Required"),
  taxId: Yup.string()
    .min(2, "Too short")
    .max(50, "Invalid phone number")
    .trim(),
});
