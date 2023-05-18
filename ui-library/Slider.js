import React, {useState} from 'react';
import styled from 'styled-components';
import InputSlider from 'react-input-slider';
import { render } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { FaCircle } from "react-icons/fa";
import { createElement } from "react";
const options = ["1", "2", "3", "4", "5"];

const reactSvgComponentToMarkupString = (Component, props) =>
  `data:image/svg+xml,${encodeURIComponent(
    renderToStaticMarkup(createElement(Component, props))
  )}`;

const List = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: -36px 15px 0;
`;

const Label = styled.span`
  position: relative;
  float: left;
  text-align: center;
  color: #1F5462;
  cursor: pointer;
  font-family: "Barlow Condensed",sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  text-transform: capitalize;
  padding: 6px 12px;
  &:before{
    position: absolute;
    top: -44px;
    left: 0;
    right: 0;
    content: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20stroke%3D%22currentColor%22%20stroke-width%3D%220%22%20viewBox%3D%220%200%20512%20512%22%20width%3D%221em%22%20fill%3D%22%231F5462%22%20height%3D%2210%22%3E%3Cpath%20d%3D%22M256%208C119%208%208%20119%208%20256s111%20248%20248%20248%20248-111%20248-248S393%208%20256%208z%22%20stroke%3D%22none%22%2F%3E%3C%2Fsvg%3E");
    margin: 0 auto;
    padding: 10px;
  }
  &:first-child{
    padding-left: 0;
    &:before{
      padding-left: 0;
      left: -6px;
    }
  }
  &:last-child{
    padding-right: 0;
    &:before{
      padding-right: 0;
    }
  }
`;

const SliderWrapper = styled.div`
  margin: 44.5px 15px;
`

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Tooltip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.val > 3 ? 'end' : props.val <= 2 ? 'start' : 'center'};
  position: absolute;
  /* width: 70px; */
  width: 122px;
  margin: 0 15px;
  left: ${props => (props.val - 1) * 11.5 + '%'};
  z-index: 2;

  & h1{
    font-family: Manrope,sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: 0;
    text-align: ${props => props.val > 3 ? 'right' : props.val <= 2 ? 'left' : 'center'};
    color: #1F5462;
    margin: 0;
  }
  
  & span {
    font-family: Manrope,sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 15px;
    letter-spacing: 0;
    text-align: ${props => props.val > 3 ? 'right' : props.val <= 2 ? 'left' : 'center'};
    color: #1F5462;
  }
`;

function Slider({val, setVal, type = 'Importance', label}) {

  const [selected, setSelected] = useState(val ? val - 1 : 0);

  return (
    <Container>
      <Tooltip val={val}>
        <h1>{`${val}/5`}</h1>
        <span>{label}</span>
      </Tooltip>

      <SliderWrapper>
        <InputSlider
          axis="x"
          xmin={1}
          xmax={5}
          x={val}
          onChange={({ x }) =>{
            setVal(x);
            setSelected(x - 1);
          }}
          styles={{
            track: {
              width: '100%',
              backgroundColor: '#EAEBEB'
            },
            active: {
              background: 'linear-gradient(90deg, #E0F4F4 -2.12%, #003647 100%)'
            },
            thumb: {
              width: 22,
              height: 22,
              background: '#1F5462',
              border: '4px solid rgb(255, 255, 255)',
              boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
            },
            disabled: {
              opacity: 0.5
            }
          }}
        />
      </SliderWrapper>
      <List>
        {options.map((item, i) =>
          <Label
            key={i}
            selected={i <= selected}
            onClick={() => {
              setSelected(i);
              setVal(i + 1)
            }}>
            {item}
          </Label>)}
      </List>
    </Container>
  );
}

export default Slider;
