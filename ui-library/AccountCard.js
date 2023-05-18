import React from "react";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import Highlighter from "react-highlight-words";
import { BiSupport } from "react-icons/bi";
import { useTeam } from '@contexts/TeamContext';
import { useRouter } from "next/router";
import Tooltip from "@ui-library/Tooltip";

const Container = styled.div`
  background: #ffffff;
  border: 2px solid transparent;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 20px;
  height: 100%;
  position: relative;
  &:hover {
    border-color: #81c2c0;
  }
  .supportWrap{
    position: absolute;
    top: 12px;
    right: 12px;
    width: 26px;
    height: 26px;
    background-color: #81c2c0;
    border-radius: 50%;
    text-align: center;
    padding: 2px;
    cursor: pointer;
  }
`;

const Label = styled.span`
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
`;

const Value = styled.span`
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
  margin-left: 4px;
`;

const Text = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.02em;
  color: #003647;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HorizontalLine = styled.div`
  border-bottom: 1px solid #81c2c0;
  margin-top: 10px;
  margin-bottom: 20px;
  height: 0;
`;

const AccountCard = ({ data, searchKeyword }) => {
  const { team, setTeam } = useTeam();
  const router = useRouter();

  const changeTeam = (newTeam)=>{
    let teamObj = newTeam;
    teamObj.id = newTeam.teamId;
    teamObj.isAdmin = false;
    teamObj.isAuthor = false;
    teamObj.isSuperAdmin = true;
    teamObj.displayName = newTeam.teamName;
    localStorage.setItem("isSuperAdminView",true);
    localStorage.setItem("superAdminTeam",newTeam.teamId);
    if(newTeam.teamId != team?.id){
      setTeam(teamObj);
    }
    if (router.route !== "/detail") router.push("/detail");
  }

  return(
    <Container>
      <Tooltip text={data.teamName}>
        <Text>
          <Highlighter
            highlightClassName="highlight"
            searchWords={[searchKeyword]}
            autoEscape={true}
            textToHighlight={data.teamName}
          />
        </Text>
      </Tooltip>
      
      <div className="mb-1">
        <Label>Owner:</Label>
        <Value>{`${data.firstName ?? ""} ${data.lastName ?? ""}`}</Value>
      </div>
      <div className="mb-1">
        <Label>Email:</Label>
        <Value>{data.email}</Value>
      </div>
      {data.status == "Active" &&(
        <div className="supportWrap" onClick={()=>changeTeam(data)}>
          <BiSupport color="#fff" size={18}/>
        </div>
      )}
      
      <HorizontalLine />

      <Row>
        <Col className="mb-sm-3 col-sm-4">
          <Label>Users</Label>
          <Value>{data.totalUsers}</Value>
        </Col>
        <Col className="mb-sm-3 col-sm-4">
          <Label>Questions</Label>
          <Value>{data.totalQuestions}</Value>
        </Col>
        <Col className="mb-sm-3 col-sm-4">
          <Label>Answers</Label>
          <Value>{data.totalAnswers}</Value>
        </Col>
        <Col className="mb-sm-3 col-sm-4">
          <Label>Billing</Label>
          <Value>{data.billing}</Value>
        </Col>
        <Col className="mb-sm-3 col-sm-4">
          <Label>Status</Label>
          <Value>{data.status}</Value>
        </Col>
      </Row>
    </Container>
  )
  
};

export default AccountCard;
