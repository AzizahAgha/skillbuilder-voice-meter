import React from "react";
import styled from "styled-components";
import { Accordion as BsAccordion } from "react-bootstrap";
import VersionCard from "./VersionCard";

export default function SubAccordion({ data }) {
  return (
    <Accordion
      defaultActiveKey={[...Array(data.length).keys()].map(String)}
      flush
      id="sub-accordion"
      alwaysOpen
    >
      {data?.map((versions, idx) => (
        <Accordion.Item eventKey={idx.toString()} key={idx}>
          <Accordion.Header>
            <div className="header-content">
              <div className="title">{versions[0].month}</div>
              <div className="info">{versions.length} update</div>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            {versions.map((version, index) => (
              <VersionCard
                key={index}
                id={version.id}
                author={version.author}
                createdAt={version.createdAt}
                isCurrentVersion={idx === 0 && index === 0}
                isMostPopular={version.isMostPopular}
                isMostUpvoted={version.isMostUpvoted}
                upvotes={version.upvotes}
                isMerged={version.isMerged}
                mergeId={version.mergeId}
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

const Accordion = styled(BsAccordion)`
  &&& {
    &#sub-accordion .accordion-header > button {
      background: #969c9d;
      padding: 0.1rem 0.8rem;
      padding-left: 1.5rem;

      &::after {
        filter: brightness(730%) sepia(100%) hue-rotate(161deg) saturate(23%);
      }

      & > .header-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-family: Manrope;
          font-style: normal;
          font-weight: bold;
          font-size: 14px;
        }

        .info {
          font-family: Manrope;
          font-size: 12px;
          text-align: right;
          color: #ffffff;
          opacity: 1 !important;
        }
      }
    }
  }
`;
