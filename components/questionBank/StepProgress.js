import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import LoginCard from "@ui-library/LoginCard";
import Checkbox from "@ui-library/Checkbox";
import { Button as BsButton, Form } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import Button from "@ui-library/Button";

export default function StepProgress({
  teamNameSuggestionMutation,
  handleKeyPress,
  suggestions,
  saveForm,
  progressStep,
  setProgress,
  teamName,
  selectedQ,
  onLoginSuccess,
  error,
  checkedState,
  handleOnChange,
  setteamName,
  auth,
  handleSubmit,
  teamMutationLoading,
  questionMutationLoading,
}) {
  const [getStarted, setGetStarted] = useState(false);

  useEffect(() => {
    const myteam = localStorage.getItem("teamName");
    setteamName(localStorage.getItem("teamName"));
    let availableDiv = document.getElementById("step3Login");
    if (availableDiv) {
      if (myteam?.trim().length > 1 && myteam) {
        document.getElementById("step3Login").classList.remove("showOverlay");
      }
    }
  }, []);

  return (
    <>
      <FormGroupTeam className={progressStep == 1 ? "activeStep" : ""}>
        <Formlabel>Enter Your Team&apos;s name</Formlabel>
        <input
          type="text"
          value={teamName && teamName != "" ? teamName : ""}
          name="displayName"
          placeholder="Type your organization’s name here e.g., ACME CO - Sales"
          required
          onChange={(e) => saveForm(e)}
          onKeyDown={handleKeyPress}
          minLength={3}
          maxLength={100}
          onFocus={() => setProgress(1)}
        />
        {teamNameSuggestionMutation?.isLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-1"
            variant="secondary"
          />
        )}

        {suggestions && suggestions.length > 0 && (
          <FormGroup>
            <Form.Label className="text-warning">
              A team name with the exact same name already exists. Please change
              the name or select one of the below three options or create a
              unique team name.
            </Form.Label>
            {suggestions.map((suggestion, idx) => (
              <FormCheck
                key={idx}
                type="radio"
                name="teamName"
                id={`suggestion-${idx}`}
                value={suggestion}
                label={suggestion}
                onChange={(e) => saveForm(e)}
                required
              />
            ))}
          </FormGroup>
        )}
      </FormGroupTeam>

      <FormGroupQuestions className={progressStep == 2 ? "activeStep" : ""}>
        <Formlabel>Select A Few Starter questions</Formlabel>

        <div className="d-block qBank">
          {selectedQ &&
            selectedQ.map((qb, index) => (
              <>
                <Checkbox
                  className="form-check"
                  id={`custom-checkbox-${qb.qBankId}`}
                  name={`custom-checkbox-${qb.qBankId}`}
                  label={qb.question}
                  checked={checkedState[qb.qBankId]}
                  onChange={(e) => handleOnChange(e, qb.qBankId, qb.question)}
                />
              </>
            ))}
        </div>
      </FormGroupQuestions>
      <FormGroupLogin className={progressStep == 3 ? "activeStep" : ""}>
        {auth?.token ? (
          <>
            {/* <Formlabel>You are now Logged in</Formlabel> */}
            <WelcomeWrapper>
              <ProfileImage
                id="profile-pic-landing-page"
                name="profile-pic-landing-page"
                src={auth?.user?.avtarUrl || "/images/default-user-avatar.jpg"}
                width={80}
                height={80}
              />
              <WelcomeName>
                Welcome <br /> {auth?.user?.firstName}
              </WelcomeName>
            </WelcomeWrapper>
            <ButtonContainer>
              <Button
                type="submit"
                disabled={
                  !teamNameSuggestionMutation?.isLoading &&
                  selectedQ.length > 0 &&
                  teamName.trim() !== "" &&
                  (suggestions?.length > 0
                    ? document?.getElementById("suggestion-0")?.checked ||
                      document?.getElementById("suggestion-1")?.checked ||
                      document?.getElementById("suggestion-2")?.checked
                    : true)
                    ? false
                    : true
                }
                onClick={() => {
                  handleSubmit();
                  setGetStarted(true);
                }}
              >
                {!getStarted ? (
                  <> Get Started</>
                ) : (
                  <LoadingWrapper>
                    Loading
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                      // variant="secondary"
                      color="#fff"
                    />
                  </LoadingWrapper>
                )}
              </Button>
            </ButtonContainer>
          </>
        ) : (
          <>
            <Formlabel>Sign in to continue & Invite Colleagues</Formlabel>
            <LoginCardWrapper className="d-flex d-lg-flex" id="step3Login">
              <LoginCard onSuccess={onLoginSuccess} isLanding={true} />
              {error && <Error>{error}</Error>}
            </LoginCardWrapper>
          </>
        )}
      </FormGroupLogin>
    </>
  );
}

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WelcomeWrapper = styled.div`
  display: flex;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 20px 20px 20px;
`;

const ButtonContainer = styled.div`
  &&& {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 11px;
  }
`;

const WelcomeName = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 1.2;
  margin-left: 15px;
  color: #052f3c;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #81c2c0;
`;

const FormGroup = styled(Form.Group)`
  &&& {
    margin-bottom: 1rem;
    padding: 0 18px;
    input {
      font-size: 0.8rem;
      background-color: #e0e0e0;
    }
    label {
      font-family: "Manrope", sans-serif;
    }
  }
`;

const Error = styled.div`
  color: red;
  margin-top: 0.25rem;
`;

const FormGroupTeam = styled(Form.Group)`
  &&& {
    margin-bottom: 1.5rem;
    position: relative;
    padding: 0.2rem;
    border: 1px solid #c4c4c4;
    border-radius: 5px;
    input {
      padding: 6px 18px;
      font-size: 0.8rem;
      border: none !important;
      width: 100%;
      outline: none;
      box-shadow: none;
      font-family: "Manrope", sans-serif;
      font-weight: 400;
      font-size: 14px;
    }
    .spinner-border {
      position: absolute;
      right: 10px;
      bottom: 16px;
    }
  }
`;

const FormCheck = styled(Form.Check)`
  &&& {
    input {
      float: none;
      padding: 8px;
      margin-right: 0.5rem;
      width: initial;
      &:checked[type="radio"] {
        background: #81c2c0;
      }
      &:focus {
        border-color: none;
        box-shadow: none;
      }
    }
  }
`;

const FormGroupQuestions = styled(Form.Group)`
  &&& {
    margin-bottom: 1.5rem;
    position: relative;
    border: 1px solid #c4c4c4;
    border-radius: 5px;
  }
  .qBank {
    margin: 6px 12px 0;
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 20px;
    .form-check {
      border-bottom: 1px solid #c4c4c4;
      padding-bottom: 10px;
      padding-top: 6px;
      padding-left: 1.5rem;
      width: 100%;
      margin: 0 !important;
      label {
        margin-left: 0.6rem;
        font-family: "Manrope", sans-serif;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
      }
      &:last-child {
        border: none;
      }
    }
  }
`;
const FormGroupLogin = styled(Form.Group)`
  &&& {
    border-radius: 5px;
    position: relative;
    padding: 0.2rem;
    border: 1px solid #c4c4c4;
  }
  .card {
    border: none !important;
    box-shadow: none !important;
  }
`;

const Formlabel = styled(Form.Label)`
  font-family: "Manrope";
  display: block !important;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 25px;
  text-transform: capitalize;
  color: #052f3c;
  padding: 5px 18px 0;
  margin: 0 !important;
`;

const LoginCardWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &.showOverlay {
    position: relative;
    pointer-events: none;
    margin-top: 5px;
    &:after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999;
    }
  }
`;
