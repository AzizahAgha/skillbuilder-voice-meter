import React, { useState } from "react";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Image,
  Button as BsButton,
} from "react-bootstrap";
import moment from "moment";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import inviteService from "@services/invite.service";
import { useAppContext } from "@contexts/AppContext";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import teamService from "@services/team.service";
import flashcardService from "@services/flashcard.service";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import ActivityPopup from "./ActivityPopup";
import QuestionMergePopup from "./QuestionMergePopup";
import questionService from "@services/question.service";
import MergeSuccessPopup from "@ui-library/MergeSuccessPopup";
import { useAuthUser } from "@contexts/AuthContext";
import Bus from "@utils/Bus";

export default function ActivityItem({
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
  flashcardName,
  requestedName,
  userName,
  refetchActivitesNotifications,
  mergeId,
  mergeCount,
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
  const { team, setTeam } = useTeam();
  const mutation = useMutation((teamId) => teamService.updateStatus(teamId));
  const inviteMutation = useMutation(({ teamId, token, type }) =>
    inviteService.addUser(teamId, token, type)
  );

  const questionMergeApprovalMutation = useMutation(
    ({ data }) =>
      questionService.mergeQuestionApproval({
        teamId: teamId,
        mergeId: mergeId,
        data: data,
      }),
    {
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const archiveFlashcardMutation = useMutation(
    ({ teamId, flashcardSetId, data }) =>
      flashcardService.statusUpdate({ teamId, flashcardSetId, data }),
    {
      onSuccess: (res) => {
        let myCustomEvent = new Event("flashcard-notification-click");
        document.dispatchEvent(myCustomEvent);
        refetchNotifications && refetchNotifications();
        refetchActivitesNotifications && refetchActivitesNotifications();
      },
    }
  );
  const [showQMergePopup, setShowQMergePopup] = useState(false);
  const [showActivityPopup, setShowActivityPopup] = useState(false);
  const [choice, setChoice] = useState(null);
  const [showMergeSuccessPopup, setShowMergeSuccessPopup] = useState(false);
  const FlashcardStatusMutation = useMutation(
    ({ teamId, flashcardSetId, data }) =>
      flashcardService.statusUpdate({ teamId, flashcardSetId, data }),
    {
      onSuccess: () => {
        refetchActivitesNotifications && refetchActivitesNotifications();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );
  const { auth: { user: { isAdmin } = {} } = {} } = useAuthUser();
  return (
    <>
      {(type === "Flashcard_archive_action" && status === "Requested") ||
      (type === "Question_merge_action" && status === "Requested") ||
      (type === "Answer_merge_action" && status === "Requested") ? (
        <StyledContainer fluid show={true}>
          <Row className="flex-nowrap">
            <Col1>
              <ProfilePicture
                src={image || "/images/team-placeholder.png"}
                roundedCircle
                alt="profile"
                referrerPolicy="no-referrer"
              />
            </Col1>

            <Col2 sm={10}>
              <span className="mt-2">
                <ImageContainer>
                  <BsFillExclamationCircleFill color="#FF804A" size={18} />
                </ImageContainer>
                <Text>
                  <b>
                    Request:{" "}
                    {type === "Flashcard_archive_action" && "Flashcard Archive"}
                    {type === "Question_merge_action" && "Question Merge"}
                    {type === "Answer_merge_action" && "Answer Merge"}
                  </b>
                </Text>
              </span>
              <Text>{text}</Text>

              <DateContainer>
                {moment(new Date(date)).format("MMM, DD, YYYY")}
              </DateContainer>
              <ButtonContainer>
                {type === "Question_merge_action" && (
                  <StyledButton onClick={() => setShowQMergePopup(true)}>
                    Preview
                  </StyledButton>
                )}
                {type === "Answer_merge_action" && (
                  <StyledButton
                    onClick={() => {
                      setShowQMergePopup(true);
                    }}
                  >
                    Preview
                  </StyledButton>
                )}

                <StyledButton
                  color="#81C2C0"
                  text="#fff"
                  onClick={() => {
                    setShowActivityPopup(true);
                    setChoice("Decline");
                  }}
                >
                  Decline
                </StyledButton>
                <StyledButton
                  color="#FF804A"
                  text="#fff"
                  onClick={() => {
                    setShowActivityPopup(true);
                    setChoice("Accept");
                  }}
                >
                  Accept
                </StyledButton>
              </ButtonContainer>
            </Col2>
            <Col3>{!isRead && <ReadIndicator />} </Col3>
          </Row>

          <MergeSuccessPopup
            type="Approve"
            mergeType={type === "Question_merge_action" ? "Question" : "Answer"}
            requestedName={requestedName}
            adminName={team?.adminName}
            showMergeSuccessPopup={showMergeSuccessPopup}
            setShowMergeSuccessPopup={setShowMergeSuccessPopup}
            refetchActivitesNotifications={refetchActivitesNotifications}
            questionId={questionId}
            mergeCount={mergeCount}
            setShowActivityPopup={setShowActivityPopup}
            setShowQMergePopup={setShowQMergePopup}
          />

          {(type === "Question_merge_action" ||
            type === "Answer_merge_action") && (
            <QuestionMergePopup
              image={image}
              requestedName={requestedName}
              showQMergePopup={showQMergePopup}
              setShowQMergePopup={setShowQMergePopup}
              questionId={questionId}
              userName={userName}
              teamId={teamId}
              setShowActivityPopup={setShowActivityPopup}
              setChoice={setChoice}
              questionMergeApprovalMutation={questionMergeApprovalMutation}
              mergeId={mergeId}
              mergeType={
                type === "Question_merge_action" ? "Question" : "Answer"
              }
              mergeCount={mergeCount}
              adminName={team?.adminName}
              refetchActivitesNotifications={refetchActivitesNotifications}
              setShowMergeSuccessPopup={setShowMergeSuccessPopup}
            />
          )}

          <ActivityPopup
            type={
              type === "Flashcard_archive_action"
                ? "Flashcard"
                : type === "Question_merge_action"
                ? "Question"
                : "Answer"
            }
            showActivityPopup={showActivityPopup}
            setShowActivityPopup={setShowActivityPopup}
            adminName={team?.adminName}
            archiveFlashcardMutation={archiveFlashcardMutation}
            choice={choice}
            flashcardSetId={flashcardSetId}
            teamId={teamId}
            flashcardName={flashcardName}
            requestedName={requestedName}
            userName={userName}
            questionMergeApprovalMutation={questionMergeApprovalMutation}
            refetchActivitesNotifications={refetchActivitesNotifications}
            questionId={questionId}
            mergeCount={mergeCount}
            setShowMergeSuccessPopup={setShowMergeSuccessPopup}
          />
        </StyledContainer>
      ) : (
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
            {(type === "General" ||
              type === "Flashcard_archived_owner" ||
              type === "Flashcard_archived_requested_user") && (
              <Col2 sm={10}>
                <Text>{text}</Text>

                <DateContainer>
                  {moment(new Date(date)).format("MMM, DD, YYYY")}
                </DateContainer>
              </Col2>
            )}

            {type === "Question" && (
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
            {type === "Flashcard_archive_action" && status === "Decline" && (
              <Col2 sm={10}>
                <Text>{text}</Text>
                <Text>
                  <b>Request Declined</b>
                </Text>
                <DateContainer>
                  {moment(new Date(date)).format("MMM, DD, YYYY")}
                </DateContainer>
              </Col2>
            )}

            {type === "Flashcard_archived" && (
              <Col2 sm={10}>
                <Text>{text}</Text>
                <DateContainer>
                  {moment(new Date(date)).format("MMM, DD, YYYY")}
                </DateContainer>
              </Col2>
            )}
            {type === "Question_merge_action" && status === "Decline" && (
              <Col2 sm={10}>
                <Text>
                  {text} <b>-Declined</b>
                </Text>
                <DateContainer>
                  {moment(new Date(date)).format("MMM, DD, YYYY")}
                </DateContainer>
              </Col2>
            )}

            {(type === "Question_merged" ||
              type === "Question_merge_action" ||
              type === "Question_merge_approved" ||
              type === "Answer_merged" ||
              type === "Answer_merge_approved" ||
              type === "Answer_merge_action") &&
              status === "Merged" && (
                <Col2
                  sm={10}
                  cursorPointer
                  onClick={() =>
                    router.push(`/question/${questionId}?view=timeline`)
                  }
                >
                  <Text>
                    {text} <b>-Merged</b>
                  </Text>
                  <DateContainer>
                    {moment(new Date(date)).format("MMM, DD, YYYY")}
                  </DateContainer>
                </Col2>
              )}

            {(type === "Team" || type === "Question" || type === "Flashcard") &&
              invite?.inviteStatus === "Invited" && (
                <Col2
                  cursorPointer
                  sm={10}
                  onClick={() => {
                    const adminAlert = alert.show(
                      <ConfirmAlert
                        title={"Are you sure?"}
                        onDone={() => {
                          inviteMutation
                            .mutateAsync({
                              teamId: teamId,
                              token: inviteToken,
                              type: invite.type,
                            })
                            .then(() => {
                              mutation.mutateAsync(teamId).then(() => {
                                setTeam(teamId);

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

                          adminAlert.close();
                        }}
                        onCancel={() => adminAlert.close()}
                      />
                    );
                  }}
                >
                  <Text>{text}</Text>

                  <DateContainer>
                    {moment(new Date(date)).format("MMM, DD, YYYY")}
                  </DateContainer>
                </Col2>
              )}

            {(type === "Team" || type === "Question" || type === "Flashcard") &&
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
            {type === "Flashcard_archived" ? (
              <Col3>
                {isAdmin && status === "Archive" && (
                  <StyledButton
                    onClick={() => {
                      const unarchiveAlert = alert.show(
                        <ConfirmAlert
                          title={"Are you sure?"}
                          message={"The flashcard will be Unarchived"}
                          onDone={() => {
                            FlashcardStatusMutation.mutate({
                              teamId: teamId,
                              flashcardSetId: flashcardSetId,
                              data: { status: "Unarchive",isActingSuperAdmin: localStorage.getItem('isSuperAdminView') === 'true' ? true:false },
                            });
                          }}
                          onCancel={() => unarchiveAlert.close()}
                        />
                      );
                    }}
                  >
                    Unarchive
                  </StyledButton>
                )}

                {status === "Active" && (
                  <Text>
                    <b>Unarchvied</b>
                  </Text>
                )}
                {!isRead && <ReadIndicator />}
              </Col3>
            ) : (
              <Col3>{!isRead && <ReadIndicator />} </Col3>
            )}
          </Row>
        </StyledContainer>
      )}
    </>
  );
}

const ImageContainer = styled.span`
  display: inline-block;
  margin-right: 5px;
`;

const StyledButton = styled(BsButton)`
  &&& {
    background: #ffffff;
    border: 1px solid #969c9d;
    border-radius: 5px;
    color: ${(props) => (props.text ? props.text : "#969c9d")};
    margin: 10px 10px 10px 0px;
    width: 100px;
    text-align: center;
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 200;
    font-size: 18px;
    line-height: 20px;
    background: ${(props) => (props.color ? props.color : "")};
  }
`;

const StyledContainer = styled(Container)`
  &&& {
    border-left: ${(props) => (props.show ? "5px solid #ff804a" : "")};
    background: ${(props) => (props.show ? "rgba(255, 128, 74, 0.05)" : "")};
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
    max-width: 10%;
  }
`;

const Col2 = styled(Col)`
  &&& {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 0.5rem;
    max-width: 70%;
    cursor: ${(props) => (props.cursorPointer ? "pointer" : "auto")};
  }
`;

const Col3 = styled(Col)`
  &&& {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    max-width: 20%;
  }
`;

const Col4 = styled(Col)`
  &&& {
    display: flex;
    justify-content: start;
    align-items: center;
    min-height: 50px !important;
    flex-wrap: nowrap;
    align-items: flex-start;
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
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
