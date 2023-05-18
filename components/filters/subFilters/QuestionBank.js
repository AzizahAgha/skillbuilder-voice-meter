import React from 'react'
import { Row, Col } from 'react-bootstrap';
import CheckboxFieldArray from '@ui-library/CheckboxFieldArray';
import Title from '@ui-library/FilterComponentTitle';

export default function QuestionBank({
    filterData
}) {
  const getFilterTxt = (val) => {
    let txt = "";
    switch (val) {
        case "departments":
            txt = "Department";
            break;
        case "contexts":
            txt = "Question Context";
            break;
        case "themes":
          txt = "Question Theme";
            break;
        default:
          txt = val;
    }
    return txt;
}
  return (
    <>
      <Row>
        {Object.keys(filterData).map((key, index) => 
          (
          <Col key={`filterCol-${index}`} className='col-sm-4 mb-2'>
            <Title style={{textTransform: "capitalize"}} className='mb-2'>{getFilterTxt(key)}</Title>
            <CheckboxFieldArray 
              name={key}
              fields={filterData[key]}
            />
          </Col>
        ))
        }              
        
      </Row>
    </>
  )
}
