import Popover from "react-bootstrap/Popover";
import styled from "styled-components";
import { useFormikContext } from "formik";
import { useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import MediaOverlay from "@components/mediarecorder/MediaOverlay";

import {
  IoIosArrowDroprightCircle as RightArrow,
  IoIosArrowDropleftCircle as LeftArrow,
} from "react-icons/io";

const audioPopover = (file) => {
  return (
    <StyledPopover id={`popover-basic-${file.id}`}>
      <Popover.Header as="h4">
        {file.name}
        <a
          href={`https://drive.google.com/uc?id=${file.id}&export=download`}
          style={{ float: "right", marginTop: "2px" }}
        >
          <MdOutlineDownloadForOffline color="#393D3E" size={20} />
        </a>
      </Popover.Header>
      <Popover.Body>
        <audio
          controls
          src={`https://drive.google.com/uc?export=preview&confirm=1&id=${file.id}`}
          type={file.mimeType}
        >
          {file.name}
        </audio>
      </Popover.Body>
    </StyledPopover>
  );
};

const videoPopover = (file) => {
  return (
    <StyledPopover id={`popover-basic-${file.id}`}>
      <Popover.Header as="h4">
        {file.name}
        <a
          href={`https://drive.google.com/uc?id=${file.id}&export=download`}
          style={{ float: "right", marginTop: "2px" }}
        >
          <MdOutlineDownloadForOffline color="#393D3E" size={20} />
        </a>
      </Popover.Header>
      <Popover.Body>
        <video
          controls
          width={300}
          height={200}
          src={`https://drive.google.com/uc?export=preview&confirm=1&id=${file.id}`}
          type={file.mimeType}
        >
          {file.name}
        </video>
      </Popover.Body>
    </StyledPopover>
  );
};

const imagePopover = (file) => {
  return (
    <StyledPopover id={`popover-basic-${file.id}`}>
      <Popover.Header as="h4">
        {file.name}
        <a
          href={`https://drive.google.com/uc?id=${file.id}&export=download`}
          style={{ float: "right", marginTop: "2px" }}
        >
          <MdOutlineDownloadForOffline color="#393D3E" size={20} />
        </a>
      </Popover.Header>
      <Popover.Body>
        <img
          id={`image-${file.id}`}
          name="image"
          alt={`image-${file.id}`}
          src={`https://drive.google.com/uc?export=preview&confirm=1&id=${file.id}`}
        />
      </Popover.Body>
    </StyledPopover>
  );
};

const pdfPopover = (file) => {
  return (
    <StyledPopover id={`popover-basic-${file.id}`}>
      <Popover.Header as="h4">
        {file.name}
        <a
          href={`https://drive.google.com/uc?id=${file.id}&export=download`}
          style={{ float: "right", marginTop: "2px" }}
        >
          <MdOutlineDownloadForOffline color="#393D3E" size={20} />
        </a>
      </Popover.Header>
      <Popover.Body>
        <a
          href={`https://drive.google.com/uc?export=preview&confirm=1&id=${file.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {file.name}
        </a>
      </Popover.Body>
    </StyledPopover>
  );
};

const filePopover = (file) => {
  return (
    <StyledPopover id={`popover-basic-${file.id}`}>
      <Popover.Header as="h4">{file.name}</Popover.Header>
      <Popover.Body>
        <a
          href={`https://drive.google.com/file/d/${file.id}/view?usp=sharing`}
          target="_blank"
          rel="noreferrer"
        >
          {file.name}
        </a>
      </Popover.Body>
    </StyledPopover>
  );
};
const onedrivePopover = (file) => {
  return (
    <StyledPopover id={`popover-basic-${file.id}`}>
      <Popover.Header as="h4">{file.name}</Popover.Header>
      <Popover.Body>
        <a
          href={`https://1drv.ms/${file.shareId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {file.name}
        </a>
      </Popover.Body>
    </StyledPopover>
  );
};
const AttachmentList = ({
  attachments,
  setAttachments,
  isFromEditor,
  tableView = false,
  faqView = false,
  arrows = true,
}) => {
  const formik = useFormikContext();
  const ref = useRef(null);

  const removeAttachment = (file) => {
    const copy = attachments.filter((e) => {
      if (e.id !== file.id) {
        return e;
      }
    });
    setAttachments([...copy]);
    formik.setFieldValue("attachment", [...copy]);
  };

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  const mediaOverlaySelector = (mimeType) => {
    switch (mimeType) {
      case "audio/mpeg":
      case "audio/wav":
      case "audio/mp3":
        return [audioPopover, "audio"];

      case "video/mp4":
        return [videoPopover, "video"];
      case "image/jpeg":
      case "image/jpg":
      case "image/png":
      case "image/webp":
        return [imagePopover, "image"];

      case "application/pdf":
        return [pdfPopover, "pdf"];

      case "application/vnd.google-apps.document":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.google-apps.presentation":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      case "application/vnd.google-apps.spreadsheet":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return [filePopover, "file"];
      case "onedrive":
        return [onedrivePopover, "onedrive"];
      default:
        return [filePopover, "file"];
    }
  };

  return (
    <>
      {attachments && isFromEditor && (
        <Row>
          <Col>
            <Title>{attachments && attachments.length} Attachments</Title>
          </Col>
        </Row>
      )}
      <AttachmentListWrapper>
        {arrows && attachments?.length > 0 && (
          <>
            <RightArrowDiv>
              <RightArrowStyled
                color="#81C2C0"
                size={22}
                role="button"
                onClick={() => scroll(90)}
              />
            </RightArrowDiv>

            <LeftArrowDiv>
              <LeftArrowStyled
                color="#81C2C0"
                size={22}
                role="button"
                onClick={() => scroll(-90)}
              />
            </LeftArrowDiv>
          </>
        )}

        {attachments && (
          <Wrapper
            className="mb-1"
            ref={ref}
            tableView={tableView}
            faqView={faqView}
            isFromEditor={isFromEditor}
            arrows={arrows}
          >
            {attachments?.map((file) => (
              <>
                <MediaOverlay
                  key={file.id}
                  file={file}
                  overlayTrigger={mediaOverlaySelector(file.mimeType)[0]}
                  removeAttachment={removeAttachment}
                  isFromEditor={isFromEditor}
                  type={mediaOverlaySelector(file.mimeType)[1]}
                />
              </>
            ))}
          </Wrapper>
        )}
      </AttachmentListWrapper>
    </>
  );
};

export default AttachmentList;

const RightArrowDiv = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9;
  display: flex;
  align-items: center;
  padding: 10px 6px;
  padding-right: 3px;
  justify-content: flex-end;
  background: linear-gradient(
    270.77deg,
    #ffffff 63.8%,
    rgba(255, 255, 255, 0) 125.93%
  );
`;

const LeftArrowDiv = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9;
  display: flex;
  align-items: center;
  padding: 10px 6px;
  padding-left: 3px;
  justify-content: flex-start;
  background: linear-gradient(
    90deg,
    #ffffff 63.8%,
    rgba(255, 255, 255, 0) 125.93%
  );
`;

const RightArrowStyled = styled(RightArrow)``;
const LeftArrowStyled = styled(LeftArrow)``;

const AttachmentListWrapper = styled.div`
  position: relative;
  margin: 0 3px;
`;

const Wrapper = styled.div`
  display: ${(props) => (props.arrows ? "-webkit-box" : "flex")};
  flex-wrap: ${(props) => (props.arrows ? "no-wrap" : "wrap")};
  overflow-x: ${(props) => (props.arrows ? "hidden" : "initial")};
  scrollbar-width: thin;
  overflow-y: ${(props) => (props.arrows ? "hidden" : "auto")};
  background-color: #fff;
  max-height: ${(props) => (props.arrows ? "70px" : "200px")};
  max-width: ${(props) =>
    props.faqView || props.isFromEditor ? "100%" : "700px"};
  padding: ${(props) => (props.arrows ? "0 25px" : "0")};
  position: relative;
`;

const StyledPopover = styled(Popover)`
  border: 1px solid #81c2c0;
  max-width: 470px;
  .popover-header {
    margin: 0;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    padding: 8px;
  }
  .popover-body {
    padding: 8px;
    img {
      max-width: 450px;
      max-height: 450px;
    }
  }

  .popover-arrow:before {
    border-top-color: #81c2c0;
  }
`;

const Title = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  color: #81c2c0;
  padding: 8px 0;
  padding-left: 8px;
`;
