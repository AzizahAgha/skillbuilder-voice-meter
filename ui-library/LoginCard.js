import React from "react";
import { Card as BSCard, Modal as BSModal } from "react-bootstrap";
import styled from "styled-components";
import Auth0SignIn from "@ui-library/Auth0SignIn";

export default function LoginCard({ onSuccess, isLanding }) {
  return (
    <Card style={{width: isLanding ? "442px":"380px"}}>
      <Card.Body>
       {!isLanding && <Card.Title>Get 30 days of SkillBuilder.io for FREE!</Card.Title>}
        {!isLanding && <Card.Text>
          Login with Google and you&apos;ll be able to save and export all of
          you work <b>before</b> you pay. You won&apos;t lose anything you have
          already worked on.
        </Card.Text>}
        <Auth0SignIn
          callback={() => {
            if (typeof onSuccess === "function") onSuccess();
          }}
        />
      </Card.Body>
    </Card>
  );
}

const Card = styled(BSCard)`
  &&& {
    position: relative;
    background: #ffffff;
    border: 3.5px solid #81c2c0;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    border-radius: 5px;

    .card-body {
      display: flex;
      flex-direction: column;
      align-items: center;

      .card-title {
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: 500;
        font-size: 25px;
        line-height: 30px;
        text-align: center;
        color: #003647;
      }

      .card-text {
        font-family: Manrope;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 19px;
        text-align: center;
        color: #393d3e;
        margin-bottom: 0.5rem;
      }
    }
  }
`;

const BlankDiv = styled.div`
  min-width: 50px;
  min-height: 20px;
`;
