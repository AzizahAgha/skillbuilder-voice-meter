import React, { useState, useRef } from "react";
import Priority, {
  BadgeType,
  Rules as PriorityRiskRules,
} from "@ui-library/Priority";
import styled from "styled-components";
import Labels from "./Labels";
import Highlighter from "react-highlight-words";
import { getImportanceLabel } from "@utils/helpers";
import { useRouter } from "next/router";
import { Button as BsButton } from "react-bootstrap";
import { useAuthUser } from "@contexts/AuthContext";
import questionService from "@services/question.service";
import { useMutation, useQueryClient } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import Author from "@ui-library/Author";
import { MdOutlineOpenInNew } from "react-icons/md";
import Tooltip from "@ui-library/Tooltip";
import AddQuestionPopup from "@components/dataTables/AddQuestionPopup";
import { FiCopy } from "react-icons/fi";
import MergedHistoryPopup from "@components/questionMerge/MergedHistoryPopup";
import Bus from "@utils/Bus";
import { GiBinoculars as WatchIcon } from "react-icons/gi";
import QWatchPopup from "@components/watchQuestion/watchPopup";
import { useEffect } from "react";

const OptimizedQuestionComponent = ({
  id,
  frequency,
  importance,
  value,
  labels = [],
  author,
  createdAt,
  showFactors = false,
  searchKeyword,
  clickable = false,
  filters,
  refetchData,
  isCardView = false,
  mergeId,
  watchCount,
}) => {
  const [labelList, setLabelList] = useState(labels);
  const router = useRouter();
  const { team } = useTeam();
  const { auth } = useAuthUser();
  const editBtnRef = useRef();
  const queryClient = useQueryClient();

  const EditButton = () => (
    <BsButton className="d-none" ref={editBtnRef}></BsButton>
  );
  const [showQWatchPopup, setshowQWatchPopup] = useState(false);
  const [qSearchKeyword, setqSearchKeyword] = useState(searchKeyword);
  const [qFrequency, setqFrequency] = useState(frequency);
  const [qImportance, setqImportance] = useState(importance);
  const [characterlen, setCharacterlen] = useState(value.length);
  const [showLen, setShowLen] = useState(false);
  const mutation = useMutation(
    ({ teamId, data }) => questionService.update(teamId, data),
    {
      onSuccess: (res) => {
        const { frequency, importance, priority, questionText, questionId } =
          res.data?.[0] ?? {};

        queryClient.setQueryData(
          [
            "questionnaire-infinite",
            { teamId: team?.id, filters, searchString: searchKeyword },
          ],
          (old) => ({
            ...old,
            pages:
              old?.pages?.map((page) => ({
                ...page,
                data: page.data?.map((q) =>
                  q.id === questionId
                    ? { ...q, frequency, importance, priority, questionText }
                    : q
                ),
              })) ?? old?.pages,
          })
        );

        queryClient.setQueryData(
          ["favourite-infinite", { teamId: team?.id }],
          (old) => ({
            ...old,
            pages:
              old?.pages?.map((page) => ({
                ...page,
                data: page.data?.map((q) =>
                  q.id === questionId
                    ? { ...q, frequency, importance, priority, questionText }
                    : q
                ),
              })) ?? old?.pages,
          })
        );

        queryClient.setQueryData(
          ["question", { teamId: team?.id, questionId: router.query.id }],
          (old) => ({
            ...old,
            data:
              old?.data?.questionId === questionId
                ? {
                    ...old?.data,
                    frequency,
                    importance,
                    priority,
                    questionText,
                  }
                : old?.data?.questionId,
          })
        );
        refetchData && refetchData();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const saveQuestionContent = (id) => {
    const content = document.getElementById("editText_" + id).innerText;
    document
      .getElementById("editText_" + id)
      .setAttribute("contenteditable", false);
    if (
      content.length <= 1000 &&
      content.length > 0 &&
      content.replace(/\s/g, "").length &&
      content != value
    ) {
      mutation
        .mutateAsync({
          teamId: team.id,
          data: {
            questions: [
              {
                questionId: id,
                questionText: content,
                frequency: qFrequency,
                importance: Number(qImportance),
                priority: PriorityRiskRules.Q[qFrequency][qImportance].label,
              },
            ],
          },
        })
        .then(() => {
          if (searchKeyword) setqSearchKeyword(searchKeyword);
          refetchData && refetchData();
          setShowLen(false);
          document.getElementById("editText_" + id).focus();
          document.getElementById("editText_" + id).blur();
          window.getSelection().removeAllRanges();
        });
    } else {
      if (content.length < 0 || !content.replace(/\s/g, "").length) {
        document.getElementById("editText_" + id).innerText = value;
      }
      setShowLen(false);
    }
  };

  const setChar = (id) => {
    setShowLen(true);
    const content = document.getElementById("editText_" + id).innerText;
    let strlength = content.length;
    if (!content.replace(/\s/g, "").length) {
      strlength = 0;
    }
    setCharacterlen(strlength);
  };

  const limitChar = (id, event) => {
    const content = document.getElementById("editText_" + id).innerText;
    let strlength = content.length + 1;
    if (event.keyCode == 13) {
      event.stopPropagation();
      event.preventDefault();
      document.execCommand("insertHTML", false, "<br>");
    }
    if (strlength > 1000 && event.keyCode != 8 && event.keyCode != 46) {
      event.preventDefault();
    }
  };

  const makeContentEditable = (id) => {
    document
      .getElementById("editText_" + id)
      .setAttribute("contenteditable", true);
    document.getElementById("editText_" + id).focus();
    setChar(id);
  };
  const [showMergedHistoryPopup, setShowMergedHistoryPopup] = useState(false);

  useEffect(() => {
    setLabelList(labels);
  }, [labels]);

  return (
    <Container>
      <Row className="h-100" clickable={clickable} showFactors={showFactors}>
        <div className="d-flex align-items-center justify-content-between">
          <Priority
            type={BadgeType.Question}
            frequency={frequency}
            importance={importance}
            filled={true}
            showShowFullLabel
            showInfoPopUp={true}
          />
          <QWatchPopup
            show={showQWatchPopup}
            setShow={setshowQWatchPopup}
            teamId={team?.id}
            questionId={id}
            refetchData={refetchData}
          />
          <ContainerWatchViewDiv>
            {watchCount > 0 && (
              <WatchDiv
                className="mx-2"
                onClick={() => setshowQWatchPopup(true)}
              >
                <span className="mx-1 watch-icon">
                  <WatchIcon size={18} color="#FFFFFF" />
                </span>

                <span className="mx-1 watch-count">{watchCount}</span>
              </WatchDiv>
            )}

            {mergeId && (
              <>
                <MergedHistoryPopup
                  show={showMergedHistoryPopup}
                  setShow={setShowMergedHistoryPopup}
                  teamId={team?.id}
                  mergeId={mergeId}
                  mergeType="Question"
                />

                <ViewDetails
                  isCardView={isCardView}
                  onClick={() => {
                    setShowMergedHistoryPopup(true);
                  }}
                >
                  <FiCopy color="#969C9D" size={15} />
                  <span> Merged</span>
                </ViewDetails>
              </>
            )}
          </ContainerWatchViewDiv>

          {!isCardView && (
            <Tooltip text="View Details">
              <ViewDetails
                onClick={() => {
                  router.push(`/question/${id}?view=timeline`);
                }}
              >
                <MdOutlineOpenInNew color="#969C9D" size={20} />
              </ViewDetails>
            </Tooltip>
          )}

          {showFactors && (
            <>
              <Tag>
                <strong>Frequency: </strong> {frequency}
              </Tag>
              <Tag>
                <strong>Importance:</strong>{" "}
                {getImportanceLabel(importance).split(" ")[0]}
              </Tag>
            </>
          )}
        </div>

        <AddQuestionPopup
          title={"Edit this question"}
          handleSubmit={async (values) => {
            await mutation.mutateAsync({
              teamId: team.id,
              data: {
                questions: [
                  {
                    questionId: id,
                    questionText: values.question,
                    frequency: values.frequency,
                    importance: Number(values.importance),
                    priority:
                      PriorityRiskRules.Q[values.frequency][values.importance]
                        .label,
                  },
                ],
              },
            });
          }}
          CustomButton={EditButton}
          question={{ question: value, frequency, importance }}
          buttonText={"Done"}
        />

        {auth?.user?.id === author.id ? (
          <>
            {!showFactors && !clickable && (
              <>
                <EditText
                  isCardView={isCardView}
                  key={`editTextKey_${id}`}
                  id={`editText_${id}`}
                  onClick={() => {
                    makeContentEditable(id);
                  }}
                  onFocus={() => {
                    setShowLen(true);
                    setqSearchKeyword("");
                  }}
                  onInput={() => setChar(id)}
                  onKeyDownCapture={(event) => limitChar(id, event)}
                  onBlur={() => saveQuestionContent(id)}
                >
                  <Highlighter
                    highlightClassName="highlight"
                    searchWords={[qSearchKeyword]}
                    autoEscape={true}
                    textToHighlight={value}
                  />
                </EditText>
                <CharLen id={`charLen_${id}`} className={!showLen && "d-none"}>
                  {characterlen}/1000
                </CharLen>
              </>
            )}

            {showFactors && (
              <>
                <Text
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (auth.user.id === author.id) {
                      editBtnRef.current.click();
                    } else {
                      clickable && router.push(`/question/${id}?view=timeline`);
                    }
                  }}
                >
                  <Highlighter
                    highlightClassName="highlight"
                    searchWords={[qSearchKeyword]}
                    autoEscape={true}
                    textToHighlight={value}
                  />
                </Text>
              </>
            )}
            {!showFactors && clickable && (
              <>
                <Text
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (auth.user.id === author.id) {
                      editBtnRef.current.click();
                    } else {
                      clickable && router.push(`/question/${id}?view=timeline`);
                    }
                  }}
                >
                  <Highlighter
                    highlightClassName="highlight"
                    searchWords={[qSearchKeyword]}
                    autoEscape={true}
                    textToHighlight={value}
                  />
                </Text>
              </>
            )}
          </>
        ) : (
          <Text>
            <Highlighter
              highlightClassName="highlight"
              searchWords={[qSearchKeyword]}
              autoEscape={true}
              textToHighlight={value}
            />
          </Text>
        )}
      </Row>
      <Blankdiv />
      <Row>
        <Author author={author} createdAt={createdAt} />
        <Blankdiv />
        <Labels
          labels={labelList}
          questionId={id}
          type="question"
          filters={filters}
          searchKeyword={searchKeyword}
          // refetchLabels={refetchLabels}
          refetchData={refetchData}
          setLabelList={setLabelList}
        />
      </Row>
    </Container>
  );
};

