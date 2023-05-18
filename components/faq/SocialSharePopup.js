import React, { useState, useEffect } from "react";
import { Modal as BSModal, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Tooltip from "ui-library/Tooltip";
import Button from "@ui-library/Button";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import FacebookIcon from "@public/svgs/facebookLogo.svg";
import LinkedInIcon from "@public/svgs/linkedInLogo.svg";
import EmailIcon from "@public/svgs/emailLogo.svg";
import EmbedIcon from "@public/svgs/embedLogo.svg";
import TwitterIcon from "@public/svgs/twitterLogo.svg";
import { useMutation } from "react-query";
import flashcardService from "@services/flashcard.service";
import Toast from "react-bootstrap/Toast";
import InfoPopup from "@ui-library/InfoPopup";

export default function SocialSharePopup({
  showSocialSharePopup,
  setShowSocialSharePopup,
  data,
  flashId,
  teamId,
}) {
  const shareUrl = data?.faqUrl;
  const truncate = (str, limit) => {
    const actualChar = str?.length + str.split(" ").length - 1;
    return actualChar > limit ? `${str?.substring(0, limit - 3)}...` : str;
  };
  const privacyMutation = useMutation(({ privacy }) =>
    flashcardService.faqAccess({
      flashId: flashId,
      teamId: teamId,
      privacy: privacy,
    })
  );

  const [showEmbedLink, setShowEmbedLink] = useState(false);
  const [privacy, setPrivacy] = useState(data?.faqAccess);
  const [show, setShow] = useState(false);

  useEffect(() => {
    showSocialSharePopup && privacyMutation.mutate({ privacy: privacy });
  }, [privacy]);

  return (
    <Modal
      className="bs"
      show={showSocialSharePopup}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container fluid>
        <Row>
          <Col>
            <Card>
              {data?.isFavorite && data?.setTitle.includes("Favorites") ? (
                <Header>
                  {truncate(String(`${data?.setTitle}-${data?.createdBy}`), 30)}
                </Header>
              ) : (
                <Header>{truncate(String(data?.setTitle), 31)}</Header>
              )}
              <Tooltip text="Close" placement="left">
                <CloseButton
                  type="button"
                  onClick={() => {
                    setShowSocialSharePopup(false);
                  }}
                >
                  <CloseIcon size={30} color="#969C9D" />
                </CloseButton>
              </Tooltip>
              <ShareButtonContainer>
                <SocialButtonTextContainer>
                  <Image
                    onClick={() => {
                      setShowEmbedLink(!showEmbedLink);
                    }}
                    src={EmbedIcon.src}
                    alt="embed share button"
                    height="48px"
                    width="48px"
                  />
                  <StyledText>Embed</StyledText>
                </SocialButtonTextContainer>

                <SocialButtonTextContainer>
                  <LinkedinShareButton url={shareUrl}>
                    <Image
                      src={LinkedInIcon.src}
                      alt="linkedIn share button"
                      height="48px"
                      width="48px"
                    />
                  </LinkedinShareButton>
                  <StyledText>LinkedIn</StyledText>
                </SocialButtonTextContainer>

                <SocialButtonTextContainer>
                  <FacebookShareButton url={shareUrl}>
                    <Image
                      src={FacebookIcon.src}
                      alt="facebook share button"
                      height="48px"
                      width="48px"
                    />
                  </FacebookShareButton>
                  <StyledText>Facebook</StyledText>
                </SocialButtonTextContainer>

                <SocialButtonTextContainer>
                  <TwitterShareButton url={shareUrl}>
                    <Image
                      src={TwitterIcon.src}
                      alt="twitter share button"
                      height="48px"
                      width="48px"
                    />
                  </TwitterShareButton>
                  <StyledText>Twitter</StyledText>
                </SocialButtonTextContainer>

                <SocialButtonTextContainer>
                  <EmailShareButton url={shareUrl}>
                    <Image
                      src={EmailIcon.src}
                      alt="email share button"
                      height="48px"
                      width="48px"
                    />
                  </EmailShareButton>
                  <StyledText>Email</StyledText>
                </SocialButtonTextContainer>
              </ShareButtonContainer>
              <LinkCopyContainer>
                <StyledDiv> {shareUrl}</StyledDiv>
                <StyledToast
                  onClose={() => setShow(false)}
                  show={show}
                  delay={3000}
                  autohide
                >
                  <Toast.Body>Copied to Clipboard!</Toast.Body>
                </StyledToast>
                <StyledButton
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setShow(true);
                  }}
                >
                  Copy
                </StyledButton>
              </LinkCopyContainer>

              <PrivacyWrapper>
                <DetailsInfo_items>
                  Privacy Settings{" "}
                  <InfoPopup
                    title=""
                    text={
                      "Public URL visible to all , Private URL requires User login"
                    }
                  />
                </DetailsInfo_items>
                <DetailsInfo_items_wrapper>
                  <Flex_items $isBold={!privacy}>Public </Flex_items>
                  <Flex_items>
                    <InputWrapper>
                      <Toggle
                        type="checkbox"
                        name="fullName"
                        checked={privacy}
                        onChange={(e) => setPrivacy(e.target.checked)}
                      />
                      <Slider />
                    </InputWrapper>
                  </Flex_items>
                  <Flex_items $isBold={privacy}> Private</Flex_items>
                </DetailsInfo_items_wrapper>
              </PrivacyWrapper>
              {showEmbedLink && (
                <>
                  <EmbedLinkText>Embed Link -</EmbedLinkText>
                  <StyledTextArea>{`<iframe width="560" height="315" src="${shareUrl}" title="FAQ Page" frameborder="0"></iframe>`}</StyledTextArea>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

const PrivacyWrapper = styled.div`
  width: 50%;
  margin: auto;
  padding-top: 20px;
`;

const DetailsInfo_items = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 47px;
  letter-spacing: 0.02em;
  color: #393d3e;
  text-align: center;
`;

const DetailsInfo_items_wrapper = styled.div`
  display: flex;
  word-wrap: no-wrap;
  justify-content: space-around;
`;

const Flex_items = styled.span`
  align-self: center;
  font-family: Manrope;
  font-style: normal;
  font-weight: ${(props) => (props.$isBold ? "bold" : "normal")};
  font-size: 14px;
  line-height: 19px;
  color: #393d3e;
`;

const Toggle = styled.input`
  position: absolute;
  appearance: none;
  display: none;
  visibility: hidden;
  &:checked + span {
    background-color: #003647;

    &:before {
      left: calc(100% - 2px);
      transform: translateX(-100%);
    }
  }

  &:focus + span {
    box-shadow: 0 0 0 2px rgba(129, 194, 192, 1);
  }

  &:focus:checked + span {
    box-shadow: 0 0 0 2px rgba(129, 194, 192, 1);
  }
`;

const InputWrapper = styled.label`
  position: relative;
`;

const Slider = styled.span`
  display: flex;
  cursor: pointer;
  width: 40px;
  height: 25px;
  border-radius: 100px;
  background-color: #ececec;
  position: relative;
  transition: background-color 0.2s box-shadow 0.2s;

  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 21px;
    height: 21px;
    border-radius: 21px;
    transition: 0.2s;
    background: #81c2c0;
    box-shadow: 0 2px 4px 0 rgba(0, 35, 11, 0.2);
  }
`;

const Image = styled.img`
  cursor: pointer;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;
const Modal = styled(BSModal)`
  &&& {
    z-index: 2000;
    .modal-content {
      background: none;
      border: none;
      display: flex;
      justify-content: center;
    }
  }
`;

const LinkCopyContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
`;

const SocialButtonTextContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  min-width: 80px !important;
  height: 40px !important;
`;

const StyledText = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #393d3e;
`;

const ShareButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const StyledDiv = styled.div`
  background: #f5f5f5;
  border-radius: 5px;
  min-height: 30px;
  display: flex;
  padding-left: 10px;
  justify-content: flex-start;
  align-items: center;
  width: 70%;
`;

const StyledTextArea = styled.textarea`
  background: #f5f5f5;
  border-radius: 5px;
  display: flex;
  padding-left: 10px;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px !important;
  line-height: unset;
  border: none;
  resize: none !important;
  min-height: 80px;
`;

const Card = styled.div`
  margin: auto;
  background: #ffffff;
  // min-width: 600px;
  border: 1px solid #81c2c0;
  box-sizing: border-box;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1.2rem;
  overflow: auto;
  position: relative;
  max-height: fit-content;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 4px;
  top: 6px;
`;

const Header = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  display: flex;
  align-items: flex-start;
  text-align: center;
  flex-direction: column;
  color: #003647;

  h1 {
    font-weight: 600;
    font-size: 28px;
  }

  h2 {
    margin-bottom: 0;
  }

  p {
    font-family: Manrope;
    font-weight: 400;
    font-size: 1rem;
  }
`;

const EmbedLinkText = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
  display: flex;
  align-items: flex-start;
  text-align: center;
  flex-direction: column;
  color: #003647;
  margin-top: 20px !important;
`;

const StyledToast = styled(Toast)`
  &&& {
    display: inline-flex;
    z-index: 5100;
    position: absolute;
    opacity: 1;
    background-color: transparent;
    padding-top: 35px;
    padding-right: 55px;
    justify-content: flex-end;
    box-shadow: none;
    border: none;
  }
  .toast-body {
    background-color: #8ed0ce;
    align-self: flex-end;
    color: #ffffff;
    padding: 0.2rem;
  }
`;
