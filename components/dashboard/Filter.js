import React from 'react';
import styled from 'styled-components';
import {
  ToggleButtonGroup as BsToggleButtonGroup,
  ToggleButton,
  Form
} from 'react-bootstrap';
import down from "@public/svgs/down.svg"

const options = [
  { name: 'User Activity', value: 'user-activity' },
  { name: 'High Priority', value: 'high-priority' },
  { name: 'High Risk', value: 'high-risk' },
  { name: 'Newest', value: 'newest' },
  { name: 'Flagged', value: 'flagged' },
]

export default function Filter({ value, onChange }) {
  return (
    <>
      <div className='d-none d-lg-block'>
        <ToggleButtonGroup
          type='radio'
          name='filter-options'
          defaultValue={options[0].value}
          value={value}
          onChange={onChange}
        >
          {options.map((option, idx) => (
            <ToggleButton
              key={idx}
              id={option.value}
              variant="outline-secondary"
              value={option.value}
              active={value === option.value}
            >
              {option.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div className='d-block d-lg-none'>
        <Select value={value} onChange={(event) => onChange(event?.target?.value)}>
          {options.map((option, idx) => (
            <option key={idx} value={option.value}>{option.name}</option>
          ))}
        </Select>
      </div>
    </>
  )
}

const ToggleButtonGroup = styled(BsToggleButtonGroup)`
&&& {
  .btn-outline-secondary {
    background: #FFF;
    border-radius: 50px !important;
    text-align: center;
    color: #1F5462;
    border: none;

    font-family: Barlow Condensed;
    font-style: normal;
    font-size: 20px;
    font-weight: 300;
    line-height: 36px;
    padding: 0rem 1.2rem;
    margin-right: .2rem;

    &.active,
    &:hover {
      color: #FFF;
      background: #81C2C0;
      box-shadow: none;
      outline: none;
    }
  }
}
`

const Select = styled(Form.Select)`
  &&&{
    border: 1px solid #003647;
    border-radius: 5px;
    background-image: url('${down.src}');

    font-family: 'Barlow Condensed';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #1F5462;
  }
`