export default OptimizedQuestionComponent;

const ContainerWatchViewDiv = styled.div`
  &&& {
    display: flex;
    margin-top: ${(props) => (props.isCardView ? "-30px" : "")};
  }
`;

const WatchDiv = styled.div`
  background-color: #81c2c0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  color: #fff;
  border-radius: 2px;
  cursor: pointer;
  padding: 1px 2px 2px;
  .watch-icon {
    display: flex;
  }
  .watch-count {
    word-wrap: break-word;
    font-family: Barlow Condensed, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    user-select: none;
    box-sizing: border-box;
    white-space: nowrap;
  }
`;

const ViewDetails = styled.div`
  cursor: pointer;
  color: #969c9d;

  font-size: 14px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-width: 250px;
  height: 100%;
`;

const Text = styled.div`
  &&& {
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    color: #393d3e;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    height: 100%;
    word-wrap: anywhere;
    max-height: 200px;
    overflow: auto;
    min-height: 40px;
    white-space: pre-wrap;
    .highlight {
      background-color: #fde87b;
    }
  }
`;

const EditText = styled.div`
  padding: 6px;
  display: inline-block;
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #393d3e;
  word-wrap: anywhere;
  max-height: 200px;
  max-width: ${(props) => (props.isCardView ? "auto" : "365px")};
  overflow-y: auto;
  position: relative;
  white-space: pre-wrap;
  cursor: text;
  span {
    font-size: 16px;
  }
  .highlight {
    background-color: #fde87b;
  }
  &:hover {
    background-color: rgba(217, 217, 217, 0.4);
  }
  &[contenteditable]:focus {
    outline: 0px solid transparent;
    background-color: rgba(217, 217, 217, 0.4);
  }
`;
const CharLen = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  color: #bfbfbf;
  text-align: right;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Tag = styled.div`
  margin-left: 20px;
  color: #1f5462;
  font-size: 0.9rem;

  & span {
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;

    & strong {
      font-weight: bold;
    }
  }
`;
const Blankdiv = styled.div`
  height: 10px;
`;
