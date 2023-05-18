import axios from "axios";
import cheerio from "cheerio";
import parse from "html-react-parser";
import getConfig from "next/config";
import striptags from "striptags";
import { Rules as PriorityRiskRules } from "@ui-library/Priority";
import { toCSV } from "react-csv/lib/core";
import { pdf } from "@react-pdf/renderer";
import TableViewTemplate from "@layouts/pdf-templates/TableViewTemplate";
import React from "react";
import moment from "moment";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";

const {
  publicRuntimeConfig: { WEBFLOW_URL },
} = getConfig();

export const getPageFromWebflow = async (path = "", instructions) => {
  const response = await axios(WEBFLOW_URL + path);
  const HTML = response.data;
  const $ = cheerio.load(HTML);
  const HEAD = $.html("head").replace(/(<head[^>]+>|<head>|<\/head>)/g, "");
  const BODY = $.html("body").replace(/(<body[^>]+>|<body>|<\/body>)/g, "");
  const HEADER = $.html("header");
  const FOOTER = $.html("footer");

  return { HTML, HEAD, BODY, HEADER, FOOTER };
};

export const createReactPageFromHTML = (HTML, instructions) => {
  return parse(HTML, instructions);
};

export const download = (blob, filename) => {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // for IE
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // for Non-IE (chrome, firefox etc.)

    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    // Garbage collect resources
    window?.URL?.revokeObjectURL?.(url);
    link.remove();
  }
};

export const printQuestions = (questions, teamId) => {
  const PDFDoc = pdf(
    <TableViewTemplate
      data={questions}
      teamId={teamId}
      onReady={async () => {
        const blob = await PDFDoc.toBlob();
        printContent(blob);
      }}
    />
  );
};

export const printContent = (blob) => {
  let iframe = document.getElementById("PRINT-CONTENT");
  if (iframe) iframe.parentNode.removeChild(iframe);

  iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  iframe.style.display = "none";
  iframe.src = URL.createObjectURL(blob);
  iframe.id = "PRINT-CONTENT";
  iframe.onload = () => {
    iframe.focus();
    iframe.contentWindow.print();
    URL.revokeObjectURL(iframe.src);
  };
};

