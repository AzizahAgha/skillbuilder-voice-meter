import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useQuery } from "react-query";
import inviteService from "@services/invite.service";
import { useTeam } from "@contexts/TeamContext";
import {
  Row,
  Col,
  InputGroup,
  Form as BsForm,
  Container,
} from "react-bootstrap";
import InviteDraggableCard from "./inviteDraggableCard";
import * as Yup from "yup";
import { BsEnvelope } from "react-icons/bs";
import {
  IoIosArrowForward,
  IoIosArrowBack,
  IoIosClose,
  IoIosInformationCircleOutline,
} from "react-icons/io";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Bus from "@utils/Bus";
import Highlighter from "react-highlight-words";
import Button from "@ui-library/Button";
import moment from "moment";

function InviteCard({
  mutation,
  flashcardSetId,
  questionId,
  invitesCount,
  inviteType,
  tags,
  setTags,
  emailList,
  setEmailList,
  setEmail,
  error,
  setError,
  email,
  handleSubmit,
  setResendList,
  resendList,
}) {
  const { team } = useTeam();
  const { data, refetch: refetchGroupUsers } = useQuery(
    ["get-all-users-invite"],
    () =>
      inviteService.getAllTeamUsers(team?.id, {
        type: inviteType,
        actionId: questionId ? questionId : flashcardSetId,
      }),
    {
      enabled:
        !!team?.id && (inviteType === "Question" || inviteType === "Flashcard"),
      onSuccess: (res) => {
        const noOfUsers = res?.data?.users.filter((e) => {
          if (SelectedTab === "All" || e.groupName === SelectedTab) {
            return e;
          }
        }).length;
        setUserCount(noOfUsers);
        setMaxPage(Math.ceil(noOfUsers / 6));
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );
  const [maxpage, setMaxPage] = useState(null);
  const [SelectedTab, setSelectedTab] = useState("All");
  const [userCount, setUserCount] = useState(null);

  const ValidateEmails = (e) => {
    if (
      Yup.string().email().isValidSync(e.target.value.replace(/\,/g, "").trim())
    ) {
      if (
        !tags
          .map((e) => e.email.toLowerCase())
          .includes(e.target.value.toLowerCase().replace(/\,/g, "").trim())
      ) {
        if (e.target.value.replace(/\,/g, "").trim()) {
          setTags([
            ...tags,
            { type: "typed", email: e.target.value.replace(/\,/g, "").trim() },
          ]);
          e.target.value = "";
          setError("");
          setEmail("");
        }
      } else {
        setError("Duplicate Email Entered!");
      }
    } else {
      setError("Enter Valid Emails");
    }
  };

  const handleKeyUp = (e) => {
    setError("");
    setEmail(e.target.value.replace(/\,/g, "").trim());
    if (e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 188) {
      ValidateEmails(e);
    }
  };

  const [pageNumber, setPageNumber] = useState(1);
  const [postNumber] = useState(6);

  const currentPageNumber = pageNumber * postNumber - postNumber;

  const handlePrev = () => {
    if (pageNumber === 1) return;
    setPageNumber(pageNumber - 1);
  };
  const handleNext = () => {
    if (maxpage > pageNumber) {
      setPageNumber(pageNumber + 1);
    }
  };
  useEffect(() => {
    const noOfUsers = data?.data?.users.filter((e) => {
      if (SelectedTab === "All" || e.groupName === SelectedTab) {
        return e;
      }
    }).length;
    setUserCount(noOfUsers);
    setMaxPage(Math.ceil(noOfUsers / 6));
  }, [SelectedTab]);

  useEffect(() => {
    let element = document.getElementById("tags-text");
    element.scrollTop = element.scrollHeight;
  }, [tags]);

  const popoverClickRootClose = (item) => {
    if (item.id) {
      return (
        <StyledPopover
          id="popover-trigger-click-root-close"
          title="resend invite"
        >
          <StyledContainer>
            <div className="card-details">
              <div className="profile-image">
                <ProfileImage
                  id="invite_card_image"
                  name="invite_card_image"
                  src={
                    item.avtarUrl
                      ? item.avtarUrl
                      : "/images/default-user-avatar.jpg"
                  }
                  alt="invite_card_image"
                />
              </div>
              <div>
                <div className="name">
                  {item.firstName} {item.lastName}
                </div>
                <div className="department">
                  <Department>
                    {item.groupName && (
                      <span style={{ color: item.departmentColor }}>
                        {item.groupName}
                      </span>
                    )}
                    {item.groupName && item.departmentName ? ": " : ""}
                    {item.departmentName && (
                      <span
                        className="dept"
                        style={{ color: item.departmentColor }}
                      >
                        {item.departmentName}
                      </span>
                    )}
                  </Department>
                </div>
              </div>
            </div>

            <div className="details">
              <div className="invited-details">
                <div>
                  <Text>
                    Invited by <b>{item.invitedBy}</b>
                  </Text>
                </div>
                <div>
                  <Text date={true}>
                    {moment(item.invitedDate).format("MMM DD, YYYY - h:mmA")}
                  </Text>
                </div>
              </div>
              <div className="resend-button">
                <StyledButton
                  disabled={resendList.includes(item.email)}
                  onClick={() => {
                    handleSubmit([item.email], "resend");
                    setResendList((old) => {
                      return [...old, item.email];
                    });
                    refetchGroupUsers();
                  }}
                >
                  {resendList.includes(item.email) ? "Invite Sent" : "Resend"}
                </StyledButton>
              </div>
            </div>
          </StyledContainer>
        </StyledPopover>
      );
    } else {
      return (
        <StyledPopover
          id="popover-trigger-click-root-close"
          title="resend invite"
        >
          <StyledContainer>
            <div className="name">
              <Name>{item.email}</Name>
            </div>
            <div className="details">
              <div className="invited-details">
                <div>
                  <Text>
                    Invited by <b>{item.invitedBy}</b>
                  </Text>
                </div>
                <div>
                  <Text date={true}>
                    {moment(item.invitedDate).format("MMM DD, YYYY - h:mmA")}
                  </Text>
                </div>
              </div>
              <div className="resend-button">
                <StyledButton
                  disabled={resendList.includes(item.email)}
                  onClick={() => {
                    handleSubmit([item.email], "resend");
                    setResendList((old) => {
                      return [...old, item.email];
                    });
                    refetchGroupUsers();
                  }}
                >
                  {resendList.includes(item.email) ? "Invite Sent" : "Resend"}
                </StyledButton>
              </div>
            </div>
          </StyledContainer>
        </StyledPopover>
      );
    }
  };

  return (
    <React.Fragment>
      <StyledInputGroup id="tags-text" className="my-3">
        <InputGroup.Text disabled>
          <BsEnvelope color="#FFF" size={40} />
        </InputGroup.Text>

        {tags &&
          tags.map((item, index) => (
            <DraggedTags key={index}>
              {item.type === "clicked" && (
                <>
                  {item.id ? (
                    <>
                      <ProfileImageTag src={item.avtarUrl} /> {item.firstName}{" "}
                      {item.lastName}
                    </>
                  ) : (
                    <>{item.email}</>
                  )}
                </>
              )}
              {item.type === "typed" && <>{item.email}</>}
              {item.status === "Pending" && (
                <OverlayTrigger
                  trigger="click"
                  rootClose
                  placement="right"
                  overlay={popoverClickRootClose(item)}
                >
                  <PendingSpan className="mx-2">
                    Pending
                    <span className="info-circle mx-1">
                      <IoIosInformationCircleOutline color="#1F5462" />
                    </span>
                  </PendingSpan>
                </OverlayTrigger>
              )}

              <IoIosClose
                color="#6C7374"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setTags((old) =>
                    [...old].filter((e, i) => {
                      if (
                        (e.type === "clicked" && e.id !== item.id) ||
                        (e.type === "typed" && i !== index)
                      ) {
                        return e;
                      }
                    })
                  )
                }
              />
            </DraggedTags>
          ))}

        <TagsInputField
          id="tags-input"
          type="text"
          placeholder="Enter email addresses here (seperate by commas)"
          onKeyUp={handleKeyUp}
          disabled={
            Number(emailList.length) + Number(invitesCount) >= 5 &&
            flashcardSetId
              ? true
              : false
          }
        />
      </StyledInputGroup>

      <BsForm.Control.Feedback
        type="invalid"
        className={`my-0 ${mutation.isError && "d-block"}`}
      >
        {mutation?.error?.response.data?.data?.length > 0 &&
          `${mutation.error.response.data?.data?.join(" ")}- ${
            mutation.error.response.data?.message
          }`}
      </BsForm.Control.Feedback>
      {error && <StyledError>{error}</StyledError>}

      {(inviteType === "Flashcard" || inviteType === "Question") && (
        <React.Fragment>
          <StyledTabs
            className="bs mb-3"
            defaultActiveKey="All"
            id="invite-group-tabs"
            justify
            onSelect={(k) => {
              setPageNumber(1);
              setSelectedTab(k);
            }}
          >
            {data?.data?.groupNames.map((group, index) => (
              <Tab eventKey={group} title={group} key={index} />
            ))}
          </StyledTabs>

          {userCount !== 0 ? (
            <Header>Suggested Users</Header>
          ) : (
            <Header>No Users Found</Header>
          )}

          <Row>
            {data?.data?.users
              .filter((e) => {
                if (SelectedTab === "All" || e.groupName === SelectedTab) {
                  return e;
                }
              })
              .splice(currentPageNumber, postNumber)
              .map((user, index) => (
                <div className="col-sm-6 col-md-4" key={index}>
                  <InviteDraggableCard
                    user={user}
                    setTags={setTags}
                    flashcardSetId={flashcardSetId}
                    invitesCount={invitesCount}
                    email={email}
                    popoverClickRootClose={popoverClickRootClose}
                    handleSubmit={handleSubmit}
                    setResendList={setResendList}
                    resendList={resendList}
                    refetchGroupUsers={refetchGroupUsers}
                  />
                </div>
              ))}
          </Row>
          <Row>
            {userCount !== 0 && (
              <StyledCol>
                <IoIosArrowBack
                  onClick={handlePrev}
                  color="#969C9D"
                  style={{ cursor: "pointer" }}
                />
                <StyledPageNumber>{`${pageNumber} OF ${maxpage}`}</StyledPageNumber>
                <IoIosArrowForward
                  onClick={handleNext}
                  color="#969C9D"
                  style={{ cursor: "pointer" }}
                />
              </StyledCol>
            )}
          </Row>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default InviteCard;

const StyledContainer = styled.div`
  margin: 0.5rem 0.5rem 0.5rem 0.75rem;
  .details {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    .invited-details {
      flex-basis: 70%;
    }
    .resend-button {
      flex-basis: 30%;
      align-self: center;
    }
  }
  .card-details {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    border-bottom: 0.5px solid #969c9d;
    .profile-image {
      align-self: center;
      min-width: 30px;
    }
    .name {
      font-family: "Manrope";
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      color: #393d3e;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      .highlight {
        background-color: #ffd700;
      }
    }
  }
`;

const StyledButton = styled(Button)`
  &&& {
    min-width: 20px;
    height: 20px;
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 15px;
    text-align: center;
    color: #ffffff;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")} !important;
  }
`;

const Text = styled.span`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  opacity: ${(props) => (props.date ? "0.5" : "")};
  color: #393d3e;
  text-align: center;
`;

const Name = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #393d3e;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-bottom: 0.3rem;
  text-align: left;
  .highlight {
    background-color: #ffd700;
  }
`;

const StyledPopover = styled(Popover)`
  &&& {
    z-index: 2070;
    box-sizing: border-box;
    position: absolute;
    min-width: 250px;
    min-height: 80px;
    background: #ffffff;
    border: 0.5px solid #c4c4c4;
    border-radius: 5px;
  }
`;

const PendingSpan = styled.span`
  &&& {
    background: #e0f4f4;
    border-radius: 5px;
    font-family: "Manrope";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    color: #1f5462;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
    .info-circle {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
  }
`;

const StyledPageNumber = styled.span`
  color: #969c9d;
`;

const StyledCol = styled.div`
  width: 20% !important;
  margin-left: auto;
  margin-right: auto;
`;

const StyledError = styled.span`
  -webkit-text-size-adjust: 100%;
  font-family: Arial, sans-serif;
  line-height: 20px;
  pointer-events: auto;
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  box-sizing: border-box;
  width: 100%;
  font-size: 0.875em;
  color: #dc3545;
  display: block !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
`;

const TagsInputField = styled.input`
  flex-basis: 65%;
  display: flex;
`;

const ProfileImageTag = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 20px;
  height: 20px;
  border: 0.5px solid #9a9b9c;
  margin-right: 5px;
`;

const DraggedTags = styled.span`
  &&& {
    font-size: 14px;
    line-height: 20px;
    pointer-events: auto;
    user-select: none;
    box-sizing: border-box;
    background-color: #fff;
    border: 0.5px solid #c4c4c4;
    color: #393d3e;
    padding: 0.25rem 0.75rem;
    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0.1rem 0;
    margin-right: 0.2rem;
    opacity: 1;
    cursor: auto;
    border-radius: 50rem !important;
  }
`;

const StyledTabs = styled(Tabs)`
  &&& {
    border-bottom: none;
    width: 50%;
    .nav-link {
      color: #969c9d;
      font-family: "Barlow Condensed", sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;
      text-align: center;
    }
    .active {
      color: #003647;
      font-weight: 600;
      border-color: #fff #fff #003647 #fff;
      border-bottom-width: 3px;
    }
    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

const Header = styled.span`
  width: 124px;
  height: 24px;
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #1f5462;
`;

const StyledInputGroup = styled(InputGroup)`
  &&& {
    width: 100%;
    background: rgba(150, 156, 157, 0.05);
    border-radius: 5px;
    display: flex;
    // flex-wrap: nowrap;
    align-items: center;
    padding: 0.5rem;
    margin: 0px !important;
    overflow: auto;
    max-height: 120px;

    .input-group-text {
      height: 34px;
      width: 34px;
      background: #81c2c0;
      border: none;
      border-radius: 50% !important;
      padding: 0.375rem 0.45rem;
      margin-right: 0.5rem;
    }

    input,
    textarea {
      background: transparent;
      border: none;
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.02em;
      color: #393d3e;

      &:focus {
        outline: none;
        border-color: none;
        box-shadow: none;
        background: transparent;
      }
    }

    textarea {
      height: ${(props) =>
        props.$inviteType === "Team" || props.$inviteType === "Flashcard"
          ? "220px"
          : "auto"};
      resize: none;
      width: 100%;
    }
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 26px;
  height: 26px;
  border: 0.5px solid #9a9b9c;
  margin-right: 11px;
`;

const Department = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #6c7374;
  display: flex;
  span {
    display: inline-block;
  }
  .dept {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;
