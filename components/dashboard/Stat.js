import React from "react";
import styled from "styled-components";

export default function Stat({ count = "", label = "", note = "" }) {
  return (
    <StatContainer>
      <Count>{count}</Count>
      <Label>{label}</Label>
      <Text>{note}</Text>
    </StatContainer>
  );
}

const StatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Count = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 600;
  font-size: 80px;
  line-height: 120px;
  color: #003647;
`;

const Label = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 31px;
  color: #1f5462;
`;

const Text = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #969c9d;
`;
