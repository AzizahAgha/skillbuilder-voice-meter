import React from 'react'
import { Row, Col, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import Title from '@ui-library/FilterComponentTitle';
import { useFormikContext } from 'formik';

export default function NumberOfAnswers({ type }) {
  const formik = useFormikContext();
  
  return (
    <>
      <Row>
        <Col>
          <Title>Number of Answers</Title>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col>
          <Input
            type='number'
            value={formik.values.noOfAnswers.min}
            onChange={e => formik.setFieldValue('noOfAnswers.min', e.target.value)}
            placeholder='Minimum'
          />
        </Col>
        <Col>
          <Input
            value={formik.values.noOfAnswers.max}
            onChange={e => formik.setFieldValue('noOfAnswers.max', e.target.value)}
            placeholder='Maximum'
          />
        </Col>
      </Row>
    </>
  )
}

const Input = styled(FormControl)`
&&& {
  background: #FFFFFF;
  border: 1px solid #003647;
  box-sizing: border-box;
  border-radius: 5px;

  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  text-align: center;
  color: #969C9D;
  opacity: .8;

  &:focus {
    border-color: #003647;
  }

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
}
`
