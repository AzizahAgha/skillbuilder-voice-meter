import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Checkbox from '@ui-library/Checkbox';
import Title from '@ui-library/FilterComponentTitle';
import CheckboxFieldArray from '@ui-library/CheckboxFieldArray';

export default function Risk() {
  return (
    <>
      <Row>
        <Col>
          <Title>Risk</Title>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col className='d-flex justify-content-between flex-wrap me-5'>
          <CheckboxFieldArray 
            name='risk'
            fields={[
              { value: 'high', label: 'High', id: 'risk-high' },
              { value: 'medium', label: 'Medium', id: 'risk-medium' },
              { value: 'low', label: 'Low', id: 'risk-low' },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}
