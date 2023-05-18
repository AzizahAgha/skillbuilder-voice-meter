import React from 'react'
import { Formik } from 'formik'
import Table from './Table'
import { useMediaQuery } from "react-responsive";
import { Width } from "@utils/helpers";
import Expandable from "@ui-library/Expandable";
import Question from "@components/mobile/Question";
import styled from "styled-components";

export default function ExampleQuestionnaire() {
  const isTabletOrMobile = useMediaQuery({ maxWidth: Width.mobile });
  return (
    <Formik initialValues={{
      questions: [{
        question: "Example Question From A Prospect or Client - row can be edited but not saved, please start typing your question in the 01 row",
        frequency: "Always",
        importance: 5,
      }]
    }}>
      {(formikProps) => (
        <div>
          {isTabletOrMobile
            ? <Expandable className='mb-2' header={<Header className='mb-0 mb-lg-3'>Example Question From A Prospect or Client</Header>}>
              <Question index={0} isExample={true} />
            </Expandable>
            : <Table data={formikProps.values.questions} />}
        </div>
      )}
    </Formik>
  )
}

const Header = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #1F5462;
  margin-bottom: 16px;
`;
