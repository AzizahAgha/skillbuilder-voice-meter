import React, { useState } from "react";
import * as yup from "yup";
import styled from "styled-components";
import { Form } from "react-bootstrap";
import { Button as BsButton } from "react-bootstrap";
import { useRouter } from "next/router";
import teamService from "@services/team.service";
import { Form as FormikForm, Formik, Field } from "formik";
import { useMutation } from "react-query";
import { Spinner } from "react-bootstrap";
import { useAsyncDebounce } from "react-table";
import Bus from "@utils/Bus";
import { useAuthUser } from "@contexts/AuthContext";
import { useTeam } from "@contexts/TeamContext";

export default function GetStartedForm1() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState(null);
  const { auth } = useAuthUser();
  const { setTeam } = useTeam();

  const teamNameSuggestionMutation = useMutation(
    (teamName) => teamService.suggestions(teamName),
    {
      onSuccess: (res) => setSuggestions(res),
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const teamMutation = useMutation((teamData) => teamService.create(teamData), {
    onSuccess: (data) => {
      setTeam(data);
    },
    onError: (error) => {
      Bus.emit("error", { operation: "open", error: error.response });
    },
  });

  const handleSubmit = ({ displayName, teamName }) => {
    if (auth?.user) {
      if (teamName.trim() === "") {
        teamName = displayName;
      }

      teamMutation
        .mutateAsync({ teamName, displayName })
        .then(() => router.push("/detail"));
    } else {
      localStorage.setItem("ORG", displayName);
      localStorage.setItem("teamName", teamName || displayName);
      localStorage.setItem("answers", JSON.stringify([]));

      const questions = Array.from({ length: 10 }).map(() => ({
        question: "",
        frequency: "Sometimes",
        importance: 1,
        confidence: 1,
        differentiation: 1,
      }));
      localStorage.setItem(
        "questionnaire",
        JSON.stringify({ values: { questions } })
      );

      // console.log();
      router.push("/ask");
    }
  };

  const handleKeyPress = useAsyncDebounce((event) => {
    const value = event.target.value.replace(/^\s+|\s+$/gm, "");
    const teamName = value;
    if (teamName) {
      teamNameSuggestionMutation.mutate(teamName);
    }
  });

  return (
    <Formik
      initialValues={{
        displayName: "",
        teamName: "",
      }}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      <FormikForm className="bs">
        <Container className="mb-3">
          <Title>
            Enter your organization&apos;s name to get started for <b>free.</b>
          </Title>

          <FormGroup className="d-block d-lg-flex text-center">
            <Field
              as={Form.Control}
              name="displayName"
              type="text"
              placeholder="Your Organization's Name"
              required
              onKeyDown={handleKeyPress}
              maxLength="100"
            />

            <Button
              className="mt-3 mt-lg-0"
              type="submit"
              onClick={handleKeyPress}
              disabled={teamNameSuggestionMutation?.isLoading}
            >
              {teamNameSuggestionMutation?.isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Please Wait...
                </>
              ) : (
                <> Get Started</>
              )}
            </Button>
          </FormGroup>

          {/* <Icon>
            <Image src={newsletterIcon} alt='newsletter' height={60} width={60} />
          </Icon> */}
          {teamNameSuggestionMutation?.isLoading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-1"
              variant="primary"
            />
          )}

          {suggestions && suggestions.length > 0 && (
            <FormGroup controlId="teamName" className="flex-column">
              <Form.Label className="text-danger">
                A team name with the exact same name already exists. Please
                change the name or select one of the below three options or
                create a unique team name.
              </Form.Label>

              <FormCheckWrapper>
                {suggestions.map((suggestion, idx) => (
                  <Field
                    key={idx}
                    as={FormCheck}
                    type="radio"
                    name="teamName"
                    id={`suggestion-${idx}`}
                    value={suggestion}
                    label={suggestion}
                    required
                  />
                ))}
              </FormCheckWrapper>
            </FormGroup>
          )}
        </Container>
      </FormikForm>
    </Formik>
  );
}

const Container = styled.div`
  background: #e0f4f4;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 1rem 2.5rem;
  margin: 3rem;

  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 12.5px;
  line-height: 25px;
  color: #ffffff;

  position: relative;
  max-width: 940px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 42px;
  line-height: 66px;
  text-align: center;
  color: #003647;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  width: min(600px, 100%);
  margin: 1rem auto;

  input {
    padding: 0.8rem;
    font-size: 0.8rem;
    background: #ffffff;
    border-radius: 5px;
    border: none;
  }
`;

const Button = styled(BsButton)`
  &&& {
    margin: 0 1rem;
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    background: #003647;
    color: #ffffff;
    border: none;
    white-space: nowrap;

    &:hover {
      background: #00475e;
    }
  }
`;

const Icon = styled.div`
  position: absolute;
  top: -30px;
  right: -24px;
`;

const FormCheckWrapper = styled.div`
  display: flex;
  .form-check {
    margin-right: 1rem;
  }
`;

const FormCheck = styled(Form.Check)`
  &&& {
    color: #003647;
    input {
      float: none;
      padding: 8px;
      margin-right: 0.5rem;

      &:checked[type="radio"] {
        background: #003647;
      }
      &:focus {
        border-color: none;
        box-shadow: none;
      }
    }
  }
`;

const schema = yup.object().shape({
  displayName: yup.string().trim().required(),
});
