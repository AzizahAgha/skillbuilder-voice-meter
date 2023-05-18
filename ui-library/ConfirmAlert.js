import React from "react";
import styled from "styled-components";
import { Button as BsButton } from "react-bootstrap";

const Alert = ({
  title,
  message,
  onDone,
  onCancel,
  showDone = true,
  showCancel = true,
  doneLabel = "Yes",
  cancelLabel = "Cancel",
}) => (
  <Container>
    {title && <Text>{title}</Text>}
    {message && <Label>{message}</Label>}
    <Row>
      {showDone && (
        <Button variant="outline-primary" onClick={onDone}>
          {doneLabel}
        </Button>
      )}
      {showCancel && (
        <Button variant="primary" onClick={onCancel}>
          {cancelLabel}
        </Button>
      )}
    </Row>
  </Container>
);

const Text = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.02em;
  color: #003647;
  margin-bottom: 4px;
  text-align: center;
  padding: 20px;
`;

const Label = styled.div`
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  color: #003647;
  text-align: center;
  margin-bottom: 32px;
`;

const Container = styled.div`
  background: #ffffff;
  border: 2px solid transparent;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  cursor: pointer;
  padding: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Button = styled(BsButton)`
  &&& {
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    margin: auto 0.25rem;
    padding: 0.375rem 1.35rem;
  }
`;

export default Alert;
