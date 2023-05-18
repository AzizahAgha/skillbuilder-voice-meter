import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import low from "@public/svgs/low.svg";
import high from "@public/svgs/high.svg";
import medium from "@public/svgs/medium.svg";
import Text from "./Text";
import InfoPopup from "@ui-library/InfoPopup";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.filled ? "center" : "start")};
  width: ${(props) => (props.$showShowFullLabel ? "165px" : "100px")};
  border-radius: 50px;
  background: ${(props) => (props.filled ? props.background : "transparent")};
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-bottom: 10px;
  margin-right: 10px;
  @media only screen and (max-width: 490px) {
    white-space: nowrap;
  }
  ${Text} {
    margin-left: ${(props) => (props.filled ? "0" : "4px")};
  }
`;

const Label = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  @media only screen and (max-width: 490px) {
    font-size: 16px;
  }
  line-height: 24px;
  text-align: center;
  color: ${(props) => props.color};
`;

Priority.propTypes = {
  type: PropTypes.oneOf(["Q", "A"]),
  frequency: PropTypes.oneOf(["Always", "Sometimes", "Rarely"]),
  importance: PropTypes.oneOf([1, 2, 3, 4, 5]),
  differentiation: PropTypes.oneOf([1, 2, 3, 4, 5]),
  confidence: PropTypes.oneOf([1, 2, 3, 4, 5]),
};

const Low = {
  label: "Low",
  icon: low,
  color: "#F3D32A",
  background: "#FEF8D8",
};
const Medium = {
  label: "Medium",
  icon: medium,
  color: "#FF804A",
  background: "#FFD9C9",
};
const High = {
  label: "High",
  icon: high,
  color: "#C10840",
  background: "#EDB5C6",
};

const Rules = {
  Q: {
    Always: {
      5: High,
      4: High,
      3: Medium,
      2: Low,
      1: Low,
    },
    Sometimes: {
      5: High,
      4: High,
      3: Medium,
      2: Low,
      1: Low,
    },
    Rarely: {
      5: High,
      4: Medium,
      3: Low,
      2: Low,
      1: Low,
    },
  },
  A: {
    5: {
      5: Low,
      4: Low,
      3: Medium,
      2: Medium,
      1: Medium,
    },
    4: {
      5: Low,
      4: Low,
      3: Medium,
      2: Medium,
      1: Medium,
    },
    3: {
      5: Medium,
      4: Medium,
      3: Medium,
      2: High,
      1: High,
    },
    2: {
      5: High,
      4: High,
      3: High,
      2: High,
      1: High,
    },
    1: {
      5: High,
      4: High,
      3: High,
      2: High,
      1: High,
    },
  },
};

export const BadgeType = {
  Question: "Q",
  Answer: "A",
};

function Priority({
  frequency,
  importance,
  differentiation,
  confidence,
  type,
  fromAnswerEditor,
  filled = false,
  showShowFullLabel = false,
  linebreak = false,
  showInfoPopUp = false,
}) {
  const { label, icon, color, background } =
    (type === "Q"
      ? Rules[type]?.[frequency]?.[importance]
      : Rules[type]?.[differentiation]?.[confidence]) ?? Low;

  function getInfoText(type) {
    const infoTexts = {
      question:
        "This is calculated by the frequency and importance level of the question ",
      answer:
        "This is calculated by the confidence and differentiation level of the answer",
    };

    return infoTexts[type];
  }
  return (
    <Wrapper
      filled={filled}
      background={background}
      $showShowFullLabel={showShowFullLabel}
    >
      <img
        src={icon.src}
        alt={`
                    ${label}  
                    ${type === BadgeType.Question ? "Priority" : "Risk"}
                `}
      />
      <Label color={color}>
        {label}
        {!fromAnswerEditor && linebreak && <br />}
        {showShowFullLabel
          ? type === BadgeType.Question
            ? " Priority"
            : " Risk"
          : null}
      </Label>
      {showInfoPopUp && (
        <InfoPopup
          title={`${label}${
            type === BadgeType.Question ? "  Priority" : "  Risk"
          }`}
          text={getInfoText(
            type === BadgeType.Question ? "question" : "answer"
          )}
          color={color}
        />
      )}
    </Wrapper>
  );
}

export { Rules };
export default Priority;
