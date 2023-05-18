import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "react-query";
import { Formik, Form as FormikForm } from "formik";
import { Button } from "react-bootstrap";
import * as Yup from "yup";
import "yup-phone";
import userService from "@services/user.service";
import { PhoneInput } from '@ui-library/Form';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { useAuthUser } from "@contexts/AuthContext";

function ProfileContactForm({ list }) {
  const queryClient = useQueryClient();
  const { auth } = useAuthUser();

  const [toggleEdit, setToggleEdit] = useState("readonly");
  
  const mutation_contact = useMutation(
    (id, data) => userService.update_contact(id, data),
    {
      onMutate: (req) => {
        queryClient.setQueryData(["profile", auth?.user?.id], old => {
          return {
            ...old,
            data: {
              ...old.data,
              phone: req.data.contactDetails.phone,
            }
          }
        })
      }
    }
  );

  return (
    <Formik
      enableReinitialize
      initialValues={{
        phone: list?.phone || "",
        email: list?.email || "",
      }}
      validationSchema={Yup.object({
        phone: Yup.string()
          .phone()
          .required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
      })}
      onSubmit={(values) => {
        mutation_contact.mutate({
          id: list.id,
          data: {
            contactDetails: {
              phone: values.phone,
            },
          },
        });
        setToggleEdit("readonly");
      }}
    >
      {(formik) => (
        <FormikForm>
          <ContactGrid>
            <div>
              <ContactInfo className="mb-3">Contact Information</ContactInfo>
              <EmailAddress>
                Your email address is <b>{formik.values.email}</b>
              </EmailAddress>
              <Contact_phone>
                Your phone number is
                <b className='ms-lg-2'>
                  {(toggleEdit === "readonly")
                    ? formatPhoneNumberIntl(formik.values.phone)
                    : <PhoneInput name='phone' />
                  }
                </b>
              </Contact_phone>
            </div>
            <Contact_Change>

              {(toggleEdit === "readonly") ? (
                <ButtonChange
                  type="button"
                  variant="outline-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    setToggleEdit("");
                  }}
                >
                  Change
                </ButtonChange>
              ) : (
                <ButtonChange 
                  type="submit" 
                  variant="outline-secondary"
                  onClick={e => {
                    e.preventDefault();
                    if(formik.dirty)
                      formik.submitForm();
                    else
                      setToggleEdit("readonly");
                  }}
                >
                  Save
                </ButtonChange>
              )}
              
            </Contact_Change>
          </ContactGrid>
        </FormikForm>
      )}
    </Formik>
  );
}

export default ProfileContactForm;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 90% 10%;
  gap: 10px;
  background-color: #ffffff;
  padding: 10px;

  @media(max-width: 768px){
    display: flex;
    flex-direction: column;
  }
`;

const ContactInfo = styled.div`
  grid-column: 1 / 3;
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  /* identical to box height */
  letter-spacing: 0.02em;
  color: #003647;
`;

const EmailAddress = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #393d3e;
  
  @media(max-width: 768px){
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }
`;

const Contact_Change = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  padding-left: 5px;
  letter-spacing: 0.02em;
  color: #81c2c0;
  align-self: end;
`;

const Contact_phone = styled.div`
  grid-column: 1 / 3;
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #393d3e;

  display: flex;
  align-items: center;

  @media(max-width: 768px){
    flex-direction: column;
    margin-bottom: 16px;
    align-items: flex-start;
  }
`;

const ButtonChange = styled(Button)`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 30px;
    letter-spacing: 0.02em;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
`;
