import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { Formik, useField } from "formik";
import FormObserver from "@components/filters/FormObserver";
import userService from "@services/user.service";
import { Button } from "react-bootstrap";

function ProfilePrivacyForm({ list }) {
  const mutation_privacy = useMutation((id, data) => {
    userService.update_privacy(id, data);
  });

  const [flag, setFlag] = useState(false);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        fullName: list?.privacyPreferences?.display_full_name,
        department: list?.privacyPreferences?.display_department,
        profilePic: list?.privacyPreferences?.display_profile_pic,
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <DisplayInfoGrid>
            <DetailsInfo_item_header>
              Privacy Preferences
            </DetailsInfo_item_header>
            <FormObserver
              onChange={(values) => {
                //flag added to prevent initial page load API call
                if (list.id && flag === true) {
                  mutation_privacy.mutate({
                    id: list.id,
                    data: {
                      privacyDetails: {
                        displayFullName: values.fullName,
                        displayDepartment: values.department,
                        displayProfilePic: values.profilePic,
                      },
                    },
                  });
                } else {
                  setFlag(true);
                }
              }}
            />

            <Switch label="Full Name" name="fullName" />
            <Switch label="Department" name="department" />
            <Switch label="Profile Pic" name="profilePic" />
          </DisplayInfoGrid>
          <Note>
            <b>Note:</b> Refresh page to reflect changes to your privacy
            preferences
          </Note>
        </form>
      )}
    </Formik>
  );
}

export default ProfilePrivacyForm;

const Switch = ({ label = "", name = "", props }) => {
  const [field] = useField({ name, type: "checkbox" });

  return (
    <>
      <DetailsInfo_items>{label}</DetailsInfo_items>
      <DetailsInfo_items_wrapper>
        <Flex_items $isBold={!field.value}>No</Flex_items>
        <Flex_items>
          <InputWrapper>
            <Toggle type="checkbox" {...field} {...props} />
            <Slider />
          </InputWrapper>
        </Flex_items>
        <Flex_items $isBold={field.value}> Yes</Flex_items>
      </DetailsInfo_items_wrapper>
    </>
  );
};

const DisplayInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 55% 45%;
  grid-template-rows: auto auto auto auto;
  gap: 10px;
  background-color: #ffffff;
  padding: 10px;
  width: 25%;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const DetailsInfo_item_header = styled.div`
  grid-column: 1 / span 2;
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  letter-spacing: 0.02em;
  color: #003647;
`;

const DetailsInfo_items = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 47px;
  letter-spacing: 0.02em;
  color: #393d3e;
`;

const DetailsInfo_items_wrapper = styled.div`
  display: flex;
  word-wrap: no-wrap;
  justify-content: space-around;
`;

const Flex_items = styled.span`
  align-self: center;
  font-family: Manrope;
  font-style: normal;
  font-weight: ${(props) => (props.$isBold ? "bold" : "normal")};
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
`;

const Toggle = styled.input`
  position: absolute;
  // left: -9999px;
  // top: -9999px;
  appearance: none;
  display: none;
  visibility: hidden;
  &:checked + span {
    background-color: #003647;

    &:before {
      left: calc(100% - 2px);
      transform: translateX(-100%);
    }
  }

  &:focus + span {
    box-shadow: 0 0 0 2px rgba(129, 194, 192, 1);
  }

  &:focus:checked + span {
    box-shadow: 0 0 0 2px rgba(129, 194, 192, 1);
  }
`;

const InputWrapper = styled.label`
  position: relative;
`;

const Slider = styled.span`
  display: flex;
  cursor: pointer;
  width: 40px;
  height: 25px;
  border-radius: 100px;
  background-color: #ececec;
  position: relative;
  transition: background-color 0.2s box-shadow 0.2s;

  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 21px;
    height: 21px;
    border-radius: 21px;
    transition: 0.2s;
    background: #81c2c0;
    box-shadow: 0 2px 4px 0 rgba(0, 35, 11, 0.2);
  }
`;
const Submit = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 90%;
`;
const ButtonChange = styled(Button).attrs(() => ({
  variant: "default",
}))`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 30px;
    padding-left: 0px;
    letter-spacing: 0.02em;
    color: #81c2c0;
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
`;

const Note = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #393d3e;
  margin-bottom: 20px;
`;
