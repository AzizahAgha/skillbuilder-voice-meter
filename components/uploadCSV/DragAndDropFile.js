import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import ProgressBar from "react-bootstrap/ProgressBar";
import { MdOutlineUploadFile } from "react-icons/md";
import Button from "@ui-library/Button";
import uploadCsvService from "@services/uploadCsv.service";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

function DragAndDropFile({ isSuccessPage = false }) {
  const router = useRouter();
  const [fileName, setFileName] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [link, setLink] = useState(null);

  const onUploadProgress = (progressEvent) => {
    const { loaded, total } = progressEvent;
    setPercentage(Math.floor((loaded * 100) / total));
  };
  const uploadMutation = useMutation(
    ({ data, type }) =>
      uploadCsvService.uploadCsv({
        data,
        onUploadProgress,
        params: { fileType: type },
      }),
    {
      onSuccess: (res) => {
        let array = [];
        res.data.forEach((e) => {
          let arr = {};
          arr.questionText = e.question;
          arr.frequency = "Sometimes";
          arr.importance = 3;
          arr.priority = "Medium";
          arr.isFavorite = false;
          let b = [];
          for (let i = 0; i < e.answers.length; i++) {
            let k = e.answers[i].toString();
            if (k !== "") {
              b.push({
                answerText: k,
                confidence: 3,
                differentiation: 3,
                risk: "Medium",
              });
            }
          }
          arr.answers = b;
          array.push(arr);
        });

        localStorage.setItem("csv-data", JSON.stringify(array));
      },
      onError: (res) => {
        localStorage.setItem("csv-data", "");
      },
    }
  );

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Do something with the files
    setPercentage(0);
    setFileName(acceptedFiles[0].name);
    uploadMutation.mutateAsync({ data: acceptedFiles[0], type: "UPLOAD" });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    onDrop,
  });

  const uploadMutationFunction = () => {
    uploadMutation
      .mutateAsync({
        data: { fileUrl: link },
        type: "URL",
      })
      .then((res) => setFileName(res.fileName));
  };

  return (
    <CardView>
      <div className="card-header">
        <div className="title">Add Answers: Upload CSV</div>
        <div className="desc">
          <b>Before you upload</b>, please confirm your file is formatted as
          such:
        </div>
        <div className="image-example-csv">
          <ExampleImage src={"/images/example-csv.png"} alt="example-csv" />
        </div>
        {!isSuccessPage ? (
          <>
            <div className="drag-drop" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="container">
                <div className="upload-icon">
                  <MdOutlineUploadFile color="#1F5462" size={40} />
                </div>
                <div className="drop-text">
                  Drag and drop file here or <b>Browse Files</b>
                </div>
                <div className="file-type-text">
                  Accepted File Types: .xlsx and .csv only
                </div>
              </div>
            </div>

            <div className="google-drive">
              {" "}
              Or upload from your Google Drive{" "}
            </div>
            <div className="google-drive-url">
              <input
                type="url"
                className="input"
                name="google-drive-url-input"
                id="google-drive-url-input"
                placeholder="https://docs.google.com/"
                pattern="https://.*"
                required
                value={link ? link : ""}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    uploadMutationFunction();
                  }
                }}
              />
              <button
                className="upload-button"
                onClick={() => {
                  uploadMutationFunction();
                }}
                disabled={!link}
              >
                Upload
              </button>
            </div>
            {percentage !== 0 && (
              <div className="progress-bar-div">
                {uploadMutation.status !== "error" ? (
                  <>
                    <span className="percentage mx-2"> {`${percentage}%`}</span>
                    <ProgressBar now={percentage} />
                  </>
                ) : (
                  <>
                    <span className="percentage mx-2"> {`Upload Failed`}</span>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="image-success">
            <SuccessImage src={"/images/success-csv.png"} alt="success-csv" />
            <div className="success-text">Success! </div>

            <div className="file-name">
              Your{" "}
              <b>
                {router?.query?.fname !== "null"
                  ? router?.query?.fname
                  : "Google Drive File"}
              </b>{" "}
              was <br />
              uploaded successfully.
            </div>
          </div>
        )}
      </div>
      <div className="card-footer">
        {isSuccessPage ? (
          <>
            <div
              className="remove"
              onClick={() => router.push(`/questionImport/uploadCsv`)}
            >
              &lt; Remove and Upload New File
            </div>

            <StyledSaveButton
              onClick={() => router.push(`/questionImport/uploadQuestions`)}
              disabled={false}
            >
              Save & Continue
            </StyledSaveButton>
          </>
        ) : (
          <>
            <div></div>
            <StyledSaveButton
              onClick={() =>
                router.push(`/questionImport/uploadSuccess?fname=${fileName}`)
              }
              disabled={uploadMutation.status === "success" ? false : true}
            >
              Save & Continue
            </StyledSaveButton>
          </>
        )}
      </div>
    </CardView>
  );
}

