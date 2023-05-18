import React from "react";
import styled from 'styled-components';
// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
};

// Formats objects for setting up the Quill editor
export const formats = [
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

// Quill Toolbar component
const Toolbar = ({ id }) => (
  <ToolbarContainer id={id}>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-link" />
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
    </span>
  </ToolbarContainer>
);

export default Toolbar;


const ToolbarContainer = styled.div`
&&& {
  padding: 0;
  border: none;

  button {
    margin-right: 0.6rem;
  }
}
`


