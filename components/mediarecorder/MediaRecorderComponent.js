import { useState, useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import mediaPoster from "@public/icons/media_poster.png";
import {
  BsFillMicMuteFill,
  BsMicFill,
  BsFillCameraVideoOffFill,
  BsFillCameraVideoFill,
} from "react-icons/bs";
import styled from "styled-components";
import { useGoogleLogin, hasGrantedAnyScopeGoogle } from "@react-oauth/google";
import { useAuthUser } from "@contexts/AuthContext";
import authService from "@services/auth.service";
import answerService from "@services/answer.service";
import { useFormikContext } from "formik";
import { useTokens } from "@contexts/TokensContext";
import Bus from "@utils/Bus";
import { Modal as BsModal } from "react-bootstrap";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Select from "react-select";
import {
  MdOutlineSettings,
  MdOutlineScreenShare,
  MdStopScreenShare,
} from "react-icons/md";
import { VoiceCheck } from "./VoiceCheck";

const Recorder = ({
  attachments,
  setAttachments,
  selection,
  setMediaParam,
  setDisableIcons,
}) => {
  const videoRef = useRef(null);
  const testvideo = useRef(null);

  const formik = useFormikContext();

  const { auth, user } = useAuthUser();
  const { tokens, refetchTokens } = useTokens();
  const [playState, setplayState] = useState(true);
  const [pauseState, setpauseState] = useState(false);
  const [resumeState, setresumeState] = useState(false);
  const [stopState, setstopState] = useState(false);
  const [displayPreview, setdisplayPreview] = useState(false);
  const [isUploading, setUploading] = useState(false);

  const [showMediaRecorder, setShowMediaRecorder] = useState(false);
  const [showMute, setShowMute] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [screenShare, setScreenShare] = useState(false);

  const [audioDeviceID, setaudioDeviceID] = useState("");
  const [videoDeviceID, setvideoDeviceID] = useState("");

  const [driverOptions, setdriverOptions] = useState({
    audioIn: [],
    video: [],
  });
  const [toggleSettings, settoggleSettings] = useState(false);

  const [testStream, setTestStream] = useState(undefined);

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

  const constraints = {
    video: videoDeviceID ? { deviceId: videoDeviceID.value } : true,
    audio: audioDeviceID
      ? {
          deviceId: audioDeviceID.value,
          noiseSuppression: true,
          echoCancellation: false,
        }
      : true,
  };
  const [settings, setSettings] = useState(constraints);

  const {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    muteAudio,
    unMuteAudio,
    previewStream,
    clearBlobUrl,
  } = useReactMediaRecorder({
    screen: screenShare,
    video: settings.video,
    audio: settings.audio,
    type: { type: "video/mp4" },
    onStart: () => {
      setplayState(false);
      setpauseState(true);
      setstopState(true);
      setdisplayPreview(true);
      setDisableIcons(true);
      settoggleSettings(false);
      if (testStream && testvideo.current) {
        testStream.getTracks().forEach(function (track) {
          track.stop();
          track.enabled = false;
        });
        testvideo.current.srcObject = null;
      }
    },
    onStop: (blobURL, blobObject) => {
      setplayState(true);
      setpauseState(false);
      setresumeState(false);
      setstopState(false);
      setdisplayPreview(false);
      setDisableIcons(false);
      setUploading(true);

      let newFile = "";

      let fileName = "";
      if (blobObject.type == "audio/wav") {
        fileName = `${user.data.firstName} ${user.data.lastName}.mp3`;
      }
      if (blobObject.type == "video/mp4") {
        fileName = `${user.data.firstName} ${user.data.lastName}.mp4`;
      }
      newFile = new File([blobObject], fileName, {
        type: blobObject.type,
      });
      const formData = new FormData();
      formData.append("file", newFile);

      clearBlobUrl();
      if (tokens !== undefined) {
        const hasAccess =
          auth?.user?.authType === "Microsoft"
            ? true
            : hasGrantedAnyScopeGoogle(
                tokens?.googleTokenObject?.tokenObject,
                "https://www.googleapis.com/auth/drive"
              );
        formData.append(
          "token",
          JSON.stringify(
            auth?.user?.authType === "Microsoft"
              ? tokens?.microsoftTokenObject?.tokenObject?.uploadToken
              : tokens?.googleTokenObject?.tokenObject
          )
        );
        formData.append("type", auth?.user?.authType);
        if (hasAccess) {
          if (newFile) {
            answerService
              .fileUpload(formData)
              .then((res) => {
                const mfile = {
                  id: res.id,
                  mimeType:
                    auth?.user?.authType === "Microsoft"
                      ? "onedrive"
                      : blobObject.type,
                  name: fileName,
                  shareId:
                    auth?.user?.authType === "Microsoft" ? res.shareId : res.id,
                };
                setAttachments([...attachments, mfile]);
                const copy1 = [...attachments, mfile];
                const copy2 = copy1.map((el) => {
                  return {
                    id: el.id,
                    mimeType: el.mimeType,
                    name: el.name,
                    shareId: el.shareId,
                  };
                });
                formik.setFieldValue("attachment", copy2);
                setUploading(false);
                setMediaParam({
                  video: false,
                  audio: false,
                  selected: "",
                  type: "",
                });
                setShowMediaRecorder(false);
              })
              .catch((error) => {
                setUploading(false);
                setMediaParam({
                  video: false,
                  audio: false,
                  selected: "",
                  type: "",
                });
                setShowMediaRecorder(false);

                Bus.emit("error", { operation: "open", error: error.response });
              });
          }
        } else {
          setMediaParam({
            video: false,
            audio: false,
            selected: "",
            type: "",
          });
          googleDriveVerify();
        }
      }
    },
  });

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
      if (showVideo) setVidState(false);
      if (showMute) muteAudio();
      else unMuteAudio() ;
    }
  }, [previewStream]);

  useEffect(() => {
    clearBlobUrl();
    if (selection.audio == true || selection.video == true) {
      showTestVideo(settings, true);
      settoggleSettings(false);
      setShowMediaRecorder(true);
    }
  }, [selection]);

  useEffect(() => {
    if (screenShare == true) {
      startRecording();
    }
  }, [screenShare]);

  const showTestVideo = async (
    settingsarg,
    init = false,
    isScreenShare = false
  ) => {
    if (!isScreenShare) {
      navigator.mediaDevices
        .getUserMedia(settingsarg)
        .then(function (stream) {
          setTestStream(stream);
          testvideo.current.srcObject = stream;
          init && getDevices();
        })
        .catch(function (error) {
          Bus.emit("error", {
            operation: "open",
            error: "Something went wrong!",
          });
        });
    } else {
      //might be required in future
      /*
			try {
				const audioStream = await navigator.mediaDevices.getUserMedia(settingsarg);
				const screenStream = await navigator.mediaDevices.getDisplayMedia(settingsarg);

				screenStream.getTracks().forEach(track => {
					track.onended = stopRecording;
				});
				audioStream.getAudioTracks().forEach(track=>{
					screenStream.addTrack(track);
				});
				
				setTestStream(screenStream);
				testvideo.current.srcObject = screenStream;
			} catch(e) {
				console.log("Something went wrong!");
			};
			*/
    }
  };

  useEffect(() => {
    if (testStream && !showMediaRecorder) {
      testStream.getTracks().forEach(function (track) {
        track.stop();
        track.enabled = false;
      });
    }
    setScreenShare(false);
  }, [showMediaRecorder]);

  const clickedPause = () => {
    pauseRecording();
    setresumeState(true);
    setpauseState(false);
  };

  const clickedResume = () => {
    resumeRecording();
    setpauseState(true);
    setresumeState(false);
  };

  const muteMic = () => {
    setShowMute(true);
    if (videoRef.current && previewStream) {
      muteAudio();
    }
    if (testvideo) {
      let vidTrack2 = testStream.getAudioTracks();
      vidTrack2.forEach((track) => (track.enabled = false));
    }
  };

  const unmuteMic = () => {
    setShowMute(false);
    if (videoRef.current && previewStream) {
      unMuteAudio();
    }
    if (testvideo) {
      let vidTrack2 = testStream.getAudioTracks();
      vidTrack2.forEach((track) => (track.enabled = true));
    }
  };

  const setVidState = (flag) => {
    if (previewStream) {
      let vidTrack = previewStream.getVideoTracks();
      vidTrack.forEach((track) => (track.enabled = flag));
    }
    if (testvideo) {
      let vidTrack2 = testStream.getVideoTracks();
      vidTrack2.forEach((track) => (track.enabled = flag));
    }
  };

  const stopVideo = () => {
    setShowVideo(true);
    if (previewStream || testStream) setVidState(false);
  };

  const startVideo = () => {
    setShowVideo(false);
    if (previewStream || testStream) setVidState(true);
  };

  const startScreenShare = (flag) => {
    setScreenShare(flag);
    if (testStream && testvideo.current) {
      testStream.getTracks().forEach(function (track) {
        track.stop();
        track.enabled = false;
      });
      testvideo.current.srcObject = null;
    }
    showTestVideo(settings, false, flag);
  };

  if (testStream && testvideo.current) {
    testStream.getVideoTracks()[0].onended = function (e) {
      e.target.stop();
      e.target.enabled = false;
      setScreenShare(false);
      if (testvideo.current != null) {
        testvideo.current.srcObject = null;
      }
      showTestVideo(settings, false, false);
    };
  }

  const getDevices = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(gotDevices)
      .catch((error) => {
        Bus.emit("error", {
          operation: "open",
          error: error,
        });
      });
  };

  // Listen for changes to media devices and update the list accordingly
  navigator.mediaDevices.addEventListener("devicechange", (event) => {
    getDevices();
  });

  const customStyles = {
    control: (base) => ({
      ...base,
      background: "#1B1B1B",
    }),
  };

  // Fetch an array of devices of a certain type
  const gotDevices = (deviceInfos) => {
    let audioOptions = [];
    let videoOptions = [];

    for (let i = 0; i !== deviceInfos.length; ++i) {
      let deviceInfo = deviceInfos[i];
      let deviceName = deviceInfo.label;
      let deviceId = deviceInfo.deviceId;
      if (deviceInfo.kind === "audioinput" && deviceId != "") {
        audioOptions.push({ value: deviceId, label: deviceName });
      } else if (deviceInfo.kind === "audiooutput" && deviceId != "") {
      } else if (deviceInfo.kind === "videoinput" && deviceId != "") {
        videoOptions.push({ value: deviceId, label: deviceName });
      }
    }
    let testSettings = settings;
    if (audioOptions.length > 0 && !previewStream) {
      if (audioDeviceID.value == undefined) {
        setaudioDeviceID(audioOptions[0]);
        testSettings.audio = { deviceId: audioOptions[0].value };
      } else {
        let testaudioID = audioDeviceID;
        setaudioDeviceID(testaudioID);
        testSettings.audio = {
          deviceId: audioDeviceID.value,
          noiseSuppression: true,
          echoCancellation: false,
        };
      }
    }
    if (videoOptions.length > 0 && !previewStream) {
      if (videoDeviceID.value == undefined) {
        setvideoDeviceID(videoOptions[0]);
        testSettings.video = {
          deviceId: videoOptions[0].value,
        };
      } else {
        let testvideoID = videoDeviceID;
        setvideoDeviceID(testvideoID);
        testSettings.video = {
          deviceId: videoDeviceID.value,
        };
      }
    }
    setdriverOptions({ audioIn: audioOptions, video: videoOptions });
    setSettings(testSettings);
  };

  //--------------to check if voice is audible
  function colorPids(vol) {
    const allPids = [...document.querySelectorAll('.pid')];
    const numberOfPidsToColor = Math.round(vol / 10);
    const pidsToColor = allPids.slice(0, numberOfPidsToColor);
    for (const pid of allPids) {
      pid.style.backgroundColor = "#e6e7e8";
    }
    for (const pid of pidsToColor) {
      // console.log(pid[i]);
      pid.style.backgroundColor = "#69ce2b";
    }
  }
  
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })
    .then(function(stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
  
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
  
      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = function() {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;
        console.log(Math.round(average));
         colorPids(average);
      };
    })
    .catch(function(err) {
      /* handle the error */
      console.error(err);
    });
	
	
 //----testing 2nd method if voice is audible
  // let volumeCallback = null;
  // let volumeInterval = null;
  // const volumeVisualizer = [document.querySelectorAll('.volume-visualizer')]
  
  // // Initialize
  
  //  navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     video:true
  //   })
  //   .then(function(audioStream) {
  //   const audioContext = new AudioContext();
  //   const audioSource = audioContext.createMediaStreamSource(audioStream);
  //   const analyser = audioContext.createAnalyser();
  //   analyser.fftSize = 512;
  //   analyser.minDecibels = -127;
  //   analyser.maxDecibels = 0;
  //   analyser.smoothingTimeConstant = 0.4;
  //   audioSource.connect(analyser);
  //   const volumes = new Uint8Array(analyser.frequencyBinCount);
  //   volumeCallback = () => {
  //             analyser.getByteFrequencyData(volumes);
  //             let volumeSum = 0;
  //             for(const volume of volumes)
  //               volumeSum += volume;
  //             const averageVolume = volumeSum / volumes.length;
  //             // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
  //             volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%');
  //             set
  //  };
  //   }). catch(function(error){
  //   console.error('Failed to initialize volume visualizer, simulating instead...', e);
  //   // Simulation
  //   //TODO remove in production!
  //   let lastVolume = 50;
  //   volumeCallback = () => {
  //     const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
  //     lastVolume = volume;
  //     volumeVisualizer.style.setProperty('--volume', volume + '%');
      
  //   };
  // })
  // // Use
  // if(!showMute){
  //   // Updating every 100ms (should be same as CSS transition speed)
  //   // if(volumeCallback !== null && volumeInterval === null)
  //     volumeInterval = setInterval(volumeCallback, 100);
  // }else {
  //   // if(volumeInterval !== null) {
  //     clearInterval(volumeInterval);
  //     volumeInterval = null;
  //   //}
  // };
  

  
   
  

  return (
    <>
      <div className="px-3">
        <Modal
          show={showMediaRecorder}
          className="bs"
          onHide={() => {
            if (testStream && testvideo.current) {
              testStream.getTracks().forEach(function (track) {
                track.stop();
                track.enabled = false;
              });
              testvideo.current.srcObject = null;
            }
            setShowMediaRecorder(false);
            setScreenShare(false);
          }}
          size="xl"
          centered
        >
          <Modal.Body>
            <CloseButton
              onClick={() => {
                if (testStream && testvideo.current) {
                  testStream.getTracks().forEach(function (track) {
                    track.stop();
                    track.enabled = false;
                  });
                  testvideo.current.srcObject = null;
                }
                setShowMediaRecorder(false);
                setScreenShare(false);
              }}
            >
              {" "}
              <CloseIcon size={26} color="#fff" />
            </CloseButton>
            {/* <Voices>
             <div class="volume-visualizer" className="volume"></div>
            </Voices> */}
            {/* <VoiceCheck></VoiceCheck> */}
            <div className="wrap">
              <div className="videowrap">
        
                {(previewStream == null ||
                  (previewStream && !previewStream.active)) && (
                  <div className="testStream">
                    <video
                      poster={mediaPoster.src}
                      className="d-block"
                      autoPlay
                      ref={testvideo}
                      style={{ margin: "0 auto" }}
                      muted={true} 
                    />
                    
                     
                    {showVideo && (
                      <div>
                      <div className="vid-disable">
                        <BsFillCameraVideoOffFill color="#a5a5a5" size={24} />
                      </div>
                      </div>
                    )}
                    
                  </div>
                )}
                {showVideo && (
                  <div className="vid-disable">
                    <BsFillCameraVideoOffFill color="#fff" size={34} />
                  </div>
                )}
                <video
                  poster={mediaPoster.src}
                  className="d-block"
                  ref={videoRef}
                  autoPlay
                  style={{ margin: "0 auto" }}
                />
            
           

                {(previewStream == null ||(previewStream && !previewStream.active))?
                  <div className="testStream">
                    {!showMute ? (
                      <TestVoice>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      </TestVoice>
                    ) : (
                      <MuteVoice>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      <div class="pid"></div> 
                      </MuteVoice>
                    )}
                  </div>
                  :<div>
                  {!showMute ? (
                      <Voice>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      </Voice>
                    ) : (
                      <MuteVoice>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      <div class="pid"></div>
                      <div class="pid"></div> 
                      </MuteVoice>
                  )}</div>}


                    
              </div>
              

              {isUploading == true ? (
                <Controls>
                  <UploadText>
                    Please wait while your media is being uploaded...
                  </UploadText>
                </Controls>
              ) : (
                <Controls>
                  <div className="left">
                    {!showMute ? (
                      <ButtonToggle onClick={() => muteMic()}>
                        <BsMicFill color="#a5a5a5" size={24} />
                        <p>Mute Audio</p>
                      </ButtonToggle>
                    ) : (
                      <ButtonToggle onClick={() => unmuteMic()}>
                        <BsFillMicMuteFill color="#a5a5a5" size={24} />
                        <p>Unmute Audio</p>
                      </ButtonToggle>
                    )}

                    {!screenShare &&
                      (!showVideo ? (
                        <ButtonToggle onClick={() => stopVideo()}>
                          <BsFillCameraVideoFill color="#a5a5a5" size={24} />
                          <p>Stop Camera</p>
                        </ButtonToggle>
                      ) : (
                        <ButtonToggle onClick={() => startVideo()}>
                          <BsFillCameraVideoOffFill color="#a5a5a5" size={24} />
                          <p>Start Camera</p>
                        </ButtonToggle>
                        
                      ))}

                    {!stopState &&
                      (!screenShare ? (
                        <ButtonToggle onClick={() => startScreenShare(true)}>
                          <MdOutlineScreenShare color="#a5a5a5" size={24} />
                          <p>Share now</p>
                        </ButtonToggle>
                      ) : (
                        <ButtonToggle onClick={() => startScreenShare(false)}>
                          <MdStopScreenShare color="#a5a5a5" size={24} />
                          <p>Stop share</p>
                        </ButtonToggle>
                      ))}

                    <div>
                      {playState && (
                        <button
                          className="btn btn-success"
                          onClick={startRecording}
                        >
                          Start Recording
                        </button>
                      )}
                      {stopState && (
                        <button
                          className="btn btn-danger"
                          onClick={stopRecording}
                        >
                          End Recording
                        </button>
                      )}
                      {pauseState && (
                        <button
                          className="btn btn-warning"
                          onClick={clickedPause}
                          style={{ padding: "7px 12px" }}
                        >
                          Pause recording
                        </button>
                      )}
                      {resumeState && (
                        <button
                          className="btn btn-success"
                          onClick={clickedResume}
                          style={{ padding: "7px 12px" }}
                        >
                          Resume recording
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="right">
                    {(previewStream == null ||
                      (previewStream && !previewStream.active)) && (
                      <SettingsWrap>
                        <div
                          className="settingsMenu"
                          style={
                            toggleSettings
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          <p
                            style={{
                              marginBottom: "10px",
                              fontSize: "16px",
                              textAlign: "left",
                            }}
                          >
                            Device settings
                          </p>
                          <CloseButton
                            className="menu"
                            onClick={() => settoggleSettings(!toggleSettings)}
                          >
                            {" "}
                            <CloseIcon size={20} color="#a5a5a5" />
                          </CloseButton>
                          {driverOptions.audioIn.length > 0 && (
                            <div className="setting-item">
                              <span className="label">Audio source</span>
                              <Select
                                value={audioDeviceID}
                                options={driverOptions.audioIn}
                                isSearchable={false}
                                inputId="audioIn"
                                isDisabled={displayPreview ? true : false}
                                className="inputSelect"
                                classNamePrefix="inputSelect"
                                styles={customStyles}
                                onChange={(selectedOption) => {
                                  setaudioDeviceID(selectedOption);
                                  let tempSettings = settings;
                                  tempSettings.audio.deviceId =
                                    selectedOption.value;
                                  showTestVideo(
                                    tempSettings,
                                    false,
                                    screenShare
                                  );
                                }}
                                theme={(theme) => ({
                                  ...theme,
                                  borderRadius: 3,
                                  colors: {
                                    ...theme.colors,
                                    text: "#1f5462",
                                    font: "#1f5462",
                                    primary: "#1f5462",
                                    neutral80: "white",
                                    color: "white",
                                  },
                                })}
                              />
                            </div>
                          )}
                          {!screenShare && driverOptions.video.length > 0 && (
                            <div className="setting-item">
                              <span className="label">Video source</span>
                              <Select
                                value={videoDeviceID}
                                options={driverOptions.video}
                                styles={customStyles}
                                isSearchable={false}
                                isDisabled={displayPreview ? true : false}
                                inputId="videoIn"
                                className="inputSelect"
                                classNamePrefix="inputSelect"
                                onChange={(selectedOption) => {
                                  setvideoDeviceID(selectedOption);
                                  let tempSettings = settings;
                                  tempSettings.video.deviceId =
                                    selectedOption.value;
                                  showTestVideo(tempSettings);
                                }}
                                theme={(theme) => ({
                                  ...theme,
                                  borderRadius: 3,
                                  colors: {
                                    ...theme.colors,
                                    text: "#1f5462",
                                    font: "#1f5462",
                                    primary: "#1f5462",
                                    neutral80: "white",
                                    color: "white",
                                  },
                                })}
                              />
                            </div>
                          )}

                          {driverOptions.audioIn.length <= 0 &&
                            driverOptions.video.length <= 0 && (
                              <span style={{ color: "red" }}>
                                Please verify browser permissions for audio and
                                video.
                              </span>
                            )}
                        </div>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            settoggleSettings(!toggleSettings);
                          }}
                        >
                          <MdOutlineSettings color="#a5a5a5" size={25} />
                          <p>Settings</p>
                        </div>
                      </SettingsWrap>
                    )}
                  </div>
                </Controls>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Recorder;

const UploadText = styled.p`
  text-align: center;
  font-family: "Manrope", sans-serif;
  font-style: normal;
  font-weight: 500;
  color: #fff;
  font-size: 16px;
  width: 100%;
  margin: 0 !important;
`;

const StyledRecordPreview = styled.div``;

const SettingsWrap = styled.div`
  position: relative;
  text-align: center;
  margin-right: 15px;
  .settingsMenu {
    position: absolute;
    z-index: 9;
    top: -162px;
    right: -50%;
    background-color: #1b1b1b;
    padding: 12px;
    p {
      padding-right: 20px;
    }
    .setting-item {
      display: flex;
      align-items: center;
      .label {
        white-space: nowrap;
        color: #fff;
        padding-right: 10px;
      }
    }
  }
  p {
    color: #a5a5a5;
    font-size: 12px;
    margin: 0;
    white-space: nowrap;
  }
`;

const ButtonToggle = styled.span`
  display: inline-block;
  margin: 0 4px;
  text-align: center;
  cursor: pointer;
  width: 80px !important;
  &:first-child {
    margin-left: 0;
  }
  &:nth-child(3) {
    margin-right: 20px;
  }
`;

const Controls = styled.div`
  background-color: #1b1b1b;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  .left {
    display: flex;
    .btn {
      text-transform: uppercase;
      font-size: 16px;
      margin: 3px 4px;
      line-height: 1.2;
      padding: 8px 12px;
      margin-top: -2px;
    }
    span {
      p {
        color: #a5a5a5;
        font-size: 12px;
        margin: 0;
      }
    }
  }
  .right {
    .inputSelect {
      margin: 0 4px;
      width: 200px;
      margin-bottom: 5px;
      text-align: left;
    }
  }
`;

const Modal = styled(BsModal)`
  &&& {
    .modal-dialog {
      width: 100vh;
      max-width: 100%;
      margin: 0.5rem auto !important;
    }
    .modal-content {
      background: #ffffff;
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
      border: none;
    }
    .modal-header {
      border: none;
    }
    .modal-body {
      padding: 0;
      background-color: #1b1b1b;
      .videowrap {
        width: 100%;
        padding-top: 56.25%;
        height: 0px;
        position: relative;
        margin: 0 auto;
        .vid-disable {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9;
        }
        .testStream {
          position: absolute;
          bottom: 15px;
          left: 15px;
          width: 20%;
          height: 20%;
          z-index: 9;
        }
      }
      video {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
      }
      video::-webkit-media-controls-fullscreen-button {
        display: none;
      }
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 14px;
  z-index: 10;
  &.menu {
    top: 10px;
    right: 5px;
  }
`;



const TestVoice= styled.div`
   width: 50%;
    margin-left: 18px;
    position: absolute;
    display: inline-block;
    top: 3%;
    z-index: 10;
    right: 45%;

  
  .pid{
    ${'' /* width: calc(10% - 10px); */}
    height: 5px;
    display: inline-block;
    margin: 5px 3px;
    width: 4px;
  }
  `;

const Voice= styled.div`
    width: 50%;
    margin-left: 18px;
    position: absolute;
    display: inline-block;
    top: 14px;
    z-index: 10;
  
  .pid{
    ${'' /* width: calc(10% - 10px); */}
    height: 5px;
    display: inline-block;
    margin: 5px 3px;
    width: 4px;
  }
  `;

  const MuteVoice= styled.div`
    width: 50%;
    margin-left:12px;
    display:none;
  
  .pid{
    width: calc(10% - 10px);
    height: 5px;
    display: inline-block;
    margin: 5px 3px;

  }
  `;

  const Voices = styled.div`
     padding-left:20px;
     .volume {
     --volume: 0%;
     position: relative;
     width: 200px;
     height: 20px;
     margin: 2px 10px 3px 10px;
     background-color: #DDD;
   };
  
   .volume::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: var(--volume);
      background-color: green;
      transition: width 100ms linear;
   };
  
   .voice-btn {
     margin-left: 50px;
     color:black;
   }
   `;
  
