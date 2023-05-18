import React, { useState } from 'react';
import { Row, Col, InputGroup, FormControl, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Title from '@ui-library/FilterComponentTitle';
import { IoSearchOutline } from 'react-icons/io5';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { useQuery } from 'react-query';
import labelService from '@services/label.service';
import { useTeam } from '@contexts/TeamContext';

export default function Labels({ type }) {
  const formik = useFormikContext();
  const { team } = useTeam();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isSuccess } = useQuery(
    ['labels', { team, type }], 
    () => labelService.getAll({ 
      teamId: team.id,
      type: (type === 'answers') ? 'answer' : 'question'
    })
  );

  return (
    <>
      <Row className='align-items-end'>
        <Col>
          <Title>Labels </Title>
        </Col>
        <Col>
          <InputGroup className="mb-3 rounded" style={{ border: '1px solid #393D3E' }}>
            <InputGroup.Text className='bg-white pe-0 ps-2 border-0'>
              <IoSearchOutline color='#676879' />
            </InputGroup.Text>
            <FormControl
              size="sm"
              placeholder="Search Labels"
              aria-label="Search Labels"
              className='border-0'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value.toLowerCase())}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col>
          <LabelContainer 
            name={`${type}ByLabels`} 
            type='checkbox' 
            size='sm'
            defaultValue={formik.values[`${type}ByLabels`]}
            values={formik.values[`${type}ByLabels`]}
            onChange={values => formik.setFieldValue(`${type}ByLabels`, values)}
          >
            {(isSuccess && data) && 
              data
              .filter(_label => _label?.toLowerCase()?.includes(searchTerm))
              .map((label, idx) => (
                <ToggleButton
                  key={idx}
                  id={`${type}-label-${idx}`}
                  value={label}
                >
                  {label}
                </ToggleButton>
              ))
            }

            {(isSuccess && !data?.length) &&
              <NoLabels>No Labels Yet</NoLabels>
            }
          </LabelContainer>
        </Col>
      </Row>
    </>
  )
}

const LabelContainer = styled(ToggleButtonGroup)`
&&& {
  width: 100%;
  /* min-height: 172px; */

  background: rgba(150, 156, 157, 0.05);
  border-radius: 5px;
  padding: 1rem;

  display: inline-block;
  
  .btn-primary {
    background: #E0F4F4;
    border-radius: 5px !important;
    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: #1F5462;
    border: none;
    opacity: 0.5;
    border: 0.5px solid #E0F4F4;
    margin: 0.3rem 0.5rem;
    white-space: nowrap;
    max-width: 100px;
    overflow-x: hidden;
    text-overflow:  ellipsis;
  }

  .btn-check:focus + .btn-primary, .btn-primary:focus {
    color: #1F5462;
    background: #E0F4F4;
    box-shadow: none;
    border: 0.5px solid #E0F4F4;
    outline: none;
  }

  .btn-check:active + .btn-primary, .btn-check:checked + .btn-primary, .btn-primary.active, .btn-primary:active, .show > .btn-primary.dropdown-toggle {
    background: #E0F4F4;
    border-color: #1F5462;
    color: #1F5462;
    font-weight: 600;
    opacity: 1;

    outline: none;
    box-shadow: none;
  }
}
`

const NoLabels = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: silver;
`
