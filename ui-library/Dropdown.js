import React, {useEffect, useRef, useState} from "react";
import styled from 'styled-components';
import {BsCaretDownFill} from 'react-icons/bs';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
    cursor: pointer;
`;

const Input = styled.input`
    outline: none;
    font-size: 14px;
    border: none;
    padding: 0 8px;
    position: absolute;
    cursor: pointer;
    width: 100%;
    background: none;
`;

const Text = styled.span`  
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  margin-right: 12px;
  line-height: 22px;
  text-align: center;
  color: #393D3E;
`;

const Row = styled.button.attrs(() => ({
  tabIndex: '0'
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  outline: none;
  align-self: stretch;
  background: none;
`;

const OptionWrapper = styled.div`
  background: ${props => props.selected ? "#f5f5f5" : "transparent"};
  padding: 5px 15px;
  font-size: 12px;
  color: #394750;
  cursor: pointer;
`;

const Option = styled.div`
  background: ${props => props.background};
  border-radius: 50px;
  width: 110px;
  padding: 4px 0;
  color: ${props => props.color};
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  user-select: none;
`;

const Wrapper = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 38px;
  position: absolute;
  background: #FFFFFF;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  max-height: 170px;
  overflow: auto;
  cursor: pointer;
  z-index: 2;
`;

export const Options = {
  Frequency: [
    {frequency: 'Always', background: '#1F5462', color: '#FFF'},
    {frequency: 'Sometimes', background: '#81C2C0', color: '#FFF'},
    {frequency: 'Rarely', background: '#E0F4F4', color: '#1F5462'}
  ]
};


const Dropdown = ({options, name, placeholder, style, onSelect, value, disabled = false}) => {

  const ref = useRef(null);
  const [val, setVal] = useState(value);
  const [showOptions, setShowOptions] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(options.find(opt => opt.frequency === value) ?? {
    frequency: 'Always',
    background: '#1F5462',
    color: '#FFF'
  });

  const handleClick = e => {
    if (!ref?.current?.contains?.(e.target)) {
      setShowOptions(false);
    }
  };

  // console.log(val, value);

  useEffect(() => {
    if (value) {
      setVal(value);
      
      setSelectedOption(options.find(opt => opt.frequency === value) ?? {
        frequency: 'Always',
        background: '#1F5462',
        color: '#FFF'
      })
    }
  }, [value])

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      const option = options?.[activeOption];
      setVal(option?.[name]);
      setSelectedOption(option);
      setShowOptions(false);
      setActiveOption(-1);
      onSelect(option);
      e.preventDefault()
    } else if (e.keyCode === 38) {
      setActiveOption((activeOption - 1 + options.length) % options.length);
      e.preventDefault()
    } else if (e.keyCode === 40) {
      setActiveOption((activeOption + 1) % options.length);
      e.preventDefault()
    }
  };

  const onClick = option => {
    setVal(option?.[name]);
    setSelectedOption(option);
    setShowOptions(false);
    setActiveOption(-1);
    onSelect(option);
  };

  return (
    <Container ref={ref}>
      <Row onClick={() => setShowOptions(!showOptions)} onKeyDown={onKeyDown} role='button'>
        {val ?
          <Option background={selectedOption.background} color={selectedOption.color}>{val}</Option>
          : <Text>{placeholder}</Text>
        }
        {!disabled && <BsCaretDownFill color={showOptions ? '#393D3E' : '#393D3E25'} />}
      </Row>
      {!disabled && showOptions && <Wrapper>
        {options?.map((option, index) =>
          <OptionWrapper selected={index === activeOption} key={index} onClick={() => onClick(option)}>
            <Option background={option.background} color={option.color}>{option[name]}</Option>
          </OptionWrapper>)
        }
      </Wrapper>}
    </Container>
  );
};

export default Dropdown
