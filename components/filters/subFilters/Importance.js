import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Title from '@ui-library/FilterComponentTitle';
import CheckboxFieldArray from '@ui-library/CheckboxFieldArray';


export default function Importance() {
  const fields = [
    { value: 1, label: 'Low Importance', id: `imp-1` },
    { value: 2, label: 'Slight Importance', id: `imp-2` },
    { value: 3, label: 'Important', id: `imp-3` },
    { value: 4, label: 'High Importance', id: `imp-4` },
    { value: 5, label: 'Extreme Importance', id: `imp-5` }
  ];

  return (
    <>
      <Row>
        <Col>
          <Title>Importance</Title>
        </Col>
      </Row>
      <Row sm={2} md={2} lg={2} className='mb-4'>
        <Col className='pe-0 d-flex flex-column'>
          <CheckboxFieldArray name='importance' fields={fields.slice(0, 3)} />
        </Col>
        <Col className='pe-0 d-flex flex-column'>
          <CheckboxFieldArray name='importance' fields={fields.slice(3, 5)} />
        </Col>
      </Row>
    </>
  )
}


