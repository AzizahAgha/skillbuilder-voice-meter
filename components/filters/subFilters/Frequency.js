import React from 'react'
import { Row, Col } from 'react-bootstrap';
import CheckboxFieldArray from '@ui-library/CheckboxFieldArray';
import Title from '@ui-library/FilterComponentTitle';

export default function Frequency() {
  return (
    <>
      <Row>
        <Col>
          <Title>Frequency</Title>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col className='d-flex justify-content-between flex-wrap me-5'>
          <CheckboxFieldArray 
            name='frequency' 
            fields={[
              { value: 'always', label: 'Always' },
              { value: 'sometimes', label: 'Sometimes' },
              { value: 'rarely', label: 'Rarely' },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}
