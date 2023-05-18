import React, { useEffect } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import BellIcon from "@public/icons/bell";
import styled from "styled-components";
import { MdArrowForwardIos as Arrow } from "react-icons/md";
import NotificationItem from "./NotificationItem";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import notificationService from "@services/notification.service";
import moment from "moment";
import Link from "next/link";
import Bus from "@utils/Bus";

export default function NotificationDropdown() {
  const queryClient = useQueryClient();
  const { team } = useTeam();

  const {
    data: notifications,
    isFetched,
    refetch: refetchNotifications,
  } = useQuery(
    ["notification", team?.id],
    () =>
      notificationService.getFive(team.id, {
        year: moment().year(),
        isActingSuperAdmin:
          localStorage.getItem("isSuperAdminView") === "true" ? true : false,
      }),
    {
      enabled: !!team?.id,
      // refetchInterval: 15000
    }
  );

  const mutation = useMutation(
    (notificationIds) => notificationService.update(team.id, notificationIds),
    {
      onSuccess: () => {
        refetchNotifications && refetchNotifications();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const NotificationType = ({ questionId, flashcardSetId, inviteToken }) => {
    const temp =
      Number(Boolean(questionId)).toString() +
      Number(Boolean(flashcardSetId)).toString() +
      Number(Boolean(inviteToken)).toString();

    switch (temp) {
      case "000":
        return "GeneralNotification";

      case "100":
        return "QuestionNotification";

      case "010":
        return "FlashcardNotification";

      case "001":
        return "InviteNotification";

      case "101":
        return "InviteNotification";

      case "011":
        return "InviteNotification";
    }
  };

  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener(
        "flashcard-learn-options",
        refetchNotifications,
        false
      );
    } else {
      document.attachEvent("flashcard-learn-options", refetchNotifications);
    }
  }, []);

  return (
    <Dropdown align={{ lg: "end" }}>
      <Dropdown.Toggle split variant="secondary" className="rounded-circle">
        <BellIcon
          onClick={() => {
            if (!mutation.isLoading) {
              let unread = notifications?.data?.map(
                (_notif) => !_notif.isRead && _notif.id
              );

              unread = unread.filter((_id) => _id);

              if (unread.length) {
                mutation.mutate(unread);
              }
            }
          }}
        />
        {isFetched && notifications?.unreadCount > 0 && (
          <NotificationCount bg="danger">
            {notifications?.unreadCount}
          </NotificationCount>
        )}
      </Dropdown.Toggle>

      <DropdownMenu className="shadow-sm">
        {isFetched &&
          notifications?.data.map((_notif, idx) => (
            <Dropdown.Item key={idx}>
              <NotificationItem
                {..._notif}
                onPage={false}
                NotificationType={NotificationType({ ..._notif })}
                refetchNotifications={refetchNotifications}
              />
            </Dropdown.Item>
          ))}

        <Link href="/manage/activity" passHref>
          <SeeAllLink>
            See all recent activity <Arrow color="#81C2C0" />
          </SeeAllLink>
        </Link>
      </DropdownMenu>
    </Dropdown>
  );
}

const DropdownMenu = styled(Dropdown.Menu)`
  &&& {
    width: 400px;
    max-height: 274px;
    overflow-y: auto;

    @media (max-width: 768px) {
      position: fixed;
      width: auto;
      left: 10px;
      right: 10px;
      top: auto;

      .dropdown-item {
        width: 85%;
      }
    }
  }
`;

const NotificationCount = styled(Badge)`
  &&& {
    border-radius: 50rem;
    background-color: #c10840;
    position: absolute !important;
    top: 2px !important;
    left: 100%;
    transform: translate(-50%, -50%);
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
  }
`;

const SeeAllLink = styled(Dropdown.Item)`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    text-transform: capitalize;
    color: #81c2c0;
    text-align: right;
  }
`;
