import React from "react";
import styled from "styled-components";
import Highlighter from "react-highlight-words";
import moment from "moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function InviteDraggableCard({
  user,
  setTags,
  flashcardSetId,
  invitesCount,
  email,
  popoverClickRootClose,
  handleSubmit,
  setResendList,
  resendList,
  refetchGroupUsers,
}) {
  const AddtoTags = ({ item }) => {
    if (flashcardSetId) {
      setTags((old) => {
        if (Number(old?.length) + Number(invitesCount) < 5) {
          const emails = old.map((e) => e.email.toLowerCase());
          if (emails.includes(item.email.toLowerCase())) {
            return old;
          } else {
            return [...old, item];
          }
        } else {
          return old;
        }
      });
    } else {
      setTags((old) => {
        const emails = old.map((e) => e.email.toLowerCase());
        if (emails.includes(item.email.toLowerCase())) {
          return old;
        } else {
          return [...old, item];
        }
      });
    }
  };

  const truncate = (str) => {
    const actualChar = str?.length + str.split(" ").length - 1;
    return actualChar > 14 ? `${str?.substring(0, 11)}...` : str;
  };
  return (
    <>
      {user.status !== "Pending" ? (
        <DraggableCard
          onClick={() => {
            AddtoTags({
              item: {
                type: "clicked",
                id: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                avtarUrl: user.avtarUrl,
                email: user.email,
                status: user.status,
                invitedBy: user.invitedBy,
                invitedDate: user.invitedDate,
                groupName: user.groupName,
                departmentName: user.departmentName,
                departmentColor: user.departmentColor,
              },
            });
          }}
        >
          <ProfileImage
            id="invite_card_image"
            name="invite_card_image"
            src={
              user.avtarUrl ? user.avtarUrl : "/images/default-user-avatar.jpg"
            }
            alt="invite_card_image"
          />
          <Details>
            <Name>
              <Highlighter
                highlightClassName="highlight"
                searchWords={[email]}
                autoEscape={true}
                textToHighlight={truncate(
                  String(`${user.firstName} ${user.lastName}`)
                )}
              />
            </Name>
            <Department>
              {user.groupName && (
                <span style={{ color: user.departmentColor }}>
                  {user.groupName}
                </span>
              )}
              {user.groupName && user.departmentName ? ": " : ""}
              {user.departmentName && (
                <span className="dept" style={{ color: user.departmentColor }}>
                  {user.departmentName}
                </span>
              )}
            </Department>
          </Details>
        </DraggableCard>
      ) : (
        <>
          {user.userId ? (
            <DraggableCard>
              <ProfileImage
                id="invite_card_image"
                name="invite_card_image"
                src={
                  user.avtarUrl
                    ? user.avtarUrl
                    : "/images/default-user-avatar.jpg"
                }
                alt="invite_card_image"
                onClick={() => {
                  AddtoTags({
                    item: {
                      type: "clicked",
                      id: user.userId,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      avtarUrl: user.avtarUrl,
                      email: user.email,
                      status: user.status,
                      invitedBy: user.invitedBy,
                      invitedDate: user.invitedDate,
                      groupName: user.groupName,
                      departmentName: user.departmentName,
                      departmentColor: user.departmentColor,
                    },
                  });
                }}
              />
              <Details>
                <Name>
                  <Highlighter
                    onClick={() => {
                      AddtoTags({
                        item: {
                          type: "clicked",
                          id: user.userId,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          avtarUrl: user.avtarUrl,
                          email: user.email,
                          status: user.status,
                          invitedBy: user.invitedBy,
                          invitedDate: user.invitedDate,
                          groupName: user.groupName,
                          departmentName: user.departmentName,
                          departmentColor: user.departmentColor,
                        },
                      });
                    }}
                    highlightClassName="highlight"
                    searchWords={[email]}
                    autoEscape={true}
                    textToHighlight={truncate(
                      String(`${user.firstName} ${user.lastName}`)
                    )}
                  />
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="right"
                    overlay={popoverClickRootClose({
                      type: "clicked",
                      id: user.userId,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      avtarUrl: user.avtarUrl,
                      email: user.email,
                      status: user.status,
                      invitedBy: user.invitedBy,
                      invitedDate: user.invitedDate,
                      groupName: user.groupName,
                      departmentName: user.departmentName,
                      departmentColor: user.departmentColor,
                    })}
                  >
                    <PendingSpan>Pending</PendingSpan>
                  </OverlayTrigger>
                </Name>

                <Department
                  onClick={() => {
                    AddtoTags({
                      item: {
                        type: "clicked",
                        id: user.userId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avtarUrl: user.avtarUrl,
                        email: user.email,
                        status: user.status,
                        invitedBy: user.invitedBy,
                        invitedDate: user.invitedDate,
                        groupName: user.groupName,
                        departmentName: user.departmentName,
                        departmentColor: user.departmentColor,
                      },
                    });
                  }}
                >
                  {user.groupName && (
                    <span style={{ color: user.departmentColor }}>
                      {user.groupName}
                    </span>
                  )}
                  {user.groupName && user.departmentName ? ": " : ""}
                  {user.departmentName && (
                    <span
                      className="dept"
                      style={{ color: user.departmentColor }}
                    >
                      {user.departmentName}
                    </span>
                  )}
                </Department>
              </Details>
            </DraggableCard>
          ) : (
            <DraggableCard pending={true}>
              <div className="user-outside-database">
                <div className="email">
                  <Name
                    pending={true}
                    onClick={() => {
                      AddtoTags({
                        item: {
                          type: "clicked",
                          id: user.userId,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          avtarUrl: user.avtarUrl,
                          email: user.email,
                          status: user.status,
                          invitedBy: user.invitedBy,
                          invitedDate: user.invitedDate,
                          groupName: user.groupName,
                          departmentName: user.departmentName,
                          departmentColor: user.departmentColor,
                        },
                      });
                    }}
                  >
                    <Highlighter
                      highlightClassName="highlight"
                      searchWords={[email]}
                      autoEscape={true}
                      textToHighlight={`${user.email}`}
                    />
                  </Name>
                </div>

                <InviteDate>
                  Invite Sent: {moment(user.invitedDate).format("MM/DD/YYYY")}
                  <StyledButton
                    disabled={resendList.includes(user.email)}
                    onClick={() => {
                      handleSubmit([user.email], "resend");
                      setResendList((old) => {
                        return [...old, user.email];
                      });
                      refetchGroupUsers();
                    }}
                  >
                    {resendList.includes(user.email) ? "Invite Sent" : "Resend"}
                  </StyledButton>
                </InviteDate>
              </div>
            </DraggableCard>
          )}
        </>
      )}
    </>
  );
}

