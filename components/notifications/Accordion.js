import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Accordion as BsAccordion } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import notificationService from "@services/notification.service";
import ActivityItem from "./ActivityItem";
import Bus from "@utils/Bus";
import moment from "moment";

export default function NotificationsAccordion({
  activities,
  type,
  refetchActivitesNotifications,
  userName,
  setSelectedMonth,
  selectedYear,
  selectedMonth,
}) {
  const getInitialState = () => {
    let fullYearObject = {
      January: [],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: [],
    };
    if (selectedYear.getFullYear() === new Date().getFullYear()) {
      let startDate = moment(new Date(new Date().getFullYear(), 0, 1));
      let endDate = moment(Date());

      let betweenMonths = [];
      let newobject = {};

      if (startDate < endDate) {
        var date = startDate.startOf("month");
        while (date < endDate.endOf("month")) {
          betweenMonths.push({ [date.format("MMMM")]: [] });
          newobject[date.format("MMMM")] = [];
          date.add(1, "month");
        }
      }
      return newobject;
    }
    return fullYearObject;
  };

  const [accordionData, setAccordionData] = useState(getInitialState());
  const [collapsedStatus, setCollapsedStatus] = useState({
    January: false,
    February: false,
    March: false,
    April: false,
    May: true,
    June: false,
    July: false,
    August: false,
    September: false,
    October: false,
    November: false,
    December: false,
  });
  useEffect(() => {
    setAccordionData(getInitialState());
  }, [selectedYear]);

  useEffect(() => {
    setAccordionData((current) => {
      return {
        ...current,
        [selectedMonth]: [...current[selectedMonth], ...activities],
      };
    });
  }, [selectedMonth, selectedYear]);
  return (
    <>
      <Accordion defaultActiveKey={[0]} flush alwaysOpen>
        {Object.keys(accordionData).map((key, idx) => (
          <AccordionItem
            name={key}
            index={idx}
            notifications={accordionData[key].filter((e) => {
              if (type === "all") {
                return e;
              } else {
                if (e.groupType === type) {
                  return e;
                }
              }
            })}
            key={idx}
            refetchActivitesNotifications={refetchActivitesNotifications}
            userName={userName}
            setSelectedMonth={setSelectedMonth}
          />
        ))}
      </Accordion>
    </>
  );
}

const AccordionItem = ({
  notifications,
  index,
  refetchActivitesNotifications,
  userName,
  setSelectedMonth,
  name,
}) => {
  const { team } = useTeam();

  const mutation = useMutation(
    (notificationIds) => notificationService.update(team.id, notificationIds),
    {
      onSuccess: () => {
        refetchActivitesNotifications && refetchActivitesNotifications();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const markAsRead = useCallback(() => {
    if (!mutation.isLoading) {
      let unread = notifications?.map((_notif) => !_notif.isRead && _notif.id);
      unread = unread.filter((_id) => _id);

      if (unread.length) {
        mutation.mutate(unread);
      }
    }
  }, []);

  useEffect(() => {
    if (index === 0) {
      markAsRead();
    }
  }, []);

  return (
    <>
      <Accordion.Item eventKey={index} onClick={() => markAsRead()}>
        <Accordion.Header onClick={() => setSelectedMonth(name)}>
          {name}
        </Accordion.Header>
        <Accordion.Body>
          {notifications.map((notif, idx) => (
            <ActivityItem
              {...notif}
              key={idx}
              onPage={true}
              refetchActivitesNotifications={refetchActivitesNotifications}
              userName={userName}
            />
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
};

const Accordion = styled(BsAccordion)`
  &&& {
    .accordion-header > button {
      background: #81c2c0;
      padding: 0.1rem 0.8rem;
      padding-left: 1.5rem;

      font-family: "Barlow Condensed";
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 34px;
      color: #ffffff;

      &::after {
        filter: brightness(730%) sepia(100%) hue-rotate(161deg) saturate(23%);
      }
    }

    .accordion-body {
      padding: 0;
      & > * {
        border-bottom: 0.5px solid #969c9d;
      }
    }
  }
`;
