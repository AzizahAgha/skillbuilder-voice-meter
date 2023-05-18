import React from 'react';
import styled from 'styled-components';

export default function TextareaWithCounter({ 
  value = '', 
  maxLength = 1000,
  ...props 
}) {


  return (
    <TextArea>
      <textarea maxLength={maxLength} value={value} {...props} />
      <span className={(value.length === maxLength) ? 'text-danger' : ''}>
        {`${value.length}/${maxLength}`}
      </span>
    </TextArea>
  )
}

const TextArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  textarea {
    width: 100%;
    /* max-width: 600px; */
    min-height: 100px;
    resize: none;
    border: none;
    margin-bottom: 16px;
    background: transparent;

    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;

    color: #393D3E;

    &:focus {
      outline: none;
    }
  }
  
  span {
    position: absolute;
    bottom: 0px;
    right: 6px;

    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 14px;
    text-align: right;
    color: #bfbfbf;
    opacity: 0.8;
  }

`
