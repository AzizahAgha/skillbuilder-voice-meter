import styled from "styled-components";


export const Divider = styled.div`
  border-bottom: ${props => props.lastItem ? '0 solid #969C9D' : '1px solid #969C9D'};
  align-self: stretch;
  margin-left: ${props => props.negative ? '-0.5rem !important;' : 0};
  margin-right: ${props => props.negative ? '-0.5rem !important;' : 0};
`
