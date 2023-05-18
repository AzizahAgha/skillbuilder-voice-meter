import React from "react";
import styled from "styled-components";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import moment from "moment";

const Author = ({ author, createdAt }) => (
  <Content>
    <OverlayTrigger
      placement="bottom"
      trigger={["hover", "hover"]}
      overlay={
        <Overlay>
          {author?.picture && (
            <Profile src={author.picture} referrerPolicy="no-referrer" />
          )}
          <Wrapper>
            <Name>{author?.name}</Name>
            <Text>
              {createdAt ? moment(createdAt).format("MMM DD @ h:mmA") : ""}
            </Text>
            <Text style={{ marginTop: "8px" }}>{author?.title}</Text>
            <Text>{author?.department}</Text>
          </Wrapper>
        </Overlay>
      }
    >
      <span>
        {author?.picture && (
          <Profile src={author.picture} referrerPolicy="no-referrer" />
        )}
        <Name className="ms-2">{author?.name}</Name>
      </span>
    </OverlayTrigger>
    {author?.name && createdAt && <span className="mx-1">|</span>}{" "}
    {/* Show "|" if both author name and date exist */}
    {!author?.name && "Created on "}
    <span className={!author?.name ? "fw-bold" : ""}>
      {createdAt ? new Date(createdAt).toString().slice(4, 10) : ""}
    </span>
  </Content>
);

const Content = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  color: #1f5462;

  & strong {
    font-weight: bold;
  }
`;

const Overlay = styled(Popover)`
  display: flex;
  flex-direction: row;
  align-items: "flex-start";
  padding: 10px;
  background: #ffffff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  border: 1px solid transparent;

  & .popover-arrow {
    display: none;
  }
`;

const Profile = styled.img`
  width: 30px !important;
  height: 30px !important;
  border: 1px solid #00364744 !important;
  border-radius: 30px;
`;

const Wrapper = styled.span`
  margin-left: 6px;
`;

const Text = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: regular;
  font-size: 12px;
  line-height: 14px;
  color: #969c9d;
`;

const Name = styled.span`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  color: #1f5462;
`;

export default Author;
