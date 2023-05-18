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
  handleAccordionSelect,
  activeKey,
  accordionData,
  notificationData,
  refetchActivitesNotifications,
  userName,
}) {
  return (
    <>
      <AccordionContainer>
        <Accordion
          activeKey={activeKey}
          onSelect={(e) => handleAccordionSelect(e)}
          flush
          alwaysOpen
        >
          {accordionData
            .slice(0)
            .reverse()
            .map((item, key) => (
              <Accordion.Item
                key={key}
                eventKey={item + "_" + moment().month(item).format("M")}
              >
                <Accordion.Header>{item}</Accordion.Header>
                <Accordion.Body>
                  {notificationData &&
                    notificationData[item].map((notif, idx) => (
                      <ActivityItem
                        {...notif}
                        key={idx}
                        onPage={true}
                        refetchActivitesNotifications={
                          refetchActivitesNotifications
                        }
                        userName={userName}
                      />
                    ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      </AccordionContainer>
    </>
  );
}
const AccordionContainer = styled.div`
  margin-top: 50px;
`;
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
      & > *:not(p) {
        border-bottom: 0.5px solid #969c9d;
      }
    }
  }
`;
