import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/router";
import { AiFillFlag } from "react-icons/ai";
import {
  IoDuplicate,
  IoShare,
  IoPersonAdd,
  IoArchive,
  IoEllipsisVertical,
} from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";
import styled from "styled-components";
import FlaggingPopup from "@components/flaggingPopup";
import { useMutation } from "react-query";
import flashcardService from "@services/flashcard.service";
import { useTeam } from "@contexts/TeamContext";
import moment from "moment";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import { useAppContext } from "@contexts/AppContext";
import { useAuthUser } from "@contexts/AuthContext";
import InvitesPopup from "@components/invites/InvitesPopup";
import InvitationsSentPopup from "@components/invites/InvitationsSentPopup";
import Bus from "@utils/Bus";
import SocialSharePopup from "@components/faq/SocialSharePopup";

function DropDownComponent({ user, data, refetchFlashcard }) {
  const today = new Date();
  const { alert } = useAppContext();
  const { team } = useTeam();
  const [showInvitesPopup, setShowInvitesPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSocialSharePopup, setShowSocialSharePopup] = useState(false);
  const mutation = useMutation(
    ({ teamId, data }) => flashcardService.create(teamId, data),
    {
      onSuccess: (res) => {
        refetchFlashcard && refetchFlashcard();
        router.push(`/flashcards/${res?.flashcardSetId}`);
      },
    }
  );
  const router = useRouter();
  const [showFlaggingPopup, setShowFlaggingPopup] = useState(false);

  const { auth: { user: { isAdmin } = {} } = {} } = useAuthUser();

  const FlashcardStatusMutation = useMutation(
    ({ teamId, flashcardSetId, data }) =>
      flashcardService.statusUpdate({ teamId, flashcardSetId, data }),
    {
      onSettled: () => {
        refetchFlashcard && refetchFlashcard();
      },
      onSuccess: () => {
        let myCustomEvent = new Event("flashcard-learn-options");
        document.dispatchEvent(myCustomEvent);

        const archiveMessage =
          data.status === "Active" &&
          alert.show(
            <ConfirmAlert
              doneLabel="Ok"
              message={
                data.status === "Active" &&
                `Archiving request sent to Team Admin for ${data.setTitle} flashcard set`
              }
              showCancel={false}
              onCancel={() => archiveMessage.close()}
            />
          );
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const handleClick = (action) => {
    switch (action) {
      case "Archive":
        const archiveAlert = alert.show(
          <ConfirmAlert
            title={"Are you sure?"}
            onDone={() => {
              FlashcardStatusMutation.mutate({
                teamId: team?.id,
                flashcardSetId: data.flashId,
                data: { status: "Archive",isActingSuperAdmin: localStorage.getItem('isSuperAdminView') === 'true' ? true:false },
              });
            }}
            onCancel={() => archiveAlert.close()}
          />
        );

        break;

      case "Unarchive":
        const unarchiveAlert = alert.show(
          <ConfirmAlert
            title={"Are you sure?"}
            message={"The flashcard will be Unarchived"}
            onDone={() => {
              FlashcardStatusMutation.mutate({
                teamId: team?.id,
                flashcardSetId: data.flashId,
                data: { status: "Unarchive",isActingSuperAdmin: localStorage.getItem('isSuperAdminView') === 'true' ? true:false },
              });
            }}
            onCancel={() => unarchiveAlert.close()}
          />
        );
        break;
    }
  };

  return (
    <>
      <Dropdown>
        <DropdownToggle variant="default">
          <MoreOptions color="#969C9D" />
        </DropdownToggle>
        <Dropdown.Menu>
          <StyledDropdownItem
            onClick={() =>
              data?.isFavorite
                ? router.push(`/flashcards/${data?.flashId}&isFavorite=${true}`)
                : router.push(`/flashcards/${data?.flashId}`)
            }
            disabled={
              ((data?.invitesUsers).includes(user?.data?.id) === false &&
                user?.data?.id !== data?.createdById) ||
              data?.status === "Archive" ||
              user?.data?.id !== data?.createdById
            }
          >
            <FaPencilAlt
              size={20}
              color={
                user?.data?.id !== data?.createdById ||
                data?.status === "Archive" ||
                (data?.invitesUsers).includes(user?.data?.id) === false
                  ? true
                  : false
                  ? "#969C9D"
                  : "#000000"
              }
            />
            <ItemInfo>Edit</ItemInfo>
          </StyledDropdownItem>

          <StyledDropdownItem
            onClick={() => {
              mutation.mutate({
                teamId: team?.id,
                data: {
                  isFavorite: data.isFavorite,
                  userId: data.createdById,
                  isDuplicate: true,
                  flashcardSetId: data.flashId,
                  setTitle:
                    data.setTitle.includes("Copy of") &&
                    data.setTitle.split(" ").some((e) => {
                      return moment(e.toString(), "MM-DD-YYYY", true).isValid();
                    })
                      ? `${data.setTitle
                          .split(" ")
                          .filter((e) => {
                            if (
                              moment(
                                e.toString(),
                                "MM-DD-YYYY",
                                true
                              ).isValid() === false
                            ) {
                              return e;
                            }
                          })
                          .join(" ")} ${moment(today).format("MM-DD-YYYY")}`
                      : data.setTitle.includes("Copy of")
                      ? `${data.setTitle} ${moment(today).format("MM-DD-YYYY")}`
                      : `Copy of ${data.setTitle}`,

                  setDescription: data.setDescription,
                  questions: [],
                },
              });
            }}
          >
            <IoDuplicate size={20} color="#000000" />
            <ItemInfo>Duplicate</ItemInfo>
          </StyledDropdownItem>

          <StyledDropdownItem onClick={() => setShowSocialSharePopup(true)}>
            {" "}
            <IoShare size={20} color="#000000" />
            <ItemInfo>Share</ItemInfo>
          </StyledDropdownItem>

          <StyledDropdownItem
            disabled={
              data?.status === "Archive" ||
              data?.isFavorite === true ||
              user?.data?.id !== data?.createdById ||
              Number(data?.invitesCount) >= 5
            }
            onClick={() => setShowInvitesPopup(true)}
          >
            <IoPersonAdd
              size={20}
              color={
                data?.status === "Archive" ||
                data?.isFavorite === true ||
                user?.data?.id !== data?.createdById ||
                Number(data?.invitesCount) >= 5
                  ? "#969C9D"
                  : "#000000"
              }
            />

            <ItemInfo>Invite</ItemInfo>
          </StyledDropdownItem>

          <StyledDropdownItem
            onClick={() => setShowFlaggingPopup(true)}
            disabled={data?.isFlagged || data?.status === "Archive"}
          >
            <AiFillFlag
              size={20}
              color={
                data?.isFlagged || data?.status === "Archive"
                  ? "#969C9D"
                  : "#000000"
              }
            />
            <ItemInfo>Flag</ItemInfo>
          </StyledDropdownItem>

          {data?.isFavorite === false &&
            (data?.status === "Active" ||
              data?.status === "Decline" ||
              data?.status === "Requested") && (
              <StyledDropdownItem
                disabled={data?.status === "Requested"}
                onClick={() => handleClick("Archive")}
              >
                <IoArchive
                  size={20}
                  color={data?.status === "Requested" ? "#969C9D" : "#000000"}
                />
                <ItemInfo>Archive</ItemInfo>
              </StyledDropdownItem>
            )}

          {isAdmin && data?.status === "Archive" && (
            <StyledDropdownItem onClick={() => handleClick("Unarchive")}>
              <IoArchive size={20} color="#000000" />
              <ItemInfo>UnArchive</ItemInfo>
            </StyledDropdownItem>
          )}
        </Dropdown.Menu>
      </Dropdown>
      <FlaggingPopup
        show={showFlaggingPopup}
        handleClose={() => setShowFlaggingPopup(false)}
        flashId={data?.flashId}
        createdById={data?.createdById}
        refetchFlashcard={refetchFlashcard}
      />
      <InvitesPopup
        show={showInvitesPopup}
        handleClose={() => setShowInvitesPopup(false)}
        showConfirmationPopup={() => setShowConfirmationPopup(true)}
        teamId={team?.id}
        showCloseBtn
        inviteType="Flashcard"
        flashcardSetId={data?.flashId}
        invitesCount={data?.invitesCount}
        refetchFlashcard={refetchFlashcard}
      />

      <InvitationsSentPopup
        show={showConfirmationPopup}
        handleClose={() => setShowConfirmationPopup(false)}
        onSendMoreInvites={() => setShowInvitesPopup(true)}
        refetchFlashcard={refetchFlashcard}
        FlashcardName={data?.setTitle}
      />
      <SocialSharePopup
        showSocialSharePopup={showSocialSharePopup}
        setShowSocialSharePopup={setShowSocialSharePopup}
        data={data}
        flashId={data?.flashId}
        teamId={team?.id}
      />
    </>
  );
}

export default DropDownComponent;

const DropdownToggle = styled(Dropdown.Toggle)`
  &&& {
    background: none;
    border: none;
    box-shadow: none;

    &:hover {
      background: none;
    }
    &:focus {
      background: none;
    }

    &:after {
      content: none;
    }
  }
`;
const MoreOptions = styled(IoEllipsisVertical)`
  justify-self: end;
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  &&& {
    display: flex;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  }
`;

const ItemInfo = styled.div`
  padding-left: 10px;
`;
