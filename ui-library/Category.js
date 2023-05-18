import React from 'react';
import styled from 'styled-components';

const Category = styled.span`
  font-family: 'Barlow Condensed',sans-serif;
  font-style: normal;
  font-weight: ${props => props.active ? 500 : 400};
  font-size: 20px;
  line-height: 24px;
  color: ${props => props.active ? '#FFFFFF' : '#393D3E'};
  padding: 4px 20px;
  margin-top: 10px;
  background: ${props => props.active ? '#81C2C0' : 'transparent'};
  border-radius: 50px;
  cursor: pointer;
`;

export default Category
