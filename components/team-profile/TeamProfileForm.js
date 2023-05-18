import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import {
  Container as BsContainer,
  Row,
  Col,
  Button as BsButton,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { InputField } from "@ui-library/Form";
import * as Yup from "yup";
import { useTeam } from "@contexts/TeamContext";
import { BsPencil } from "react-icons/bs";
import styled from "styled-components";
import useTeamUpdateMutation from "@hooks/useTeamUpdateMutation";
import Dropdown from "react-bootstrap/Dropdown";
import dynamic from "next/dynamic";
import Accordion from "react-bootstrap/Accordion";
import { useQuery } from "react-query";
import teamService from "@services/team.service";
import { DebounceInput } from "react-debounce-input";
import { IoSearchOutline } from "react-icons/io5";
import Tooltip from "@ui-library/Tooltip";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ReactFileReader = dynamic(() => import("react-file-reader"), {
  ssr: false,
});

export default function TeamProfileForm() {
  const [searchKeyword, setSearchKeyword] = useState("");

  const [industryListData, setIndustryListData] = useState([]);

  const { team, refetchTeam } = useTeam();
  const [image, setImage] = useState();
  const [filesizeValid, setFilesizeValid] = useState(false);
  const mutation = useTeamUpdateMutation(image);
  const [results, setResults] = useState(0);

  const { data: industryList } = useQuery(
    "industry",
    () => teamService.industries(),
    {
      onSuccess: (res) => {
        setIndustryListData(Object.entries(res.data));
      },
    }
  );

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("paymentStatus") == "success") {
      process.browser && window.flash("Subscription successful!", "success");
    }

    if (query.get("paymentStatus") == "failed") {
      process.browser && window.flash("Payment failed", "danger");
    }
  }, []);

  const truncate = (str) => {
    const actualChar = str?.length + str.split(" ").length - 1;
    return actualChar > 35 ? `${str?.substring(0, 33)}...` : str;
  };

  useEffect(() => {
    if (industryList) {
      if (searchKeyword.trim() === "") {
        setResults(0);
        setIndustryListData(Object.entries(industryList?.data));
      } else {
        const searchList = Object.entries(industryList?.data)
          .map((e) => {
            let sortedEntries = e[1].filter((el) =>
              el.industryName
                .toLowerCase()
                .includes(searchKeyword.toLowerCase())
            );
            if (sortedEntries.length > 0) {
              return [e[0], sortedEntries];
            }
          })
          .filter((e) => e);

        setIndustryListData(searchList);
        setResults(searchList.map((e) => e[1]).flatMap((e) => e).length);
      }
    }
  }, [searchKeyword]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        teamName: team?.displayName || "",
        logoUrl: team?.logoUrl || "",
        industry:
          { id: team?.industryId, industryName: team?.industryName } || null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        mutation
          .mutateAsync({
            id: team.id,
            data: {
              teamDetails: {
                teamName: values.teamName,
                industryId: values.industry.id,
              },
              teamImage: values.logoUrl || [],
            },
          })
          .then(() => refetchTeam())
          .then(() => setSearchKeyword(""));
      }}
    >
      {(formik) => (
        <FormikForm>
          <Container fluid>
            <Row className="g-4">
              <Col lg={2}>
                <TeamImageWrapper>
                  <TeamImage
                    src={
                      image ||
                      formik.values.logoUrl ||
                      "/images/team-placeholder.png"
                    }
                    alt="team-profile-image"
                  />
                  <Pencildiv>
                    <ReactFileReader
                      base64={true}
                      handleFiles={(file) => {
                        let base64String = file.base64;
                        let stringLength =
                          base64String.length - "data:image/png;base64,".length;
                        let sizeInBytes =
                          4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
                        let sizeInKb = sizeInBytes / 1024;

                        if (sizeInKb < 1000) {

                          setFilesizeValid(false);
                          setImage(file.base64);
                          formik.setFieldValue("logoUrl", file.fileList[0]);
                        } else {
                          setFilesizeValid(true);
                        }
                      }}
                    >
                      <BsPencil color="#ffffff" size={25} />
                    </ReactFileReader>
                  </Pencildiv>
                </TeamImageWrapper>
                {filesizeValid && (
                  <p
                    className="mt-2 text-center"
                    style={{ maxWidth: "200px", margin: "0 auto" }}
                  >

                    Warning: Image size should be less than 1MB

                  </p>
                )}
              </Col>

              <Col lg={3} className="team__name">
                <StyledInputFieldDiv>
                  <InputField name="teamName" label="Team Name" />
                </StyledInputFieldDiv>
              </Col>
              <Col className="team__name">
                <IndustryContainerDiv>
                  <StyledLabel id="industry-name">Industry</StyledLabel>
                  <StyledDropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      <StyledText
                        selected={
                          formik.values.industry.industryName === null
                            ? false
                            : true
                        }
                      >
                        {formik.values.industry.industryName === null
                          ? "Select Your Industry"
                          : truncate(
                              String(formik.values.industry.industryName)
                            )}
                      </StyledText>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {industryList && (
                        <StyledAccordion defaultActiveKey={["0"]} alwaysOpen>
                          <StyledInputSearchGroup>
                            <InputGroup.Text>
                              <IoSearchOutline color="#003647" size={20} />
                            </InputGroup.Text>

                            <Input
                              type="search"
                              minLength={1}
                              debounceTimeout={300}
                              value={searchKeyword}
                              onChange={(e) => setSearchKeyword(e.target.value)}
                              placeholder="Search"
                              className="form-control"
                            />

                            {searchKeyword && (
                              <Tooltip text="Clear" placement="right">
                                <ClearButton
                                  variant="default"
                                  onClick={() => setSearchKeyword("")}
                                >
                                  {searchKeyword.trim() !== 0 &&
                                    `${results} ${
                                      results === 1 ? "Result" : "Results"
                                    }`}
                                  <IoIosCloseCircleOutline
                                    color="#676879"
                                    size={20}
                                    style={{ marginLeft: "3px" }}
                                  />
                                </ClearButton>
                              </Tooltip>
                            )}
                          </StyledInputSearchGroup>
                          <StyledItems>

                            {industryListData.map((group, index) => (

                              <Accordion.Item
                                eventKey={index.toString()}
                                key={`${group[0]}`}
                              >
                                <Accordion.Header>{group[0]}</Accordion.Header>
                                {group[1].map((industry) => (
                                  <StyledAccordionBody
                                    key={industry.id}
                                    onClick={() => {
                                      formik.setFieldValue(
                                        "industry",
                                        industry
                                      );

                                      document
                                        .getElementById("industry-name")
                                        .click();
                                    }}
                                  >
                                    {`${industry.industryName} (${industry.code})`}
                                  </StyledAccordionBody>
                                ))}
                              </Accordion.Item>
                            ))}
                          </StyledItems>
                        </StyledAccordion>
                      )}
                    </Dropdown.Menu>
                  </StyledDropdown>
                </IndustryContainerDiv>
              </Col>
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
                      Saving...
                    </>
                  ) : (
                    "Save"
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

const StyledInputFieldDiv = styled.div`
  &&& {
    width: 300px;
  }
`;

const StyledAccordionBody = styled(Accordion.Body)`
  &&& {
    padding: 0.5rem 0.5rem 0.5rem 1.25rem;
  }
`;

const StyledDropdown = styled(Dropdown)`
  &&& {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
`;

const IndustryContainerDiv = styled.div`
  width: 100%;
`;

const StyledText = styled.span`
  &&& {
    text-align: left;
    width: 100%;
    font-family: "Manrope";
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    // color: #393d3e;
    color: #212529;
    opacity: ${(props) => (props.selected ? "1" : "0.5")};
  }
`;

const StyledAccordion = styled(Accordion)`
  &&& {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 36px;
    color: #393d3e;
    cursor: pointer;
    .accordion-item {
      border: none;
      .accordion-header {
        font-weight: 700;
        .accordion-button {
          box-shadow: none;
        }
      }
    }
  }
`;

const StyledItems = styled.div`
  max-height: 300px;
  overflow-y: scroll;
`;

const StyledLabel = styled.label`
  &&& {
    box-sizing: border-box;
    display: inline-block;
    margin: 0;
    margin-bottom: 0.5rem;
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.02em;
    color: #003647;
  }
`;

const Container = styled(BsContainer)`
  &&& {
    padding: 0;
    .team__name {
      display: flex;
      align-items: center;
      .dropdown {
        max-width: 300px;
        .btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0.375rem 0.75rem !important;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #212529 !important;
          background-color: #fff;
          background-clip: padding-box;
          border-color: #003647;
        }
      }
    }

    @media (max-width: 992px) {
      .team__name {
        & > div {
          width: 100%;
        }
      }
    }
  }
`;

const TeamImageWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: auto;
`;

const TeamImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  height: 140px;
  width: 140px;
`;

const Pencildiv = styled.div`
  cursor: pointer;
  transition: 0.5s ease;
  z-index: 2;
  background: #81c2c0;
  border: 1px solid #ffffff;

  justify-content: center;
  align-items: center;
  display: flex;
  width: 40px;
  height: 40px;

  position: absolute;
  bottom: 0;
  right: 0;

  border-radius: 50%;
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

const StyledInputSearchGroup = styled(InputGroup)`
  &&& {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: auto;
    padding: 0px !important;
    margin: 0.5rem;
    background-color: #e6ebed;
    border-radius: 5px;
    font-family: "Manrope";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.02em;
    color: #393d3e;
    opacity: 0.5;

    .input-group-text {
      border: none;
      padding: 0.375rem 0rem 0.375rem 0.5rem;
    }
  }
`;

const Input = styled(DebounceInput)`
  &&& {
    border: none;
    background-color: #e6ebed;
  }
`;

const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: auto !important;
    border: none;
    background-color: #e6ebed !important;
  }
`;
const validationSchema = Yup.object({
  teamName: Yup.string()
    .min(2, "Too short")
    .max(100, "Must be 50 characters or less")
    .trim()
    .required("Required"),
});
