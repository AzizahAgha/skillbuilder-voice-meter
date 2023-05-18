import React from "react";
import styled from "styled-components";

const SerialNumberUI = ({value}) => {
    return (
        <Number>{`${value}`.padStart(2, "0")}</Number>
    );
};

export default SerialNumberUI;

const Number = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #1F5462;
`;