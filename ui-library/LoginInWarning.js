import React, { useEffect, useState } from "react";
import { Card as BSCard } from "react-bootstrap";
import styled from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Auth0SignIn from "@ui-library/Auth0SignIn";

export default function LoginInWarning({ dismissWarning, onLoginSuccess }) {

  return (
    <Card>
      <CloseButton onClick={dismissWarning}>
        <CloseIcon size={24} color="#969C9D" />
      </CloseButton>

      <Card.Body>
        <Card.Title>Don&apos;t Loose All Your Work!</Card.Title>
        <Card.Text>
          You have typed in 20 questions, which is great. We suggest you sign in
          with Google to save your progress. It&apos;s free for 30 days and you
          won&apos;t lose anything you have already entered.
        </Card.Text>
        
          <Auth0SignIn callback={onLoginSuccess}/>
       
      </Card.Body>
    </Card>
  );
}

const Card = styled(BSCard)`
  &&& {
    position: relative;
    width: 357px;
    height: 202px;

    background: #ffffff;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    margin: 1rem;

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

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 2px;
  top: 2px;
`;

const BlankDiv = styled.div`
  min-width: 50px;
  min-height: 20px;
`;
