import React from 'react';
import { BsPlusCircle, BsDashCircle } from 'react-icons/bs';
import styled from 'styled-components';

export default function Counter({ name, value = 1, onChange }) {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange((value - 1 >= 0) ? value - 1 : value);

  return (
    <Wrapper id={name}>
      <BsDashCircle size={20} color='#969C9D' role='button' onClick={decrement}  />
      <span>{value}</span>
      <BsPlusCircle size={20} color='#969C9D' role='button' onClick={increment} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80px;
  float: right;
  
  span {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    color: #1F5462;
  }
`
