import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Title from '@ui-library/FilterComponentTitle';
import CheckboxFieldArray from '@ui-library/CheckboxFieldArray';

export default function Confidence() {
  const fields = [
    { value: 1, label: 'Low Confidence' },
    { value: 2, label: 'Slight Confidence' },
    { value: 3, label: 'Confident' },
    { value: 4, label: 'High Confidence' },
    { value: 5, label: 'Extreme Confidence' }
  ];

  return (
    <>
      <Row>
        <Col>
          <Title>Confidence</Title>
        </Col>
      </Row>
      <Row md={2} lg={2} className='mb-4'>
        <Col className='pe-0  d-flex flex-column'>
          <CheckboxFieldArray name='confidence' fields={fields.slice(0, 3)} />
        </Col>
        <Col className='pe-0  d-flex flex-column'>
          <CheckboxFieldArray name='confidence' fields={fields.slice(3, 5)} />
        </Col>
      </Row>
    </>
  )
}
