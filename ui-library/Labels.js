import React, { useState, useMemo } from "react";
import styled from "styled-components";
import add from "@public/svgs/add.svg";
import { useTeam } from "@contexts/TeamContext";
import labelService from "@services/label.service";
import { useMutation } from "react-query";
import { InputGroup } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Tooltip from "@ui-library/Tooltip";
import { IoIosClose } from "react-icons/io";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";

export default function Labels({
  setAnswers,
  setLabelList,
  counter,
  type,
  questionId,
  answerId,
  labels = [], // labels array for the question or answer
  searchKeyword,
  showAddLabel = true,
}) {
  const { team } = useTeam();
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");
  const id = answerId || questionId;

  const mutationDelete = useMutation(({ id, teamId, label }) =>
    labelService.delete({ id, teamId, label, type })
  );

  const mutation = useMutation(({ id, teamId, text }) =>
    labelService.create({ id, teamId, text, type })
  );

  const addLabel = () => {
    if (text.trim()) {
      let _labels = labels.map((label) => label.toLowerCase());
      if (_labels.includes(text.toLowerCase())) {
        setShowInput(false);
        setText("");
        return;
      }
      mutation.mutateAsync({ teamId: team.id, id, text }).then(() => {
        type === "answer" &&
          setAnswers((old) => {
            let copyAnswers = [...old];
            let answer = old[counter - 1];
            answer.labels = [...old[counter - 1].labels, text];
            const i = copyAnswers.findIndex(
              (x) => x.answerId === answer.answerId
            );
            copyAnswers[i] = answer;
            return copyAnswers;
          });

        setShowInput(false);
        setText("");
      });

      type === "question" &&
        setLabelList((old) => {
          return [...old, text];
        });
    }
  };

  return (
    <Wrapper className="labelsWrap">
      {/* {console.log("labels", labels)} */}
      {labels &&
        labels.map((label, idx) => (
          <span key={idx}>
            <Label>
              {showAddLabel && (
                <Tooltip text="Delete Label">
                  <span>
                    <IoIosClose
                      size={18}
                      className="close-icon"
                      color="red"
                      onClick={() => {
                        mutationDelete
                          .mutateAsync({
                            teamId: team.id,
                            id,
                            label,
                          })
                          .then(() => {
                            type === "answer" &&
                              setAnswers((old) => {
                                let copyAnswers = [...old];
                                let answer = old[counter - 1];
                                answer.labels = old[counter - 1].labels.filter(
                                  (e) => e !== label
                                );
                                const i = copyAnswers.findIndex(
                                  (x) => x.answerId === answer.answerId
                                );
                                copyAnswers[i] = answer;
                                return copyAnswers;
                              });
                          });

                        type === "question" &&
                          setLabelList((old) => {
                            return old.filter((e) => e !== label);
                          });
                      }}
                    />
                  </span>
                </Tooltip>
              )}
              <Highlighter
                highlightClassName="highlight"
                searchWords={[searchKeyword]}
                autoEscape={true}
                textToHighlight={label}
              />
            </Label>
          </span>
        ))}
      {showAddLabel && (
        <InputGroup className={`mt-1 d-${showInput ? "block" : "inline"}`}>
          {showInput && (
            <Input
              placeholder="Type Label Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={50}
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addLabel();
                }
              }}
            />
          )}

          <Tooltip text="Add Label">
            <Button
              key={"add_label_" + id}
              onClick={(e) => {
                if (!showInput) setShowInput(true);
                else addLabel();
              }}
            >
              <img src={add.src} alt="add" />
            </Button>
          </Tooltip>

          {showInput && (
            <Tooltip text="Cancel">
              <Button
                onClick={() => {
                  setShowInput(false);
                  setText("");
                }}
              >
                <FaTimes color="#C10840" size={12} />
              </Button>
            </Tooltip>
          )}
        </InputGroup>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Input = styled.input`
  &&& {
    border: none;
    background: #e0f4f488;
    border-radius: 5px;
    padding: 3px 6px;
    display: inline-block;
    margin-right: 4px;
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: #1f5462;
    min-width: 100px;
  }
`;

const Label = styled.span`
  background: #e0f4f488;
  border-radius: 5px;
  padding: 3px 6px;
  display: inline-block;
  margin-right: 4px;
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #1f5462;

  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  vertical-align: bottom;
  margin-bottom: 5px;

  .close-icon {
    visibility: hidden;
  }

  &:hover {
    .close-icon {
      visibility: visible;

      cursor: pointer;
      transition: 0.5s ease;
    }
  }
`;

const Button = styled.button`
  &&& {
    border: none;
    background: #e0f4f488;
    border-radius: 5px;
    padding: 3px 6px;
    display: inline-block;
    margin-right: 4px;
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: #1f5462;
    margin-bottom: 5px;
  }
`;
