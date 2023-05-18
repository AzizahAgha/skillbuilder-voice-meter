import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import drivelogoImg from "@public/images/google-drive.png";
import oneDrivelogoImg from "@public/icons/onedrive.png";
import { BsInfoCircle } from "react-icons/bs";
import Tooltip from "@ui-library/Tooltip";
import videoIcon from "@public/svgs/videoIcon.svg";
import authService from "@services/auth.service";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthUser } from "@contexts/AuthContext";
import answerService from "@services/answer.service";
import { useTokens } from "@contexts/TokensContext";
import Bus from "@utils/Bus";

export default function AttachmentIcons({
  handleOpenPicker,
  setMediaParam,
  disableIcons,
  handleAttachment,
}) {
  const { auth } = useAuthUser();
  const { tokens, refetchTokens } = useTokens();
  const [externalWindowConnectToOnedrive, setExternalWindowConnectToOnedrive] =
    useState();
  const intervalRefConnectToOnedrive = useRef();
  const [popup1fail, setpopup1fail] = useState(true);
  const [popup2fail, setpopup2fail] = useState(true);

  const [
    externalWindowConnectToFilePicker,
    setExternalWindowConnectToFilePicker,
  ] = useState();
  const intervalRefConnectToFilePicker = useRef();

  const redirectURI = window.location.origin;

  const googleDriveVerify = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive",
    hint: auth?.user?.email,
    flow: "auth-code",
    onSuccess: (codeResponse) => {
      authService
        .getToken(codeResponse.code)
        .then(() => {
          refetchTokens();
        })
        .catch((error) => {
          Bus.emit("error", {
            operation: "open",
            error: error.response,
          });
        });
    },
    onError: (error) => {
      Bus.emit("error", { operation: "open", error: error.response });
    },
  });

  useEffect(()=> {
    if(tokens?.microsoftTokenObject?.isDriveAuthorize){
      setpopup1fail(false);
      setpopup2fail(false);
    }
  },[tokens])

  // first pop up's code is to connect to microsoft one drive
  const clearTimerConnectToOnedrive = () => {
    window.clearInterval(intervalRefConnectToOnedrive.current);
  };

  const createPopupConnectToOnedrive = () => {
    const width = 500;
    const height = 500;
    const title = `WINDOW TITLE`;
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.NEXT_PUBLIC_ONE_DRIVE_CLIENTID}&scope=Files.ReadWrite,Files.ReadWrite.All,offline_access&response_type=code&redirect_uri=${redirectURI}`;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const externalPopup = window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    return externalPopup;
  };
  const connectToOneDrive = () => {
    setExternalWindowConnectToOnedrive(createPopupConnectToOnedrive());
  };

  // Second pop up's code is to connect to microsoft's file picker v8
  const clearTimerConnectToFilePicker = () => {
    window.clearInterval(intervalRefConnectToFilePicker.current);
  };
  const createPopupConnectToFilePicker = () => {
    const width = 500;
    const height = 500;
    const title = `WINDOW TITLE`;
    const url2 = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${process.env.NEXT_PUBLIC_ONE_DRIVE_CLIENTID}&scope=OneDrive.ReadWrite,offline_access&response_type=code&redirect_uri=${redirectURI}`;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const externalPopup2 = window.open(
      url2,
      title,
      `width=${width},height=${height},left=${left},top=${top}`
    );
    return externalPopup2;
  };
  const connectToOneDriveFilePIcker = () => {
    setExternalWindowConnectToFilePicker(createPopupConnectToFilePicker());
  };

  useEffect(() => {
    if (externalWindowConnectToOnedrive) {
      
      intervalRefConnectToOnedrive.current = window.setInterval(() => {
        try {
          const currentUrl = externalWindowConnectToOnedrive.location.href;
          const params = new URL(currentUrl).searchParams;
          const code = params.get("code");
          if (!code) {
            return;
          }
          if (code) {
            authService
              .getMSToken(code, 1)
              .then(function (response) {
                setpopup1fail(false);
                refetchTokens();
                connectToOneDriveFilePIcker();
              })
              .catch(function (error) {
                Bus.emit("error", { operation: "open", error: error.response });
              });
          }
          clearTimerConnectToOnedrive();
          externalWindowConnectToOnedrive.close();
        } catch (error) {
          // eslint-ignore-line
          setpopup1fail(true);
        } finally {
          if (
            !externalWindowConnectToOnedrive ||
            externalWindowConnectToOnedrive.closed
          ) {
            clearTimerConnectToOnedrive();
          }
        }
      }, 700);
    }
    return () => {
      if (externalWindowConnectToOnedrive)
        externalWindowConnectToOnedrive.close();
    };
  }, [externalWindowConnectToOnedrive]);

  useEffect(() => {
    if (externalWindowConnectToFilePicker) {
      intervalRefConnectToFilePicker.current = window.setInterval(() => {
        try {
          const currentUrl = externalWindowConnectToFilePicker.location.href;
          const params = new URL(currentUrl).searchParams;
          const code = params.get("code");
          if (!code) {
            return;
          }
          if (code) {
            authService
              .getMSToken(code, 2)
              .then(function (response) {
                setpopup2fail(false);
                refetchTokens();
              })
              .catch(function (error) {
                Bus.emit("error", { operation: "open", error: error.response });
              });
          }

          clearTimerConnectToFilePicker();
          externalWindowConnectToFilePicker.close();
        } catch (error) {
          // eslint-ignore-line
          setpopup2fail(true);
        } finally {
          if (
            !externalWindowConnectToFilePicker ||
            externalWindowConnectToFilePicker.closed
          ) {
            clearTimerConnectToFilePicker();
          }
        }
      }, 700);
    }
    return () => {
      if (externalWindowConnectToFilePicker)
        externalWindowConnectToFilePicker.close();
    };
  }, [externalWindowConnectToFilePicker]);

  const baseUrl = "https://onedrive.live.com/picker";
  let win = null;
  let port = null;

  const options = {
    sdk: "8.0",
    entry: {
      oneDrive: {
        files: {},
      },
    },
    authentication: {},
    messaging: {
      origin: redirectURI,
      channelId: "27",
    },
    selection: {
      mode: "multiple",
    },
    typesAndSources: {
      mode: "files",
      pivots: {
        oneDrive: true,
        recent: true,
      },
    },
  };

  // one drive file picker v8 implementation with message listener
  const pickerCode = () => {
    win = window.open("", "Picker", "width=1080,height=680");

    const queryString = new URLSearchParams({
      filePicker: JSON.stringify(options),
      locale: "en-us",
    });
    const url = `${baseUrl}?${queryString}`;

    const form = win.document.createElement("form");
    form.setAttribute("action", url);
    form.setAttribute("method", "POST");

    const tokenInput = win.document.createElement("input");
    tokenInput.setAttribute("type", "hidden");
    tokenInput.setAttribute("name", "access_token");

    tokenInput.setAttribute(
      "value",
      tokens.microsoftTokenObject.tokenObject.onedriveToken.access_token
    );

    form.appendChild(tokenInput);
    win.document.body.append(form);
    form.submit();

    window.addEventListener("message", (event) => {
      if (event.origin === "https://onedrive.live.com") {
        if (event.source && event.source === win) {
          const message = event.data;

          if (
            message.type === "initialize" &&
            message.channelId === options.messaging.channelId
          ) {
            port = event.ports[0];

            port.addEventListener("message", messageListener);

            port.start();

            port.postMessage({
              type: "activate",
            });
          }
        }
      }
    });
  };

  async function messageListener(message) {
    switch (message.data.type) {
      case "notification":
        break;

      case "command":
        port.postMessage({
          type: "acknowledge",
          id: message.data.id,
        });

        const command = message.data.data;

        switch (command.command) {
          case "authenticate":
            if (
              typeof tokens.microsoftTokenObject.tokenObject.onedriveToken
                .access_token !== "undefined" &&
              tokens.microsoftTokenObject.tokenObject.onedriveToken
                .access_token !== null
            ) {
              port.postMessage({
                type: "result",
                id: message.data.id,
                data: {
                  result: "token",
                  token:
                    tokens.microsoftTokenObject.tokenObject.onedriveToken
                      .access_token,
                },
              });
            } else {
              Bus.emit("error", {
                operation: "open",
                error: `Could not get auth token`,
              });
            }
            break;

          case "close":
            win.close();
            break;

          case "pick":
            let fileData = [];
            let dataObj = [];

            command.items.forEach(function (arrayItem) {
              fileData.push({ id: arrayItem.id, name: arrayItem.name });
            });

            if (fileData !== undefined && fileData.length > 0) {
              answerService
                .grantAccess(fileData, "Microsoft")
                .then((res) => {
                  res.data.forEach(function (arrayItem) {
                    dataObj.push({
                      id: arrayItem.id,
                      mimeType: "onedrive",
                      name: arrayItem.name,
                      shareId: arrayItem.shareId,
                    });
                  });
                  if (dataObj !== undefined && dataObj.length > 0) {
                    handleAttachment(dataObj, "Microsoft");
                  }
                })
                .catch((error) => {
                  Bus.emit("error", {
                    operation: "open",
                    error: error.response,
                  });
                });
            }
            port.postMessage({
              type: "result",
              id: message.data.id,
              data: {
                result: "success",
              },
            });

            win.close();

            break;

          default:
            Bus.emit("error", {
              operation: "open",
              error: `Unsupported command`,
            });
            port.postMessage({
              result: "error",
              error: {
                code: "unsupportedCommand",
                message: command.command,
              },
              isExpected: true,
            });
            break;
        }
        break;
      default:
        break;
    }
  }
  return (
    <StyledAttachmentIcons>
      <div className="d-flex align-items-center wrap">
     
        {auth?.user?.authType == "Microsoft" &&
          tokens !== undefined &&
          tokens?.microsoftTokenObject?.isDriveAuthorize && (
            <Button
              onClick={async () => {
                setMediaParam({
                  video: true,
                  audio: true,
                  selected: "video",
                  type: "video/mp4",
                });
              }}
            >
              <img
                src={videoIcon.src}
                alt="videoIcon"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: 20,
                  color:
                    (tokens?.microsoftTokenObject?.tokenObject === undefined &&
                      !tokens?.microsoftTokenObject?.isDriveAuthorize) ||
                    disableIcons
                      ? "#969C9D"
                      : "#444",
                }}
              />
              Record Media
            </Button>
          )}

        {(auth?.user?.authType == "Google" ||
          auth?.user?.authType == "Facebook") &&
          tokens !== undefined &&
          tokens?.googleTokenObject?.isDriveAuthorize &&
          !tokens?.googleTokenObject?.isTokenExpired && (
            <Button
              onClick={async () => {
                setMediaParam({
                  video: true,
                  audio: true,
                  selected: "video",
                  type: "video/mp4",
                });
              }}
            >
              <img
                src={videoIcon.src}
                alt="videoIcon"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: 20,
                  color:
                    (tokens?.googleTokenObject?.tokenObject === undefined &&
                      !tokens?.googleTokenObject?.isDriveAuthorize) ||
                    disableIcons
                      ? "#969C9D"
                      : "#444",
                }}
              />
              Record Media
            </Button>
          )}

        {tokens !== undefined &&
        tokens?.googleTokenObject?.isDriveAuthorize &&
        !tokens?.googleTokenObject?.isTokenExpired ? (
          <>
            <Button
              onClick={async () => {
                handleOpenPicker();
                setMediaParam({
                  video: false,
                  audio: false,
                  selected: "",
                  type: "",
                });
              }}
            >
              <img
                alt="google drive"
                src={drivelogoImg.src}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: 20,
                }}
              />
              Google Drive
            </Button>

            <Tooltip text="With Google Drive Picker you can add attachments from your Google Drive account OR drag-drop files from your device using the upload feature.">
              <span>
                <BsInfoCircle color="#555" size={16} />
              </span>
            </Tooltip>
          </>
        ) : (
          <div className="wrap">
            <Button
              className="authButton"
              onClick={async () => {
                if (
                  tokens?.googleTokenObject?.isTokenExpired &&
                  tokens?.googleTokenObject?.isDriveVerfied
                ) {
                  authService
                    .getRefreshToken(
                      tokens?.googleTokenObject?.tokenObject?.refresh_token
                    )
                    .then((res) => {
                      refetchTokens();
                      openPickerClick();
                    })
                    .catch((err) => {
                      alert(err);
                    });
                } else {
                  googleDriveVerify();
                }
              }}
            >
              <img
                alt="connect to google drive"
                src={drivelogoImg.src}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: 20,
                }}
              />
              Connect to GoogleDrive
            </Button>
          </div>
        )}

        {tokens !== undefined &&
        tokens?.microsoftTokenObject?.isDriveAuthorize && !popup1fail && !popup2fail ? (
          <Button
            onClick={async () => {
              pickerCode();
              setMediaParam({
                video: false,
                audio: false,
                selected: "",
                type: "",
              });
            }}
          >
            <img
              alt="one drive picker"
              src={oneDrivelogoImg.src}
              style={{
                width: "100%",
                height: "auto",
                maxWidth: 20,
              }}
            />
            OneDrive picker
          </Button>
        ) : (
          <>
            <Button
              onClick={async () => {
                connectToOneDrive();
                setMediaParam({
                  video: false,
                  audio: false,
                  selected: "",
                  type: "",
                });
              }}
            >
              <img
                alt="connect to one drive"
                src={oneDrivelogoImg.src}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: 20,
                }}
              />
              Connect to OneDrive
            </Button>
            <Tooltip text="Please allow browser popups permissions for this application to upload/pick files from Onedrive. If the popup window does not autoclose, please refresh and try again">
              <span>
                <BsInfoCircle color="#555" size={16} />
              </span>
            </Tooltip>
          </>
        )}
      </div>
    </StyledAttachmentIcons>
  );
}

const StyledAttachmentIcons = styled.div`
  .disabled {
    pointer-events: none;
    cursor: disabled;
    opacity: 0.5;
  }
  img {
    cursor: pointer;
    margin-right: 5px;
  }
  span {
    line-height: 1;
  }
  .authButton {
    padding: 0 10px;
    img {
      margin: 0;
    }
  }
  .wrap {
    flex-wrap: wrap;
  }
`;

const Button = styled.button`
  background: transparent;
  border: 1px solid #c0c0c0;
  border-radius: 5px !important;
  margin: 0 3px !important;
  font-family: Barlow Condensed !important;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #393d3e;
  min-width: 100px;
`;
