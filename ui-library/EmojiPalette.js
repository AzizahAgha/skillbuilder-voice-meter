import React, { useEffect, useRef } from "react";
import Tooltip from "@ui-library/Tooltip";
import styled from "styled-components";
import { AiOutlineCloseCircle } from "react-icons/ai";
import SmilePlusIcon from "@public/icons/SmilePlusIcon";
import { Button as BsButton } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import FlagIcon from "../public/icons/flag";
import FlaggingPopup from "@components/flaggingPopup";

const EmojiPalette = ({
  data,
  removeCurrentReaction,
  sendReaction,
  showReaction,
  setshowReaction,
  toggleShowReaction,
  enableActions = false,
  showFlaggingPopup,
  setShowFlaggingPopup,
  questionId,
  questionNumber,
}) => {
  const returnEmojiCode = (name) => {
    switch (name) {
      case "smileyFace":
        return <span className="d-block">&#128512;</span>;
      case "upVote":
        return <span className="d-block">&#128077;</span>;
      case "downVote":
        return <span className="d-block">&#128078;</span>;
      case "partyingFace":
        return <span className="d-block">&#129395;</span>;
      case "raisedHands":
        return <span className="d-block">&#128588;</span>;
    }
  };

  const displayReactionCount = (name) => {
    switch (name) {
      case "smileyFace":
        return data.reactionCount.smileyFace;
      case "upVote":
        return data.reactionCount.upVote;
      case "downVote":
        return data.reactionCount.downVote;
      case "partyingFace":
        return data.reactionCount.partyingFace;
      case "raisedHands":
        return data.reactionCount.raisedHands;
    }
  };

  const sendReactionName = (name) => {
    switch (name) {
      case "smileyFace":
        return 4;
      case "upVote":
        return 1;
      case "downVote":
        return 2;
      case "partyingFace":
        return 5;
      case "raisedHands":
        return 6;
    }
  };

  const SelectedReactionKeyword = (name) => {
    switch (name) {
      case "smileyFace":
        return data?.currentReaction?.isSmileyFace;
      case "upVote":
        return data?.currentReaction?.isUpVote;
      case "downVote":
        return data?.currentReaction?.isDownVote;
      case "partyingFace":
        return data?.currentReaction?.isPartyingFace;
      case "raisedHands":
        return data?.currentReaction?.isRaisedHands;
    }
  };

  const sendToolTipName = (name) => {
    switch (name) {
      case "smileyFace":
        return "smiley face";
      case "upVote":
        return "upvote";
      case "downVote":
        return "downvote";
      case "partyingFace":
        return "celebrate";
      case "raisedHands":
        return "hands raised ";
    }
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setshowReaction(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <FlexItemEmoji isTimelineView>
      <ReactionCount>
        <Tooltip text="upvote">
          <EmojiButton
            onClick={() => {
              data?.currentReaction?.isUpVote
                ? removeCurrentReaction(sendReactionName("upVote"))
                : sendReaction(sendReactionName("upVote"));
            }}
            selected={data?.currentReaction?.isUpVote}
          >
            {returnEmojiCode("upVote")}
          </EmojiButton>
        </Tooltip>
        <Count>{data?.reactionCount?.upVote}</Count>{" "}
        <Tooltip text="downvote">
          <EmojiButton
            onClick={() => {
              data?.currentReaction?.isDownVote
                ? removeCurrentReaction(sendReactionName("downVote"))
                : sendReaction(sendReactionName("downVote"));
            }}
            selected={data?.currentReaction?.isDownVote}
          >
            {returnEmojiCode("downVote")}
          </EmojiButton>
        </Tooltip>
        <Count>{data?.reactionCount?.downVote}</Count>{" "}
        <Tooltip text="hands raised">
          <EmojiButton
            onClick={() => {
              data?.currentReaction?.isRaisedHands
                ? removeCurrentReaction(sendReactionName("raisedHands"))
                : sendReaction(sendReactionName("raisedHands"));
            }}
            selected={data?.currentReaction?.isRaisedHands}
          >
            {returnEmojiCode("raisedHands")}
          </EmojiButton>
        </Tooltip>
        <Count>{data?.reactionCount?.raisedHands}</Count>
        {data?.SelectedReaction &&
          data?.SelectedReaction !== "upVote" &&
          data?.SelectedReaction !== "raisedHands" &&
          data?.SelectedReaction !== "downVote" && (
            <>
              <Tooltip text={sendToolTipName(data?.SelectedReaction)}>
                <EmojiButton
                  onClick={() => {
                    SelectedReactionKeyword(data?.SelectedReaction)
                      ? removeCurrentReaction(
                          sendReactionName(data?.SelectedReaction)
                        )
                      : sendReaction(sendReactionName(data?.SelectedReaction));
                  }}
                  selected={SelectedReactionKeyword(data?.SelectedReaction)}
                >
                  {returnEmojiCode(data?.SelectedReaction)}
                </EmojiButton>
              </Tooltip>
              <Count>{displayReactionCount(data?.SelectedReaction)}</Count>
            </>
          )}
      </ReactionCount>

      <Actions>
        <Tooltip text="Add Reaction">
          <span className="mx-2">
            <ButtonAddEmoji variant="default" onClick={toggleShowReaction}>
              <SmilePlusIcon width={20} height={20} />
            </ButtonAddEmoji>

            <StyledToast
              show={showReaction}
              onClose={toggleShowReaction}
              autohide
              ref={wrapperRef}
            >
              <StyledToastBody>
                <Tooltip text="upvote">
                  <EmojiButton
                    onClick={() => {
                      data?.currentReaction?.isUpVote
                        ? removeCurrentReaction(sendReactionName("upVote"))
                        : sendReaction(sendReactionName("upVote"));
                    }}
                    selected={data?.currentReaction?.isUpVote}
                  >
                    {returnEmojiCode("upVote")}
                  </EmojiButton>
                </Tooltip>

                <Tooltip text="downvote">
                  <EmojiButton
                    onClick={() => {
                      data?.currentReaction?.isDownVote
                        ? removeCurrentReaction(sendReactionName("downVote"))
                        : sendReaction(sendReactionName("downVote"));
                    }}
                    selected={data?.currentReaction?.isDownVote}
                  >
                    {returnEmojiCode("downVote")}
                  </EmojiButton>
                </Tooltip>
                <Tooltip text="smiley face">
                  <EmojiButton
                    onClick={() => {
                      data?.currentReaction?.isSmileyFace
                        ? removeCurrentReaction(sendReactionName("smileyFace"))
                        : sendReaction(sendReactionName("smileyFace"));
                    }}
                    selected={data?.currentReaction?.isSmileyFace}
                  >
                    {returnEmojiCode("smileyFace")}
                  </EmojiButton>
                </Tooltip>
                <Tooltip text="celebrate">
                  <EmojiButton
                    onClick={() => {
                      data?.currentReaction?.isPartyingFace
                        ? removeCurrentReaction(
                            sendReactionName("partyingFace")
                          )
                        : sendReaction(sendReactionName("partyingFace"));
                    }}
                    selected={data?.currentReaction?.isPartyingFace}
                  >
                    {returnEmojiCode("partyingFace")}
                  </EmojiButton>
                </Tooltip>
                <Tooltip text="hands raised">
                  <EmojiButton
                    onClick={() => {
                      data?.currentReaction?.isRaisedHands
                        ? removeCurrentReaction(sendReactionName("raisedHands"))
                        : sendReaction(sendReactionName("raisedHands"));
                    }}
                    selected={data?.currentReaction?.isRaisedHands}
                  >
                    {returnEmojiCode("raisedHands")}
                  </EmojiButton>
                </Tooltip>

                <span className="mx-2"></span>
                <Tooltip text="close">
                  <span>
                    <AiOutlineCloseCircle
                      color="red"
                      size={16}
                      onClick={() => setshowReaction(false)}
                    />
                  </span>
                </Tooltip>
              </StyledToastBody>
            </StyledToast>
          </span>
        </Tooltip>
        {enableActions && (
          <>
            <Tooltip text="Flag">
              <Button
                variant="default"
                onClick={() => setShowFlaggingPopup(true)}
              >
                <FlagIcon height={20} />
                <Count>{data?.flags}</Count>
              </Button>
            </Tooltip>
            <FlaggingPopup
              questionNumber={questionNumber}
              isMergeRequested={data?.is_merge_requested}
              show={showFlaggingPopup}
              handleClose={() => setShowFlaggingPopup(false)}
              answerId={data?.id}
              questionId={questionId}
              onMutate={() => {
                data.flags++;
                data.isFlagged = true;
              }}
              isFlagged={data?.isFlagged}
            />
            <Views>{data?.views} Views</Views>{" "}
          </>
        )}
      </Actions>
    </FlexItemEmoji>
  );
};

export default EmojiPalette;

const FlexItemEmoji = styled.div`
  &&& {
    display: flex;
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;
    justify-content: flex-end;
  }
`;
const ReactionCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const EmojiButton = styled.button`
  &&& {
    background-color: ${(props) =>
      props.selected ? "#81c2c0" : "Transparent"};
    background-repeat: no-repeat;
    border: none;
    border-radius: ${(props) => (props.selected ? "40%" : "")};
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      text-align: center;
      width: 100%;
    }
    &: hover {
      cursor: pointer;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ButtonAddEmoji = styled(BsButton)`
  &&& {
    display: flex;
  }
`;

const Count = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 17px;
  color: #cecece;
  margin-left: 5px;
  margin-right: 5px;
`;

const StyledToast = styled(Toast)`
  &&& {
    z-index: 1100;
    position: absolute;
    right: 0px;
    background-color: rgba(255, 255, 255, 1);
    width: auto;
    border-radius: 25px;
    @media (max-width: 1200px) {
      max-width: 150%;
    }
    @media (max-width: 491px) {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const StyledToastBody = styled(Toast.Body)`
  &&& {
    display: flex;
    align-items: center;
    //width: 100%;
  }
`;

const Button = styled(BsButton)`
  &&& {
    display: flex;

    svg > path {
      fill: #cecece;
    }
  }
`;

const Views = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 17px;
  text-align: right;
  color: #81c2c0;
`;
