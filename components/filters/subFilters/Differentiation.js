import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Title from '@ui-library/FilterComponentTitle';
import CheckboxFieldArray from '@ui-library/CheckboxFieldArray';


export default function Differentiation() {
  const fields = [
    { value: 1, label: 'Low Differentiation', id: `diff-1` },
    { value: 2, label: 'Slight Differentiation', id: `diff-2` },
    { value: 3, label: 'Differentiated', id: `diff-3` },
    { value: 4, label: 'High Differentiation', id: `diff-4` },
    { value: 5, label: 'Extreme Differentiation', id: `diff-5` }
  ];

  return (
    <>
      <Row>
        <Col>
          <Title>Differentiation</Title>
        </Col>
      </Row>
      <Row sm={2} md={2} lg={2} className='mb-4'>
        <Col className='pe-0 d-flex flex-column'>
          <CheckboxFieldArray name='differentiation' fields={fields.slice(0, 3)} />
        </Col>
        <Col className='pe-0 d-flex flex-column'>
          <CheckboxFieldArray name='differentiation' fields={fields.slice(3, 5)} />
        </Col>
      </Row>
    </>
  )
}
