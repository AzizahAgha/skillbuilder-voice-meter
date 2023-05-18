import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import { MdArrowForwardIos as Arrow } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import FlagIcon from "@public/icons/flag";
import { useTeam } from "@contexts/TeamContext";
import notificationService from "@services/notification.service";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { getNotificationUpdates } from "/queries/notification";

export default function NotificationPopup() {
  const { team } = useTeam();
  const router = useRouter();
  const [notifications, setNotif] = useState([]);
  const { data: liveNotif } = getNotificationUpdates();

  const renderIcon = (type) => {
    if (type == "Question_merge_approved" || type == "Answer_merge_approved") {
      return <IoCopyOutline size={20} color="#fff" />;
    } else if (type == "Answer_Flagged") {
      return <FlagIcon height={20} color="#fff" />;
    } else {
      return;
    }
  };

  const renderTitle = (type) => {
    if (type == "Question_merge_approved" || type == "Answer_merge_approved") {
      if (type.includes("Question")) {
        return `YOUR QUESTION HAS BEEN MERGED`;
      } else {
        return `YOUR ANSWER HAS BEEN MERGED`;
      }
    } else if (type == "Answer_Flagged") {
      return `YOUR ANSWER HAS BEEN FLAGGED`;
    } else {
      return;
    }
  };

  const getTheme = (type) => {
    if (type == "Question_merge_approved" || type == "Answer_merge_approved") {
      return "dark";
    } else if (type == "Answer_Flagged") {
      return "light";
    } else {
      return "light";
    }
  };

  const mutation = useMutation((notificationIds) =>
    notificationService.update(team.id, notificationIds)
  );

  const closeNotif = (notifid) => {
    const copy = notifications.filter((e) => {
      if (e.id !== notifid) {
        return e;
      }
    });
    setNotif([...copy]);
    let notificationIds = [notifid];
    mutation.mutate(notificationIds);
  };

  useEffect(() => {
    if (liveNotif !== undefined && liveNotif.length > 0) {
      setNotif(liveNotif);
    }
  }, [liveNotif]);

  const handleClick = (notif) => {
    closeNotif(notif.id);
    router.push(`/question/${notif.questionId}?view=timeline`);
  };

  return (
    <>
      {notifications !== undefined && notifications.length > 0 && (
        <Notif className="show">
          {notifications.map((obj) => (
            <Item key={obj.id} theme={getTheme(obj.type)} className="item show">
              <CloseButton onClick={() => closeNotif(obj.id)}>
                <CloseIcon size={24} color="#fff" />
              </CloseButton>
              <h3>
                {renderIcon(obj.type)} {renderTitle(obj.type)}
                <span onClick={() => handleClick(obj)}>
                  <Arrow size={20} color="#fff" />
                </span>
              </h3>
              <p>
                {obj.message}{" "}
                <span onClick={() => handleClick(obj)}>click here</span>.
              </p>
            </Item>
          ))}
        </Notif>
      )}
    </>
  );
}

const Anim = keyframes`
    0%      { opacity: .5; top:50px; }
    100% { opacity: 1; top:110px; }
`;

const Notif = styled.div`
  position: fixed;
  display: none;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  z-index: 1001;
  animation: 1s ${Anim} ease-in;
  .item {
    border-radius: 6px;
    padding: 12px 28px;
    margin-bottom: 15px;
    position: relative;
    display: none;
    h3 {
      text-transform: uppercase;
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      color: #fff;
      margin: 0 0 4px;
    }
    p {
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 19px;
      color: #fff;
      margin: 0;
    }
    svg {
      cursor: pointer;
      vertical-align: middle;
    }
    a {
      color: #fff;
    }
    &.show {
      display: block;
    }
    span {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  &.show {
    display: block;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 4px;
  top: 8px;
`;

const Item = styled.div`
  background-color: ${(props) =>
    props.theme == "dark" ? "#1F5462" : "#81C2C0"};
  border: 1px solid #1f5462;
`;