export default InviteDraggableCard;

const PendingSpan = styled.div`
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
    max-width: 60px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

const StyledButton = styled.button`
  background-color: Transparent;
  border: none;
  cursor: pointer;
  overflow: hidden;
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: #1f5462;
  display: flex;
  text-align: center;
  max-width: 55px;
`;

const InviteDate = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #1f5462;
  display: flex;
  line-height: 15px;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 50%;
`;

const DraggableCard = styled.div`
  width: 100%;
  height: 58px;
  background: #fff;
  border: ${(props) =>
    props.isDragging ? "2px solid #81C2C0" : "0.5px solid #c4c4c4"};
  border-radius: 5px;
  position: relative;
  padding-left: ${(props) => (props.pending ? "" : "40px")};
  cursor: ${(props) => (props.pending ? "" : "pointer")};
  margin-bottom: 15px;
  background: ${(props) =>
    props.pending
      ? `linear-gradient(
    to bottom,
    #fff 0%,
    #fff 50%,
    #E0F4F4 50%,
    #E0F4F4 100%
  )`
      : ""};
  .user-outside-database {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    align-content: space-around;
    .email {
      width: 100%;
      text-align: center;
    }
    .name {
      width: 100%;
      height: 50%;
    }
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 26px;
  height: 26px;
  border: 0.5px solid #9a9b9c;
  position: absolute;
  left: 0.5em;
  top: 50%;
  transform: translateY(-50%);
`;

const Details = styled.div`
  width: 100%;
  height: 100%;
  padding: 5px;
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
  cursor: ${(props) => (props.pending ? "pointer" : "")};
  .highlight {
    background-color: #ffd700;
  }
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
