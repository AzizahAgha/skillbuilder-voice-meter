import React from "react";
import { Row, Col } from "react-bootstrap";
import Checkbox from "@ui-library/Checkbox";
import Counter from "@ui-library/Counter";
import thumbsUpIcon from "@public/svgs/thumbs-up.svg";
import thumbsDownIcon from "@public/svgs/thumbs-down.svg";
import flagIcon from "@public/svgs/flag.svg";
import styled from "styled-components";
import { useFormikContext } from "formik";

export default function OtherFilters() {
  const formik = useFormikContext();

  return (
    <>
      <Row className="mt-1 gy-3" xs={2} sm={2}>
        <Col>
          <Label>
            <img src={thumbsUpIcon.src} alt="agree" />
            <span>Agreed</span>
          </Label>
        </Col>
        <Col>
          <Counter
            name="agreedCount"
            value={formik.values.agreedCount}
            onChange={(count) => formik.setFieldValue("agreedCount", count)}
          />
        </Col>

        <Col>
          <Label>
            <img src={thumbsDownIcon.src} alt="disagree" />
            <span>Disagree</span>
          </Label>
        </Col>
        <Col>
          <Counter
            name="disagreedCount"
            value={formik.values.disagreedCount}
            onChange={(count) => formik.setFieldValue("disagreedCount", count)}
          />
        </Col>

        <Col>
          <Label>
            <img src={flagIcon.src} alt="flagged" />
            <span>Flagged</span>
          </Label>
        </Col>
        <Col>
          <Counter
            name="flaggedCount"
            value={formik.values.flaggedCount}
            onChange={(count) => formik.setFieldValue("flaggedCount", count)}
          />
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <Checkbox
            label="Includes Links"
            id="includes-links"
            checked={formik.values.includeLinks}
            onChange={(e) =>
              formik.setFieldValue("includeLinks", e.target.checked)
            }
          />
        </Col>
      </Row>
    </>
  );
}

const Label = styled.label`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #1f5462;

  span {
    margin-left: 0.5rem;
  }
`;
