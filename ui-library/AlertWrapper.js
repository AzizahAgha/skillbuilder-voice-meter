import React from "react";
import styled from "styled-components";
import { useAppContext } from "@contexts/AppContext";

const AlertWrapper = ({ children }) => {
  const { alert } = useAppContext();

  return (
    children?.length > 0 && (
      <Container
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          alert.removeAll();
        }}
      >
        {children}
      </Container>
    )
  );
};

const Container = styled.div`
  left: 0;
  top: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  outline: none;
  background: #00000044;
  z-index: 10;
`;

export default AlertWrapper;
