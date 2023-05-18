import React from "react";
import styled from "styled-components";
import { Container, Row, Col, Image } from "react-bootstrap";
import moment from "moment";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import inviteService from "@services/invite.service";
import { useAppContext } from "@contexts/AppContext";
import teamService from "@services/team.service";
import flashcardService from "@services/flashcard.service";
import Bus from "@utils/Bus";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const getPopupTitle = (type) => {
  const message =
    {
      Team: "Are you sure you want to join the Team?",
      Question: "Are you sure you want to answer the Question?",
      Flashcard: "Are you sure you want to join the Flashcard?",
    }[type] ?? "Are you sure?";

  return message;
};

export default function NotificationItem({
  image,
  text,
  date,
  isRead,
  questionId,
  flashcardSetId,
  inviteToken,
  teamId,
  isNotification,
  onPage,
  status,
  NotificationType,
  refetchNotifications,
  type,
}) {
  const { alert } = useAppContext();

  const inviteQuery = useQuery(
    ["invite", inviteToken],
    () =>
      inviteService.get(inviteToken, {
        type:
          Number(Boolean(questionId)).toString() +
            Number(Boolean(flashcardSetId)).toString() +
            Number(Boolean(inviteToken)).toString() ===
          "011"
            ? "Flashcard"
            : "",
      }),

    { enabled: !!inviteToken }
  );

  const invite = inviteQuery.data;

  const router = useRouter();
  const { setTeam } = useTeam();
  const mutation = useMutation((teamId) => teamService.updateStatus(teamId));
  const inviteMutation = useMutation(({ teamId, token, type }) =>
    inviteService.addUser(teamId, token, type)
  );

  const archiveFlashcardMutation = useMutation(
    ({ teamId, flashcardSetId, data }) =>
      flashcardService.statusUpdate({ teamId, flashcardSetId, data }),
    {
      onSuccess: (res) => {
        let myCustomEvent = new Event("flashcard-notification-click");
        document.dispatchEvent(myCustomEvent);
        refetchNotifications();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  return (
    <StyledContainer fluid>
      <Row className="flex-nowrap">
        <Col1>
          <ProfilePicture
            src={image || "/images/team-placeholder.png"}
            roundedCircle
            alt="profile"
            referrerPolicy="no-referrer"
          />
        </Col1>
        {(NotificationType === "GeneralNotification" ||
          type === "Flashcard_archived_owner" ||
          type === "Flashcard_archived_requested_user") && (
          <Col2 sm={10}>
            <Text>{text}</Text>

            <DateContainer>
              {moment(new Date(date)).format("MMM, DD, YYYY")}
            </DateContainer>
          </Col2>
        )}

        {type === "Question_merge_action" && status === "Active" && (
          <Col2
            cursorPointer
            sm={10}
            onClick={() => {
              router.push(`/manage/activity`);
            }}
          >
            <Text>{text}</Text>

            <DateContainer>
              {moment(new Date(date)).format("MMM, DD, YYYY")}
            </DateContainer>
          </Col2>
        )}

        {type === "Answer_merge_action" && status === "Active" && (
          <Col2
            cursorPointer
            sm={10}
            onClick={() => {
              router.push(`/manage/activity`);
            }}
          >
            <Text>{text}</Text>

            <DateContainer>
              {moment(new Date(date)).format("MMM, DD, YYYY")}
            </DateContainer>
          </Col2>
        )}

        {(type === "Question_merged" || type === "Question_merge_approved") && (
          <Col2
            sm={10}
            cursorPointer
            onClick={() => router.push(`/question/${questionId}?view=timeline`)}
          >
            <Text>
              {text} <b>-Merged</b>
            </Text>
            <DateContainer>
              {moment(new Date(date)).format("MMM, DD, YYYY")}
            </DateContainer>
          </Col2>
        )}

        {NotificationType === "QuestionNotification" &&
          type !== "Question_merge_action" &&
          type !== "Question_merged" &&
          type !== "Question_merge_approved" &&
          type !== "Answer_merge_action" && (
            <Col2
              cursorPointer
              sm={10}
              onClick={() => {
                router.push(`/question/${questionId}?view=timeline`);
              }}
            >
              <Text>{text}</Text>

              <DateContainer>
                {moment(new Date(date)).format("MMM, DD, YYYY")}
              </DateContainer>
            </Col2>
          )}

        {NotificationType === "FlashcardNotification" &&
          type !== "Flashcard_archived_owner" &&
          type !== "Flashcard_archived_requested_user" && (
            <Col2 sm={10}>
              <Text>
                {text}
                {status === "Requested" && (
                  <HighlightedClickText
                    className="mx-1"
                    cursorPointer
                    onClick={() => {
                        confirmAlert({
                          title: "Are you sure?",
                          message: "The flashcard will be Archived",
                          closeOnEscape: true,
                          closeOnClickOutside: true,
                          buttons: [
                            {
                              label: "Yes",
                              onClick: () => {
                                archiveFlashcardMutation.mutate({
                                  teamId: teamId,
                                  flashcardSetId: flashcardSetId,
                                  data: {
                                    status: "Approved",
                                    isActingSuperAdmin:
                                      localStorage.getItem("isSuperAdminView") ===
                                      "true"
                                        ? true
                                        : false,
                                  },
                                });
                                close();
                              },
                            },
                            {
                              label: "No",
                              onClick: () => close(),
                            },
                          ],
                        });
                    }}
                  >
                    -Take Action
                  </HighlightedClickText>
                )}
                {status === "Archive" && (
                  <HighlightedClickText className="mx-1">
                    -Archived
                  </HighlightedClickText>
                )}
              </Text>

              <DateContainer>
                {moment(new Date(date)).format("MMM, DD, YYYY")}
              </DateContainer>
            </Col2>
          )}

        {NotificationType === "InviteNotification" &&
          invite?.inviteStatus === "Invited" && (
            <Col2
              cursorPointer
              sm={10}
              onClick={() => {
                confirmAlert({
                  title: getPopupTitle(invite.type),
                  closeOnEscape: true,
                  closeOnClickOutside: true,
                  buttons: [
                    {
                      label: "Yes",
                      onClick: () => {
                        inviteMutation
                          .mutateAsync({
                            teamId: teamId,
                            token: inviteToken,
                            type: invite.type,
                          })
                          .then(() => {
                            mutation.mutateAsync(teamId).then((res) => {
                              setTeam(res.data);

                              if (invite.type === "Team") {
                                if (router.route !== "/detail") {
                                  router.push(`/detail?&fromInvite=${true}`);
                                } else {
                                  router.reload();
                                }
                              } else if (invite.type === "Question") {
                                if (
                                  router.route !==
                                  `/question/${invite.invitedQuestion.id}`
                                ) {
                                  router.push(
                                    `/question/${
                                      invite.invitedQuestion.id
                                    }?fromInvite=${true}`
                                  );
                                } else {
                                  router.reload();
                                }
                              } else if (invite.type === "Flashcard") {
                                router.push(
                                  `/flashcards/${
                                    invite.flashcardSetId
                                  }?fromInvite=${true}`
                                );
                              }
                            });
                          });
                      },
                    },
                    {
                      label: "No",
                      onClick: () => close(),
                    },
                  ],
                });
              }}
            >
              <Text>{text}</Text>

              <DateContainer>
                {moment(new Date(date)).format("MMM, DD, YYYY")}
              </DateContainer>
            </Col2>
          )}

        {NotificationType === "InviteNotification" &&
          invite?.inviteStatus === "Accepted" && (
            <Col2 sm={10}>
              <Text>
                {text} - <b>Accepted</b>
              </Text>

              <DateContainer>
                {moment(new Date(date)).format("MMM, DD, YYYY")}
              </DateContainer>
            </Col2>
          )}

        <Col3>{!isRead && <ReadIndicator />}</Col3>
      </Row>
    </StyledContainer>
  );
}

const StyledContainer = styled(Container)`
  &&& {
    .row {
      padding: 0;
      & > * {
        min-height: 78px;
        padding: 0;
        @media (max-width: 768px) {
          min-height: 48px;
        }
      }
    }
  }
`;

const Col1 = styled(Col)`
  &&& {
    display: flex;
    justify-content: start;
    align-items: center;
    min-width: 38px;
  }
`;

const Col2 = styled(Col)`
  &&& {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 0.5rem;
    cursor: ${(props) => (props.cursorPointer ? "pointer" : "auto")};
  }
`;

const Col3 = styled(Col)`
  &&& {
    display: flex;
    justify-content: end;
    align-items: center;
  }
`;

const ProfilePicture = styled(Image)`
  &&& {
    width: 38px;
    height: 38px;
  }
`;

const Text = styled.span`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #393d3e;
  white-space: normal;
  overflow: hidden;
`;

const DateContainer = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #393d3e;
  opacity: 0.5;
`;

const ReadIndicator = styled.div`
  width: 6px;
  height: 6px;
  background: #81c2c0;
  border-radius: 50%;
`;

const HighlightedClickText = styled.span`
  cursor: ${(props) => (props.cursorPointer ? "pointer" : "auto")};
  font-weight: bold;
`;
