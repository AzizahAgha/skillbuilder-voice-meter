import styled from "styled-components";
import InfoPopup from "@ui-library/InfoPopup";
import { getInfoText } from "@utils/helpers";

export const Factor = ({ label, info, rightView }) => {
  return (
    <>
      <div className='d-flex flex-row align-items-center align-self-stretch px-1 py-2'>
        <Label>{label}</Label>
        <InfoPopup title={label} text={getInfoText(info)} />
        <div className="flex-grow-1" />
        {rightView()}
      </div>
    </>
  )
}

export const Label = styled.span`
  font-family: 'Barlow Condensed', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: #393D3E;
`