export const generateQsCsv = (questions, answers) => {
  const data = [];
  questions?.forEach((q) => {
    let found = false;
    answers?.forEach((a) => {
      if (q.questionId === a.questionId) {
        found = true;
        data.push([
          q.number,
          q.isFavorite,
          striptags(q.questionText),
          q.questionAuthorName,
          q.frequency ?? 1,
          q.importance,
          PriorityRiskRules.Q[q.frequency ?? "Always"][q.importance ?? 1].label,
          striptags(a.answerText),
          a.authorName,
          PriorityRiskRules.A[a.differentiation ?? 1][a.confidence ?? 1].label,
          a.confidence,
          a.differentiation,
          a.answerCreatedAt,
        ]);
      }
    });
    if (!found)
      data.push([
        q.number,
        q.isFavorite,
        striptags(q.questionText),
        q.questionAuthorName,
        q.frequency ?? 1,
        q.importance,
        PriorityRiskRules.Q[q.frequency ?? "Always"][q.importance ?? 1].label,
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
  });

  data.unshift([
    "QuestionID",
    "Is Favorite",
    "Question",
    "Author",
    "Frequency",
    "Importance",
    "Priority",
    "Answer",
    "Author",
    "Risk",
    "Confidence",
    "Differentiation",
    "Date Created",
  ]);

  return new Blob([toCSV(data)], { type: "text/csv" });
};

export const generateTeamsCSV = (teams) => {
  const data = [
    [
      "Team ID",
      "Team Name",
      "First Name",
      "Last Name",
      "Email",
      "Users",
      "Questions",
      "Answers",
      "Billing",
      "Status",
      "Date Created",
    ],
  ];

  teams?.forEach((team) => {
    data.push([
      team.teamId,
      team.teamName,
      team.firstName,
      team.lastName,
      team.email,
      team.totalUsers,
      team.totalQuestions,
      team.totalAnswers,
      team.billing,
      team.status,
      team.teamCreatedAt,
    ]);
  });

  return new Blob([toCSV(data)], { type: "text/csv" });
};

export const generateAccountsCSV = (accounts) => {
  const data = [
    [
      "User ID",
      "First Name",
      "Last Name",
      "Email",
      "Title",
      "Department",
      "Status",
      "Last Activity",
      "Date Created",
    ],
  ];

  accounts?.forEach((team) => {
    data.push([
      team.userId,
      team.firstName,
      team.lastName,
      team.email,
      team.title,
      team.department,
      team.status,
      team.lastActivity,
      team.createdAt,
    ]);
  });

  return new Blob([toCSV(data)], { type: "text/csv" });
};

export const generateActivityCSV = (activities) => {
  const data = [
    [
      "Sr.No",
      "First Name",
      "Last Name",
      "Title",
      "Department",
      "Questions",
      "Answers",
      "Requests",
      "Agrees",
      "Disagrees",
      "Flags",
      "Total",
    ],
  ];

  activities?.forEach((activity, idx) => {
    data.push([
      idx + 1,
      activity.firstName,
      activity.lastName,
      activity.title,
      activity.department,
      activity.totalQuestions,
      activity.totalAnswers,
      activity.totalRequests,
      activity.totalLikes,
      activity.totalDislikes,
      activity.totalFlags,
      activity.total,
    ]);
  });

  return new Blob([toCSV(data)], { type: "text/csv" });
};

export const CategoryType = {
  All: "All",
  Active: "Active",
  Inactive: "Inactive",
  Archived: "Archived",
};

export const Width = {
  mobile: 1224,
};

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * @param { 'question' | 'frequency' | 'importance' | 'priority' | 'answer' | 'confidence' | 'differentiation' | 'risk' } type String
 * @returns String
 */
export function getInfoText(type) {
  const infoTexts = {
    question: "Please enter important questions clients or prospects will ask",
    frequency: "Reflects how OFTEN a question/challenge presents itself",
    importance:
      "How critical to winning a deal is answering this question in an effective way? 1 = Not Very, 5 = Extremely Important",
    priority:
      "Calculated based on the level of Frequency and Importance, cannot be edited",
    answer: "Please add your most complete and differentiated answers below",
    confidence: "How sure are you the answer is correct? 1= Least, 5 = Most",
    differentiation:
      "How differentiated is this answer? 1 =Anyone could say this 5 = Completely unique to us",
    risk: "Calculated based on the level of Confidence and Differentiation, cannot be edited",
  };

  return infoTexts[type];
}

export function getImportanceLabel(importance) {
  const labels = [
    "Low Importance",
    "Slight Importance",
    "Important",
    "High Importance",
    "Extreme Importance",
  ];
  return labels[importance - 1];
}

export function getShortImportanceLabel(importance) {
  const labels = ["Low", "Slight", "Important", "High", "Extreme"];
  return labels[importance - 1];
}

export function getDifferentiationLabel(differentiation) {
  const labels = [
    "Low Differentiation",
    "Slight Differentiation",
    "Differentiated",
    "High Differentiation",
    "Extreme Differentiation",
  ];
  return labels[differentiation - 1];
}

export function getShortDifferentiationLabel(differentiation) {
  const labels = ["Low", "Slight", "Differentiated", "High", "Extreme"];
  return labels[differentiation - 1];
}

export function getConfidenceLabel(confidence) {
  const labels = [
    "Low Confidence",
    "Slight Confidence",
    "Confident",
    "High Confidence",
    "Extreme Confidence",
  ];
  return labels[confidence - 1];
}

export function getShortConfidenceLabel(confidence) {
  const labels = ["Low", "Slight", "Confident", "High", "Extreme"];
  return labels[confidence - 1];
}

/**
 *
 * @param {'this_week' | 'last_week' | 'all_time'} rangeType String
 * @returns [startDate, endDate] Array
 */
export function getDateRange(rangeType) {
  switch (rangeType) {
    case "this_week":
      return {
        startDate: moment().startOf("week").format("YYYY-MM-DD"),
        endDate: moment().endOf("week").format("YYYY-MM-DD"),
      };

    case "last_week":
      return {
        startDate: moment()
          .startOf("week")
          .subtract(7, "days")
          .format("YYYY-MM-DD"),
        endDate: moment()
          .endOf("week")
          .subtract(7, "days")
          .format("YYYY-MM-DD"),
      };

    case "all_time":
      return {
        startDate: "",
        endDate: "",
      };
  }
}

export const replaceDomNode = (domNode) => {
  if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
    return <HeaderSessionWidget />;
  }
};
