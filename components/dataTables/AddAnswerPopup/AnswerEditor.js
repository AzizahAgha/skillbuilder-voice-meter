import React, { useState } from "react";
import { useFormikContext } from "formik";
import dynamic from "next/dynamic";
import AttachmentIcons from "@components/mediarecorder/AttachmentIcons";
import getConfig from "next/config";
import { GoogleOAuthProvider } from "@react-oauth/google";
import useDrivePicker from "react-google-drive-picker";
import AttachmentList from "@components/mediarecorder/AttachmentList";
import authService from "@services/auth.service";
import Bus from "@utils/Bus";
import answerService from "@services/answer.service";
import { useTokens } from "@contexts/TokensContext";

const TextEditor = dynamic(() => import("@ui-library/TextEditor"), {
  ssr: false,
});
const Recorder = dynamic(
  () => import("@components/mediarecorder/MediaRecorderComponent.js"),
  { ssr: false }
);

const {
  publicRuntimeConfig: { GOOGLE_CLIENT_ID },
} = getConfig();

export default function AnswerEditor() {
  const formik = useFormikContext();
  const { tokens, refetchTokens } = useTokens();
  const [openPicker, authResponse] = useDrivePicker();
  const [mediaSelection, setMediaSelection] = useState({
    video: false,
    audio: false,
    selected: "",
    type: "",
  });
  const [answerAttachment, setanswerAttachment] = useState(
    formik.values.attachment ? formik.values.attachment : []
  );

  const [disableIcons, setDisableIcons] = useState(false);

  const validatePickerClick = () => {
    if (tokens?.googleTokenObject?.isTokenExpired) {
      authService
        .getRefreshToken(tokens?.googleTokenObject?.tokenObject?.refresh_token)
        .then(() => {
          refetchTokens();
          openPickerClick();
        })
        .catch((error) => {
          Bus.emit("error", {
            operation: "open",
            error: error.response,
          });
        });
    } else {
      openPickerClick();
    }
  };

  const handleAttachment = (data, atype) => {
    const allowedMimeTypes = [
      "video/mp4",
      "audio/mpeg",
      "audio/wav",
      "audio/mp3",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/vnd.google-apps.document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.google-apps.presentation",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.google-apps.spreadsheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "onedrive",
    ];
    let dataObj = [];
    if (atype == "Google") dataObj = data.docs;
    else dataObj = data;
    if (dataObj.length > 0) {
      let fileObjs = [];
      let formikObj = [];
      let fileData = [];

      dataObj.map((fileItem, key) => {
        let mFile = fileItem;
        if (allowedMimeTypes.includes(mFile.mimeType)) {
          const copy = answerAttachment.filter((e) => {
            if (e.id !== mFile.id) {
              return e;
            } else {
              // eslint-ignore-line
              // alert(mFile.name + " attachment already added");
            }
          });
          if (key == 0) fileObjs = [...copy, mFile];
          else fileObjs = [...fileObjs, mFile];
          setanswerAttachment(fileObjs);
        } else {
          // eslint-ignore-line
          // alert(file.name + " file format not allowed.");
        }
      });
      fileObjs.forEach((el) => {
        fileData = [...fileData, { id: el.id, name: el.name }];
        formikObj = [
          ...formikObj,
          {
            id: el.id,
            mimeType: el.mimeType,
            name: el.name,
            shareId: atype === "Google" ? el.id : el.shareId,
            type: atype,
          },
        ];
      });

      formik.setFieldValue("attachment", formikObj);
      if (atype == "Google" && fileData.length > 0)
        answerService
          .grantAccess(fileData, "Google")
          .then((res) => {})
          .catch((error) => {
            Bus.emit("error", {
              operation: "open",
              error: error.response,
            });
          });
    }
  };

  const openPickerClick = () => {
    openPicker({
      clientId: GOOGLE_CLIENT_ID,
      developerKey: "AIzaSyDoqS6OiXvYLXmv0HWlHuosHEbPQ-Cie0E",
      viewId: "DOCS",
      token:
        tokens?.googleTokenObject?.tokenObject &&
        tokens?.googleTokenObject?.tokenObject?.access_token
          ? tokens?.googleTokenObject?.tokenObject?.access_token
          : "",
      showUploadView: true,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        var elements = document.getElementsByClassName("picker-dialog");
        for (var i = 0; i < elements.length; i++) {
          elements[i].style.zIndex = "2000";
        }
        if (data.docs) {
          handleAttachment(data, "Google");
        }
      },
    });
  };

  return (
    <div className="d-flex flex-column" style={{ height: "100%" }}>
      <div className="d-block" style={{ position: "relative", height: "100%" }}>
        <div className="row">
          <div className="col-md-6">
            <TextEditor
              value={formik.values.answer}
              onChange={(value) => formik.setFieldValue("answer", value)}
            />
          </div>
          <div className="col-md-6">
            <div
              style={{
                padding: "12px",
                borderLeft: "1px solid #969C9D",
                height: "100%",
              }}
            >
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <AttachmentIcons
                  handleOpenPicker={validatePickerClick}
                  setMediaParam={setMediaSelection}
                  disableIcons={disableIcons}
                  handleAttachment={handleAttachment}
                />
              </GoogleOAuthProvider>
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <Recorder
                  selection={mediaSelection}
                  setMediaParam={setMediaSelection}
                  attachments={answerAttachment}
                  setAttachments={setanswerAttachment}
                  setDisableIcons={setDisableIcons}
                />
              </GoogleOAuthProvider>
              <AttachmentList
                attachments={answerAttachment}
                setAttachments={setanswerAttachment}
                isFromEditor={true}
                arrows={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
