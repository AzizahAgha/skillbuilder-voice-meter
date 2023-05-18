import React from 'react';
import styled from 'styled-components';
import { Form } from "react-bootstrap";

const FormGroup = styled(Form.Group)`
  &&& {
    margin-bottom: 1rem;

    input,
    textarea {
      padding: 0.5rem;
      font-size: 0.8rem;
    }
  }
`;

export default FormGroup;