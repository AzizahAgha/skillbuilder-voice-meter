import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ButtonGroup, Col, Container, Row } from "react-bootstrap";
import { useTeam } from "@contexts/TeamContext";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import DocumentDownloadIcon from "@public/icons/document-download";
import PrinterIcon from "@public/icons/printer";
import AddUsersIcon from "@public/icons/add-users";
import InvitesPopup from "@components/invites/InvitesPopup";
import InvitationsSentPopup from "@components/invites/InvitationsSentPopup";
import Tooltip from "@ui-library/Tooltip";
import BsDropdown from "react-bootstrap/Dropdown";
import { SelectionMode, useAppContext } from "@contexts/AppContext";
import DropdownToggle from "@ui-library/DropdownToggle";
import SuperAdminStrip from "@ui-library/SuperAdminStrip";
import { useRouter } from "next/router";
import { DropdownToggled } from "@components/filters/FlashcardFilters";
import { IoIosArrowDown } from "react-icons/io";

export default function DetailPageHeader({
  onFavouriteClick,
  onQuestionClick,
  showFavourites,
  editFlashcardPage = false,
  setTitle,
}) {
  const { team } = useTeam();
  const router = useRouter();
  const { setSelectionMode, setInSelectMode } = useAppContext();

  const [showInvitesPopup, setShowInvitesPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const [isDashboardPage, setIsDashboardPage] = useState(false);
  const [hideHeaderOptions, setHideHeaderOptions] = useState(false);

  const [adminStrip, setadminStrip] = useState(false);

  useEffect(() => {
    if(router.asPath.includes("dashboard"))
      setIsDashboardPage(true);
    if (
      router.asPath.includes("play") ||
      router.asPath.includes("question-merge") ||
      router.asPath.includes("question-bank") 
    )
      setHideHeaderOptions(true);
  }, [router]);

  const isCardView = useMemo(
    () => router.asPath.includes("question"),
    [router]
  );
  const truncate = (str) => {
    const actualChar = str?.length + str.split(" ").length - 1;
    return actualChar > 100 ? `${str?.substring(0, 97)}...` : str;
  };
  const detailPage = () => {
    if (hideHeaderOptions) {
      setInSelectMode(false);
      setSelectionMode(false);
      router.push("/detail");
    } else {
      router.push("/detail");
    }
  };
  useEffect(() => {
    window.addEventListener("storage", storageEventHandler, false);
    setadminStrip(localStorage.getItem("isSuperAdminView"));
  }, []);

  const storageEventHandler = () => {
    setadminStrip(localStorage.getItem("isSuperAdminView"));
  };

  return (
    <Wrapper editFlashcardPage={editFlashcardPage}>
      {adminStrip && <SuperAdminStrip></SuperAdminStrip>}
      <Container>
        <Row className="pt-3 pt-lg-4">
          <Col>
            {!editFlashcardPage && (
              <TeamName className="mb-0 mb-lg-2">
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {team?.displayName ? truncate(String(team?.displayName)) : ""}
                </span>
              </TeamName>
            )}
            {editFlashcardPage && (
              <FlashcardTitle className="mb-0 mb-lg-2">
                {" "}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {setTitle ? truncate(String(setTitle)) : "Set Title"}
                </span>
              </FlashcardTitle>
            )}
          </Col>
          <Col>
          {!hideHeaderOptions && (
            <OptionsWrapper>
              <ButtonGroup className="d-none d-lg-flex me-lg-2">
                <ButtonOutlined
                  onClick={() => router.push("/dashboard")}
                  active={isDashboardPage}
                >
                  Dashboard
                </ButtonOutlined>
                <ButtonOutlined
                  onClick={() => detailPage()}
                  active={router.asPath.includes("detail") ? true : false}
                >
                  Questions
                </ButtonOutlined>
                <ButtonOutlined
                  onClick={() => router.push("/flashcards/learn")}
                  active={router.asPath.includes("flashcards") ? true : false}
                >
                  Learn
                </ButtonOutlined>
              </ButtonGroup>

              <Dropdown className="d-block d-lg-none">
                <DropdownToggled>
                  {!hideHeaderOptions && isDashboardPage && "Dashboard"}
                  {!hideHeaderOptions && !isDashboardPage && "Questions"}
                  {router.asPath.includes("flashcards") && "Learn"}
                  <IoIosArrowDown
                    size={20}
                    style={{ marginTop: "7%", marginLeft: "5%" }}
                  />
                </DropdownToggled>

                <Dropdown.Menu>
                  <Dropdown.Item
                    style={
                      !hideHeaderOptions && isDashboardPage
                        ? {
                            color: "white",
                            backgroundColor: "#003647",
                          }
                        : {}
                    }
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={
                      router.asPath.includes("detail") 
                        ? {
                            color: "white",
                            backgroundColor: "#003647",
                          }
                        : {}
                    }
                    onClick={() => detailPage()}
                  >
                    Questions
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={
                      router.asPath.includes("flashcards")
                        ? {
                            color: "white",
                            backgroundColor: "#003647",
                          }
                        : {}
                    }
                    onClick={() => router.push("/flashcards/learn")}
                  >
                    Learn
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div className="d-none d-lg-block">
                <Actions hideHeaderOptions={hideHeaderOptions} />
              </div>

              <InvitesPopup
                show={showInvitesPopup}
                handleClose={() => setShowInvitesPopup(false)}
                showConfirmationPopup={() => setShowConfirmationPopup(true)}
                teamId={team?.id}
                showCloseBtn
              />

              <InvitationsSentPopup
                show={showConfirmationPopup}
                handleClose={() => setShowConfirmationPopup(false)}
                onSendMoreInvites={() => setShowInvitesPopup(true)}
              />
            </OptionsWrapper>
          )}
            
          </Col>
        </Row>
        {!editFlashcardPage && (
          <Row className="pb-2 pb-lg-4">
            <Col>
              <Info>
                {team?.questionsCount}{" "}
                {team?.questionsCount == 1 ? " Question" : " Questions"}
                <span className="mx-2">|</span>
                {team?.answersCount}{" "}
                {team?.answersCount == 1 ? " Answer" : " Answers"}
                <span className="mx-2">|</span>
                {team?.contributorsCount}{" "}
                {team?.contributorsCount == 1
                  ? " Contributor"
                  : " Contributors"}
              </Info>
            </Col>
          </Row>
        )}

        <div className="d-flex d-lg-none pb-4 align-items-center justify-content-between">
          {!isCardView && !isDashboardPage && (
            <ButtonGroup className="me-lg-2">
              <ButtonOutlined
                onClick={() => onQuestionClick?.()}
                active={!showFavourites}
              >
                Questions
              </ButtonOutlined>
              <ButtonOutlined
                onClick={() => onFavouriteClick?.()}
                active={showFavourites}
              >
                Favorites
              </ButtonOutlined>
            </ButtonGroup>
          )}
          <div className="flex-grow-1" />
          <Actions />
        </div>
      </Container>
    </Wrapper>
  );
}

export const Actions = ({ hideHeaderOptions }) => {
  const { setInSelectMode, setSelectionMode } = useAppContext();
  const router = useRouter();
  const { team } = useTeam();
  const multiSelect = router.route === "/detail";
  const [showInvitesPopup, setShowInvitesPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  return (
    <div className="d-flex align-items-center">
      {!hideHeaderOptions && (
        <>
          <Tooltip text="Download">
            <Dropdown>
              <DropdownToggle>
                <DocumentDownloadIcon />
              </DropdownToggle>

              <Dropdown.Menu>
                <Dropdown>
                  <DropdownToggle>Download All</DropdownToggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => setSelectionMode(SelectionMode.PDF)}
                    >
                      Download PDF
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setSelectionMode(SelectionMode.CSV)}
                    >
                      Download CSV
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {multiSelect && (
                  <Dropdown.Item
                    onClick={() => {
                      setInSelectMode(true);
                      setSelectionMode(SelectionMode.CSV);
                    }}
                  >
                    Select & Download
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Tooltip>

          <Tooltip text="Print">
            <Dropdown className="d-none d-lg-inline-block">
              <DropdownToggle>
                <PrinterIcon />
              </DropdownToggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSelectionMode(SelectionMode.PRINT)}
                >
                  Print All
                </Dropdown.Item>
                {multiSelect && (
                  <Dropdown.Item
                    onClick={() => {
                      setInSelectMode(true);
                      setSelectionMode(SelectionMode.PRINT);
                    }}
                  >
                    Select & Print
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Tooltip>
        </>
      )}
      <InvitesPopup
        show={showInvitesPopup}
        handleClose={() => setShowInvitesPopup(false)}
        showConfirmationPopup={() => setShowConfirmationPopup(true)}
        teamId={team?.id}
        showCloseBtn
      />

      <InvitationsSentPopup
        show={showConfirmationPopup}
        handleClose={() => setShowConfirmationPopup(false)}
        onSendMoreInvites={() => setShowInvitesPopup(true)}
      />
      <Tooltip text="Invite">
        <button className="btn" onClick={() => setShowInvitesPopup(true)}>
          <AddUsersIcon />
        </button>
      </Tooltip>
    </div>
  );
};

export const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: ${(props) => (!props.editFlashcardPage ? "4rem" : "4px")};
  padding-bottom: ${(props) => (!props.editFlashcardPage ? "0px" : "30px")};
  @media (max-width: 992px) {
    margin-bottom: 2rem;
  }
`;

const FlashcardTitle = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 50px;
  line-height: 60px;
  color: #003647;
`;

export const TeamName = styled.h2`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 600;
  font-size: 50px;
  line-height: 60px;
  color: #003647;
`;

export const Info = styled.p`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #003647;
`;

export const OptionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const Dropdown = styled(BsDropdown)`
  &&& {
    font-family: "Barlow Condensed";
    font-style: normal;
  }
`;
