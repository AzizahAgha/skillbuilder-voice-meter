import React, { useMemo } from "react";
import styled from "styled-components";
import InfoPopup from "@ui-library/InfoPopup";
import AnswerEditor from "./AnswerEditor";
import ConfidenceSlider from "./ConfidenceSlider";
import DifferentiationSlider from "./DifferentiationSlider";
import RiskBadge from "./RiskBadge";
import { getInfoText } from "@utils/helpers";
import { Title } from "@ui-library/mobile/Title";

export default function AnswerContent() {

    return (
        <>
            <div className="d-block d-lg-block mt-3 mb-2">
                <Title className="mt-3 mb-2">Give Your Best Answer</Title>
                <Wrapper>
                    <AnswerEditor />
                </Wrapper>    
                <div className="row">
                    <div className="col-sm">
                        <div className="d-flex align-items-center mt-3 mb-2">
                            <Title>Confidence</Title>
                            <InfoPopup title="Confidence" text={getInfoText("confidence")} />
                        </div>
                        <ConfidenceSlider fromAnswerEditor={true} />
                    </div>
                    <div className="col-sm">
                        <div className="d-flex align-items-center mt-3 mb-2">
                            <Title>Differentiation</Title>
                            <InfoPopup
                                title="Differentiation"
                                text={getInfoText("differentiation")}
                            />
                        </div>
                        <DifferentiationSlider fromAnswerEditor={true}/>
                    </div>
                    <div className="col-sm">
                        <div className="d-flex align-items-center mt-3 mb-2">
                            <Title>Risk</Title>
                            <InfoPopup title="Risk" text={getInfoText("risk")} />
                        </div>
                            <RiskBadge fromAnswerEditor={true}/>
                    </div>
                </div>                
            </div>
        </>
    );
}


const Wrapper = styled.div`
    border: 1px solid #969C9D;
    margin-bottom:10px;
`;
const OptionsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;