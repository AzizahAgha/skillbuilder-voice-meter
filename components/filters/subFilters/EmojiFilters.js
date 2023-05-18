import React from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { useFormikContext } from "formik";
import FlagIcon from "@public/icons/flag";
import Counter from "@ui-library/Counter";

function EmojiFilters() {
  const formik = useFormikContext();
  return (
    <>
      <Row className="mt-1 gy-3" xs={1} md={2}>
        <StyledCol>
          <Label>
            <span className="mx-1">&#128077;</span>
            <span>UpVote</span>
          </Label>
          <Counter
            name="likes"
            value={formik.values.likes}
            onChange={(count) => formik.setFieldValue("likes", count)}
          />
        </StyledCol>
        <StyledCol>
          <Label>
            <span className="mx-2">
              <FlagIcon height={20} />
            </span>
            <span style={{ padding: "0px 0px 0px 5px" }}>Flagged</span>
          </Label>
          <Counter
            name="flags"
            value={formik.values.flags}
            onChange={(count) => formik.setFieldValue("flags", count)}
          />
        </StyledCol>

        <StyledCol>
          <Label>
            <span className="mx-1">&#128078;</span>
            <span>DownVote</span>
          </Label>
          <Counter
            name="dislikes"
            value={formik.values.dislikes}
            onChange={(count) => formik.setFieldValue("dislikes", count)}
          />
        </StyledCol>
      </Row>
    </>
  );
}

export default EmojiFilters;

const Label = styled.label`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #393d3e;
  span {
    margin-left: 0.5rem;
  }
`;

const StyledCol = styled(Col)`
  &&& {
    @media (max-width: 992px) {
      width: 100%;
    }
  }
`;
