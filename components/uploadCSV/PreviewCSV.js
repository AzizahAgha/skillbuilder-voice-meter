import React, { useState } from "react";
import styled from "styled-components";
import PreviewTable from "./PreviewTable";
import Button from "@ui-library/Button";
import { useRouter } from "next/router";
import ConfirmUploadPopup from "./ConfirmUploadPopup";
import questionService from "@services/question.service";
import { useMutation } from "react-query";
import { useTeam } from "@contexts/TeamContext";

function PreviewCSV() {
  const [csvData, setCsvData] = useState(
    process.browser && localStorage.getItem("csv-data")
      ? JSON.parse(localStorage.getItem("csv-data"))
      : undefined
  );
  const router = useRouter();
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const { team, refetchTeam } = useTeam();
  const uploadMutation = useMutation(({ teamId, data }) =>
    questionService.create(teamId, data)
  );
  const uploadData = () => {
    uploadMutation
      .mutateAsync({
        teamId: team?.id,
        data: {
          questions: csvData,
        },
      })
      .then(() => {
        localStorage.setItem("csv-data", "");
        setShowConfirmPopup(false);
        refetchTeam && refetchTeam();
        router.push("/detail");
      });
  };

  return (
    <CardView className="bs">
      <div className="card-header">
        <div className="title">Preview File</div>
        <div className="desc">
          You are about to upload {csvData?.length} questions that have{" "}
          {csvData?.map((e) => e.answers).flatMap((e) => e).length} answers
          affiliated with them.
          <br />{" "}
          <b>
            {" "}
            By default, each question and answer have been rated 3/5 for each
            metric. <br />
            After publishing, please review and customize your ratings.
          </b>
        </div>
        <div className="preview-table">
          <PreviewTable data={csvData} />
        </div>
      </div>
      <div className="card-footer">
        <div
          className="remove"
          onClick={() => {
            router.push(`/questionImport/uploadCsv`);
            localStorage.setItem("csv-data", "");
          }}
        >
          &lt; Upload New File
        </div>

        <StyledSaveButton
          onClick={() => {
            setShowConfirmPopup(true);
          }}
          disabled={false}
        >
          Publish Questions
        </StyledSaveButton>
        <ConfirmUploadPopup
          showConfirmPopup={showConfirmPopup}
          setShowConfirmPopup={setShowConfirmPopup}
          questionCount={csvData?.length}
          answerCount={csvData?.map((e) => e.answers).flatMap((e) => e).length}
          uploadData={uploadData}
        />
      </div>
    </CardView>
  );
}

export default PreviewCSV;

const StyledSaveButton = styled(Button)`
  &&& {
    cursor: ${(props) =>
      props.disabled === true ? "not-allowed" : "pointer"} !important;
  }
`;

const CardView = styled.div`
  background: #fff;
  margin: 20px 0 50px;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #c4c4c4;

  .card-header {
    padding: 5% 10%;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    .title {
      font-family: "Barlow Condensed", sans-serif;
      font-weight: 500;
      font-size: 40px;
      color: #1f5462;
      line-height: 1.2;
    }
    .desc {
      font-family: "Manrope", sans-serif;
      font-size: 16px;
      color: #393d3e;
      line-height: 1.2;
      margin-top: 10px;
    }

    .preview-table {
      margin-top: 20px;
      max-height: 600px;
      max-width: 800px;
      overflow-y: auto; /* Show vertical scrollbar */
      overflow-x: auto; /* Show horizontal scrollbar */
    }
  }

  .card-footer {
    padding: 5% 5% 3% 5%;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .remove {
      cursor: pointer;
      text-align: center;
      display: flex;
      align-items: center;
      font-family: "Barlow Condensed";
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      color: #003647;
    }
  }
`;
