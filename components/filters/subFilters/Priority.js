import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Title from '@ui-library/FilterComponentTitle';
import CheckboxFieldArray from '@ui-library/CheckboxFieldArray';

export default function Priority() {
  return (
    <>
      <Row>
        <Col>
          <Title>Priority</Title>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col className='d-flex justify-content-between flex-wrap me-5'>
          <CheckboxFieldArray
            name='priority' 
            fields={[
              { value: 'high', label: 'High', id: 'priority-high' },
              { value: 'medium', label: 'Medium', id: 'priority-medium' },
              { value: 'low', label: 'Low', id: 'priority-low' },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}
