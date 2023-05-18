import React from "react";
import styled from "styled-components";
import Link from "next/link";
import LoginCard from "@ui-library/LoginCard";
import Checkbox from "@ui-library/Checkbox";
import {
    Button as BsButton,
    Form,
} from "react-bootstrap";

export default function QuestionList({
  selectedQ,
  checkedState,
  handleOnChange,
  unSelectAll
}) {
    return (
		  <>
          <FormGroupQuestions>
          <CardTitle>
              <h3>Selected Questions</h3>
              <FilterMeta className="d-flex justify-content-between align-items-center">
                <span>{selectedQ.length} Questions</span>
                <span className="mx-2">|</span>
                <span style={{cursor:"pointer"}} onClick={()=>unSelectAll()}>Unselect All</span>
              </FilterMeta>
          </CardTitle>

          <div className="d-block qBank">
              {selectedQ && selectedQ.map((qb, index) => (
              <> 
                  <Checkbox
                  className="form-check"
                  id={`custom-checkbox-${qb.qBankId}`}
                  name={`custom-checkbox-${qb.qBankId}`}
                  label={qb.question}
                  checked={checkedState[qb.qBankId]}
                  onChange={(e) =>
                  handleOnChange(e,qb.qBankId,qb.question)
                  }
                  />
              
              </>
              ))}
          </div>
          
          </FormGroupQuestions>
      
      </>
    )
}

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  h3{
    font-family: "Barlow Condensed", sans-serif;
    font-weight: 500;
    font-size: 34px;
    color: #1f5462;
    line-height: 1.2;
    margin-bottom: 6px;
  }
`;

const FilterMeta = styled.div`
margin-bottom: 10px;
  span {
    display: inline-block;
    color: #81c2c0;
    font-family: "Barlow Condensed", sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 1.2;
  }
  @media (max-width: 549px){
    flex-basis: 100%;
    justify-content: flex-start !important;
  }
`;

const FormGroupQuestions = styled(Form.Group)`
  &&& {
    margin-bottom: 1.5rem;
    position:relative;
    border: 1px solid #C4C4C4;
    border-radius: 5px;
    padding: 25px 15px;
  }
  &.activeStep{
    border-color: #1F5462 !important;
  }
  .qBank{
    margin: 6px 0 20px 0;
    max-height: 500px;
    overflow-y: auto;
    .form-check{
      border-bottom: 1px solid #C4C4C4;
      padding-bottom: 10px;
      padding-top: 6px;
      padding-left: 1.5rem;
      width: 100%;
      margin: 0 !important;
      label{
        margin-left: .6rem;
        font-family: "Manrope", sans-serif;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        cursor: pointer;
        position: relative;
        padding-right: 30px;
        &:after{
          content: "x";
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          border: 1px solid #9E9E9E;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          text-align: center;
          line-height: 1;
          color: #9E9E9E;
          font-size: 12px;
          display: none;
        }
      }
      &:hover{
        background-color: #eee;
        label:after{
          display: block;
        }
      }
      &:last-child{
        border: none;
      }
    }
  }
`;
