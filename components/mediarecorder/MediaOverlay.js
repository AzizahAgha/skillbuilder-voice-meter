import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styled from "styled-components";
import { useAuthUser } from "@contexts/AuthContext";
import imageIcon from "@public/svgs/imageIcon.svg";
import audioIcon from "@public/svgs/audioIcon.svg";
import videoIcon from "@public/svgs/videoIcon.svg";
import fileIcon from "@public/svgs/fileIcon.svg";

import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import moment from "moment";

export default function MediaOverlay({
  file,
  overlayTrigger,
  removeAttachment,
  isFromEditor,
  type,
}) {
  const { user } = useAuthUser();
  const {
    privacyPreferences: { display_full_name, display_profile_pic },
  } = user?.data
    ? user?.data
    : {
        privacyPreferences: {
          display_full_name: true,
          display_profile_pic: true,
        },
      };
  const truncate = (str) => {
    const actualChar = str?.length + str.split(" ").length - 1;
    return actualChar > 9 ? `${str?.substring(0, 9)}` : str;
  };
  const name = file?.attachementAuthorname?.split(" ");

  return (
    <OverlayTrigger
      key={file.id}
      trigger="click"
      placement="top"
      overlay={overlayTrigger(file)}
      rootClose
    >
      <Container key={file.id}>
        {isFromEditor && (
          <CloseIcon
            className="close-icon"
            color="#000"
            size={20}
            onClick={() => removeAttachment(file)}
          />
        )}
        <AttachmentCard>
          <div className="thumbnail">
            {type === "video" && (
              <AttachmentImage
                id="video_thumbnail"
                name="video_thumbnail"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = `${videoIcon.src}`;
                  currentTarget.className =
                    currentTarget.className + " fallback";
                }}
                src={`https://drive.google.com/thumbnail?id=${file.id}`}
                alt="video_thumbnail"
              />
            )}

            {type === "image" && (
              <AttachmentImage
                id="image-thumbnail"
                name="image-thumbnail"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = `${imageIcon.src}`;
                  currentTarget.className =
                    currentTarget.className + " fallback";
                }}
                src={`https://drive.google.com/uc?export=preview&confirm=1&id=${file.id}`}
              />
            )}
            {type === "audio" && (
              <AttachmentImage src={audioIcon.src} className="fallback" />
            )}
            {(type === "file" || type === "pdf" || type === "onedrive") && (
              <AttachmentImage src={fileIcon.src} className="fallback" />
            )}
          </div>
          <AttachmentAuthorDetails>
            <div className="attachment-details">
              <div className="name">
                {
                  <>
                    {name ? (
                      <>
                        {display_full_name ? (
                          <>
                            {truncate(String(name[0]))} .{" "}
                            {name[name.length - 1][0]}
                          </>
                        ) : (
                          `${type}`
                        )}
                      </>
                    ) : (
                      <>
                        {truncate(String(user?.data?.firstName))} .{" "}
                        {user?.data?.lastName[0]}
                      </>
                    )}
                  </>
                }
              </div>
              <div className="date">
                {moment(file?.attachementAddedDate).format("MMM DD, YYYY")}
              </div>
            </div>

            <div className="image">
              {file?.avtarUrl ? (
                <ProfileImage
                  src={
                    display_profile_pic
                      ? file.avtarUrl
                      : "/images/team-placeholder.png"
                  }
                />
              ) : (
                <ProfileImage src={user?.data?.avtarUrl} />
              )}
            </div>
          </AttachmentAuthorDetails>
        </AttachmentCard>
      </Container>
    </OverlayTrigger>
  );
}

const AttachmentCard = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  .thumbnail {
    flex-basis: 25%;
    align-items: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const AttachmentAuthorDetails = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  //padding: 5px;
  flex-basis: 75%;
  .attachment-details {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    flex-basis: 70%;
    font-family: "Manrope";
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 11px;
    color: #6c7374;
    padding: 5px;
    .name {
      font-family: "Manrope";
      font-style: normal;
      font-weight: 700;
      font-size: 12px;
      line-height: 13px;
      color: #393d3e;
      white-space: nowrap;
      overflow: hidden;
      max-width: 60px;
      text-overflow: ellipsis;
    }
    .date {
    }
  }
  .image {
    flex-basis: 30%;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
`;

const AttachmentImage = styled.img`
  object-fit: fill;
  width: 100%;
  height: 100%;
  &.fallback {
    width: 30px;
    height: 30px;
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 30px !important;
  height: 30px !important;
`;

const Container = styled.span`
  border: 0.5px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  width: 150px;
  height: 40px;
  cursor: pointer;
  margin: 4px 5px;
  position: relative;
  padding: 2px;
  .close-icon {
    display: none;
    position: absolute;
    right: -5px;
    top: -5px;
    cursor: pointer;
    z-index: 9;
    background: #fff;
    border-radius: 50%;
  }
  &:hover {
    z-index: 1 !important;
    border: 1px solid #000;
    .close-icon {
      display: block;
    }
  }
`;
