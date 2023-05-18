import {
  Circle,
  Document,
  Image,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import answerService from "@services/answer.service";
import { convert } from "html-to-text";
import { Rules } from "@ui-library/Priority";
import {
  getShortConfidenceLabel,
  getShortDifferentiationLabel,
  getShortImportanceLabel,
} from "@utils/helpers";

export const styles = StyleSheet.create({
  page: { padding: "20px 0" },
  layout: {
    flexDirection: "column",
    width: "90%",
    margin: "auto",
    minHeight: "100%",
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: "4px",
  },
});

const Widths = {
  SerialNo: 40,
  QA: 400,
};

const TableViewTemplate = ({ data, onReady, teamId }) => {
  const [pdfData, setPdfData] = useState([]);

  const fetchAnswers = useCallback(async () => {
    const questions = [];

    const answers = await answerService.getAllAnswers(
      teamId,
      data?.map((q) => q.questionId)
    );

    data.forEach((q) => {
      let found = false;
      answers.forEach((a) => {
        if (q.questionId === a.questionId) {
          found = true;
          questions.push({ ...q, answer: a });
        }
      });
      if (!found) questions.push({ ...q, answer: {} });
    });

    setPdfData(questions);
    onReady();
  }, [data, onReady, teamId]);

  useEffect(() => {
    fetchAnswers(data);
  }, [data, fetchAnswers]);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.layout}>
          <View fixed>
            <View style={styles.headerRow}>
              <Header style={{ width: Widths.SerialNo, textAlign: "center" }}>
                #
              </Header>
              <Header style={{ width: Widths.QA, marginLeft: "4px" }}>
                Question
              </Header>
              <Header style={{ width: Widths.QA, marginLeft: "4px" }}>
                Answer
              </Header>
            </View>
            <Divider horizontal={true} />
          </View>

          {pdfData?.map((q, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                backgroundColor: idx % 2 === 0 ? "#969C9D0D" : "white",
                borderBottom: "1px solid #969C9D",
                borderLeft: "1px solid #969C9D",
              }}
            >
              <SerialNo>{`${q.number}`?.padStart(2, "0")}</SerialNo>
              <Divider />
              <QA
                width={Widths.QA}
                createdAt={q.createdAt}
                author={q.questionAuthorName}
                text={q.questionText}
                labels={q.labels}
                picture={q.authorProfileUrl}
                factor1={q.frequency}
                factor2={q.importance}
                type={"Q"}
              />
              <Divider />

              <QA
                width={Widths.QA}
                createdAt={q.answer.answerCreatedAt}
                author={q.answer.authorName}
                text={convert(
                  q.answer?.answerText ? q.answer?.answerText : "",
                  {
                    selectors: [
                      {
                        selector: "ul",
                        options: { itemPrefix: "• " },
                      },
                      {
                        selector: "hr",
                        options: { length: 70 },
                      },
                    ],
                  }
                )}
                labels={q.answer.labels}
                picture={q.answer.authorProfileUrl}
                factor1={q.answer.confidence}
                factor2={q.answer.differentiation}
                type={"A"}
              />
              <Divider />
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default TableViewTemplate;

const Header = ({ children, style }) => (
  <Text
    style={{
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "12px",
      color: "#1F5462",
      ...style,
    }}
  >
    {children}
  </Text>
);

const SerialNo = ({ children }) => (
  <Text
    style={{
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "10px",
      color: "#1F5462",
      width: Widths.SerialNo,
      textAlign: "center",
      padding: "10px  2px",
    }}
  >
    {children}
  </Text>
);

const Label = ({ children }) => (
  <Text
    style={{
      backgroundColor: "#E0F4F488",
      borderRadius: "5px",
      padding: "3px 6px",
      marginRight: "4px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "8px",
      textAlign: "center",
      maxWidth: "100",
      color: "#1F5462",
      marginBottom: "4px",
    }}
  >
    {children}
  </Text>
);

const Content = ({ children }) => (
  <Text
    style={{
      fontSize: "10px",
      marginTop: "6px",
      color: "#393D3E",
      fontWeight: 300,
    }}
  >
    {children}
  </Text>
);

const SubText = ({ children, style }) => (
  <Text
    style={{
      fontSize: "7px",
      fontStyle: "normal",
      color: "#1F5462",
      marginLeft: "4px",
      ...style,
    }}
  >
    {children}
  </Text>
);

const Priority = ({ factor1, factor2, type, suffix }) => {
  const { label, icon, color, background } =
    Rules[type]?.[factor1]?.[factor2] ?? {};

  const svg = label === "Low" ? low : label === "Medium" ? medium : high;

  return (
    <View
      style={{
        backgroundColor: background,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: "50px",
        paddingRight: "6px",
        paddingLeft: "4px",
        paddingTop: "2px",
        paddingBottom: "2px",
      }}
    >
      {svg}
      <Text
        style={{
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: "10px",
          color,
        }}
      >{`${label} ${suffix}`}</Text>
    </View>
  );
};

const Divider = ({ horizontal = false }) => {
  const style = horizontal
    ? { flexDirection: "column", borderTop: "1px solid #969C9D" }
    : { flexDirection: "row", borderRight: "1px solid #969C9D" };

  return <View style={style} />;
};

const UI = {
  Q: {
    FirstLabel: "Frequency",
    SecondLabel: "Importance",
    getFirstFactor: (value) => value,
    getSecondFactor: (value) => getShortImportanceLabel(value),
    suffix: "Priority",
  },
  A: {
    FirstLabel: "Confidence",
    SecondLabel: "Differentiation",
    getFirstFactor: (value) => getShortConfidenceLabel(value),
    getSecondFactor: (value) => getShortDifferentiationLabel(value),
    suffix: "Risk",
  },
};

const QA = ({
  factor1,
  factor2,
  type,
  width,
  text,
  author,
  labels,
  createdAt,
  picture,
}) => {
  const { FirstLabel, SecondLabel, getFirstFactor, getSecondFactor, suffix } =
    UI[type];


  return (
    <View style={{ flexDirection: "column", width, padding: "8px" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {(factor1 && factor2) &&(
        <Priority
          factor1={factor1}
          factor2={factor2}
          type={type}
          suffix={suffix}
          />
        )}
        
        {factor1 &&(<SubText style={{ color: "#024a5e" }}>{FirstLabel}:</SubText>)}
          <SubText style={{ marginLeft: "1px" }}>
            {getFirstFactor(factor1)}
          </SubText>
         
          {factor2 &&(<SubText style={{ color: "#024a5e" }}>{SecondLabel}:</SubText> )}
          <SubText style={{ marginLeft: "1px" }}>
            {getSecondFactor(factor2)}
          </SubText>

      </View>
      <Content>{text}</Content>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: "16px",
        }}
      >
        {picture ? (
          <Image
            style={{
              border: "0.5px solid #003647",
              width: "16px",
              height: "16px",
              borderRadius: "20px",
            }}
            cache={false}
            src={picture + "?rnd=" + Math.random()}
            crossorigin="anonymous"
            alt="Profile Image"
          />
        ) : null}
        
        <SubText style={{ fontWeight: "bold" }}>{author ? author : ""}</SubText>
        <SubText>{author && createdAt ? "|" : ""}</SubText>
        
          {!author && createdAt ? <SubText>Created on</SubText> : null}
        <SubText>
          {createdAt ? new Date(createdAt).toString().slice(4, 10) : ""}
        </SubText>
    
      </View>
      <View
        style={{ flexDirection: "row", marginTop: "4px", flexWrap: "wrap" }}
      >
        {labels?.map((label, i) => (
          <Label key={i}>{label}</Label>
        ))}
      </View>
    </View>
  );
};

// SVG  Images
const size = 12;

const low = (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Circle cx="13" cy="13" r="13" fill="#FEF8D8" />
    <Path
      d="M13.4366 21.9818C13.4368 21.9815 13.4372 21.9813 13.4374 21.9809L18.2833 17.1116C18.6463 16.7468 18.645 16.1567 18.2802 15.7936C17.9154 15.4306 17.3253 15.432 16.9623 15.7968L13.7088 19.066L13.7088 5.38771C13.7088 4.87302 13.2916 4.45581 12.7769 4.45581C12.2622 4.45581 11.845 4.87302 11.845 5.38771L11.845 19.066L8.59156 15.7968C8.22849 15.432 7.63846 15.4306 7.27367 15.7937C6.90878 16.1568 6.90752 16.7469 7.2705 17.1116L12.1164 21.981C12.1167 21.9813 12.117 21.9815 12.1173 21.9818C12.4815 22.3468 13.0735 22.3456 13.4366 21.9818Z"
      fill="#F3D32A"
    />
  </Svg>
);

const medium = (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Circle cx="13" cy="13" r="13" fill="#FFD9C9" />
    <Rect x="7" y="10" width="12" height="2" rx="1" fill="#FF804A" />
    <Rect x="7" y="14" width="12" height="2" rx="1" fill="#FF804A" />
  </Svg>
);

const high = (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Circle cx="13" cy="13" r="13" fill="#EDB5C6" />
    <Path
      d="M12.1181 4.27335C12.1179 4.27363 12.1175 4.27386 12.1172 4.27419L7.27137 9.14355C6.90834 9.50834 6.9097 10.0984 7.27453 10.4615C7.63933 10.8246 8.22936 10.8232 8.59243 10.4584L11.8459 7.18908L11.8459 20.8674C11.8459 21.3821 12.2631 21.7993 12.7778 21.7993C13.2925 21.7993 13.7097 21.3821 13.7097 20.8674L13.7097 7.18912L16.9631 10.4583C17.3262 10.8231 17.9162 10.8245 18.281 10.4614C18.6459 10.0983 18.6472 9.50825 18.2842 9.14351L13.4383 4.27414C13.438 4.27386 13.4377 4.27363 13.4374 4.2733C13.0731 3.90832 12.4812 3.90949 12.1181 4.27335Z"
      fill="#C10840"
    />
  </Svg>
);
