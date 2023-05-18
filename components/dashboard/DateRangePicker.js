import React from 'react';
import styled from 'styled-components';
import { DateRangePicker as DRP } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

export default function DateRangePicker({ value, onChange }) {
  return (
    <DateRangePickerWrapper>
      <DRP
        ranges={value}
        months={2}
        direction="horizontal"
        onChange={onChange}
        rangeColors={['#81c2c0']}
        maxDate={new Date()}
      />
    </DateRangePickerWrapper>
  )
}

const DateRangePickerWrapper = styled.div`
  .rdrDefinedRangesWrapper { display: none; }
`