export default DragAndDropFile;

const StyledSaveButton = styled(Button)`
  &&& {
    cursor: ${(props) =>
      props.disabled === true ? "not-allowed" : "pointer"} !important;
  }
`;

const ExampleImage = styled.img`
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
`;

const SuccessImage = styled.img`
  margin-left: auto;
  margin-right: auto;
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
    .image-example-csv {
      margin-top: 20px;
      margin-bottom: 20px;
      box-sizing: border-box;
      border: 1px solid #c4c4c4;
      border-radius: 5px;
    }
    .drag-drop {
      cursor: pointer;
      border: 1px dashed #5c5c5c;
      border-radius: 5px;
      background: #fff;
      height: 180px;
      display: flex;
      align-items: center;

      .container {
        width: 99%;
        height: 96%;
        border-radius: 5px;
        background: rgba(239, 241, 243, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .upload-icon {
          text-align: center;
          width: 100%;
        }

        .drop-text {
          text-align: center;
          font-family: "Barlow Condensed";
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
          line-height: 24px;
          text-align: center;
          color: #1f5462;
          width: 100%;
        }
        .file-type-text {
          text-align: center;
          width: 100%;
        }
      }
    }

    .google-drive {
      font-family: "Barlow Condensed";
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 0.02em;
      color: #003647;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .progress-bar-div {
      margin-top: 20px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .percentage {
        font-family: "Barlow Condensed";
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.02em;
        color: #477480;
      }
      .progress {
        width: 90%;
        background-color: #e0f4f4;
        .progress-bar {
          background-color: #1f5462;
          opacity: 0.8;
          border-radius: 2px 0px 0px 2px;
        }
      }
    }

    .google-drive-url {
      min-height: 40px;
      background: rgba(239, 241, 243, 0.8);
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      .input {
        border: none;
        background: transparent;
        flex-grow: 3;
        color: #393d3e;
        margin-left: 15px;
        &:focus {
          outline: none;
        }
      }
      .upload-button {
        background: #81c2c0;
        opacity: 1;
        border: 1px solid #81c2c0;
        border-radius: 5px;
        font-family: "Barlow Condensed", sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        color: #fff !important;
        line-height: 24px;
        letter-spacing: 0.02em;
        color: #c4c4c4;
        height: 80%;
        align-self: center;
        margin-right: 5px;
        min-width: 80px;
        &:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        &:active {
          opacity: 0.75;
        }
      }
    }
    .image-success {
      margin-top: 40px;
      margin-bottom: 30px;
      text-align: center;
      .success-text {
        text-align: center;
        font-family: "Barlow Condensed";
        font-style: normal;
        font-weight: 500;
        font-size: 40px;
        line-height: 48px;
        text-align: center;
        color: #81c2c0;
      }
      .file-name {
        font-family: "Manrope";
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        color: #393d3e;
        text-align: center;
      }
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
