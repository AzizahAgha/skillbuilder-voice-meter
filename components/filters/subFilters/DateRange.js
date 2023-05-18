import React, { useRef } from 'react'
import { Row, Col, FormControl } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import Title from '@ui-library/FilterComponentTitle';
import moment from 'moment';

export default function DateRange({ type }) {
  const formik = useFormikContext();
  const startDateRef = useRef();
  const endDateRef = useRef();

  return (
    <>
      <Row>
        <Col>
          <Title>Date Range</Title>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col>
          <Input
            value={formik.values[`${type}ByDateRange`].start}
            onChange={e => formik.setFieldValue(`${type}ByDateRange.start`, e.target.value)}
            placeholder='Start Date'
            ref={startDateRef}
            onFocus={() => (startDateRef.current.type = "date")}
            onBlur={() => (startDateRef.current.type = "date")}
            max={moment().format('YYYY-MM-DD')}
          />
        </Col>
        <Col>
          <Input
            value={formik.values[`${type}ByDateRange`].end}
            onChange={e => formik.setFieldValue(`${type}ByDateRange.end`, e.target.value)}
            placeholder='End Date' 
            ref={endDateRef}
            onFocus={() => (endDateRef.current.type = "date")}
            onBlur={() => (endDateRef.current.type = "date")}
            max={moment().format('YYYY-MM-DD')}
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
}
`
