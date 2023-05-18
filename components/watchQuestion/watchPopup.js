import React, { useState } from "react";
import styled from "styled-components";
import {
  Card as BsCard,
  Button as BsButton,
  Modal,
  Spinner,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import { useTeam } from "@contexts/TeamContext";
import { useRouter } from "next/router";
import Bus from "@utils/Bus";
import { GiBinoculars as WatchIcon } from "react-icons/gi";
import { useMutation, useQuery } from "react-query";
import watchService from "@services/watch.service";
import { useAuthUser } from "@contexts/AuthContext";
import { DebounceInput } from "react-debounce-input";
import Tooltip from "@ui-library/Tooltip";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function QWatchPopup({
  show = false,
  setShow,
  questionId,
  refetchData,
}) {
  const { team } = useTeam();
  const router = useRouter();
  const [isUserWatcher, setIsUserWatcher] = useState(null);
  const { auth } = useAuthUser();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [watchCount, setWatchCount] = useState(null);

  const addWatchMutation = useMutation(({ data, teamId, questionId }) =>
    watchService.update(teamId, questionId, data)
  );
  const { data: watchersList, refetch: refetchWathersList } = useQuery(
    "watchersList",
    () => watchService.getUsers({ teamId: team?.id, questionId: questionId }),
    {
      enabled: show === true,
      onSuccess: (res) => {
        setWatchCount(res.data.length);
        if (
          res.data
            .map((e) => {
              return e.userId;
            })
            .includes(auth?.user?.id)
        ) {
          setIsUserWatcher(true);
        } else {
          setIsUserWatcher(false);
        }
      },
    }
  );

  // const { data: watchUsers, refetch: refetchWatchUsers } = useQuery(
  //   ["watch-users", searchKeyword, team?.id],
  //   () => watchService.watchUsers(team?.id, searchKeyword)
  // );

  const toggleWatch = (flag) => {
    if (flag === true) {
      addWatchMutation
        .mutateAsync({
          data: {
            isWatch: true,
          },
          teamId: team?.id,
          questionId: questionId,
        })
        .then(() => {
          refetchWathersList();
        });
    } else if (flag === false) {
      addWatchMutation
        .mutateAsync({
          data: {
            isWatch: false,
          },
          teamId: team?.id,
          questionId: questionId,
        })
        .then(() => {
          refetchWathersList();
        });
    }
  };

  return (
    <Modal
      className="bs"
      size="sm"
      centered
      backdrop="static"
      keyboard={false}
      show={show}
      onHide={() => setShow(false)}
    >
      <Modal.Body className="p-0">
        <Card>
          <Card.Body>
            <CloseButton
              onClick={() => {
                setShow(false);
                refetchData && refetchData();
              }}
            >
              <CloseIcon size={24} color="#969C9D" />
            </CloseButton>
            <Card.Title>
              {isUserWatcher === true ? (
                <Button
                  backgroundColor="#EBEBEB"
                  textColor="#1F5462"
                  onClick={() => toggleWatch(false)}
                >
                  <WatchIcon size={24} color="#1F5462" /> Stop Watching
                </Button>
              ) : (
                <Button
                  backgroundColor="#81C2C0"
                  textColor="#FFFFFF"
                  onClick={() => toggleWatch(true)}
                >
                  <WatchIcon size={24} color="#FFFFFF" /> Start Watching
                </Button>
              )}
            </Card.Title>
            <StyledHr />
            {/* <AddWatchers> + Add Watchers</AddWatchers>
            <StyledInputGroup>
              <Input
                type="search"
                minLength={2}
                debounceTimeout={300}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="   + Add Watchers"
                className="form-control"
              />

              {searchKeyword && (
                <Tooltip text="Clear" placement="right">
                  <ClearButton
                    variant="default"
                    onClick={() => setSearchKeyword("")}
                  >
                    <IoIosCloseCircleOutline color="#969C9D" size={20} />
                  </ClearButton>
                </Tooltip>
              )}
            </StyledInputGroup>
            <StyledHr /> */}
            <CountText>Currently Watching ({watchCount})</CountText>
            <div>
              {watchersList?.data?.map((watcher) => (
                <UserCard key={watcher.userId}>
                  <Row>
                    <StyledCol1 className="col-2">
                      <ProfileImage
                        id="watcher_image"
                        name="watcher_image"
                        src={
                          watcher.avtarUrl
                            ? watcher.avtarUrl
                            : "/images/default-user-avatar.jpg"
                        }
                        alt="watcher_image"
                      />
                    </StyledCol1>

                    <StyledCol className="col-10">
                      <Details>
                        <Name>{watcher.authorName}</Name>
                        {watcher.department && (
                          <Department>
                            <span className="dept " style={{ color: "#000" }}>
                              {watcher.department ? watcher.department : ""}
                            </span>
                          </Department>
                        )}
                      </Details>
                    </StyledCol>
                  </Row>
                </UserCard>
              ))}
            </div>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Card>
      </Modal.Body>
    </Modal>
  );
}

const AddWatchers = styled.div`
  &&& {
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    color: #1f5462;
    margin: 0.5rem;
  }
`;

const StyledInputGroup = styled(InputGroup)`
  &&& {
    width: 90%;
    margin-left: 0.5rem;
    color: #003647;
    font-family: "Barlow Condensed", sans-serif;
    border: 0.5px solid #003647;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    .input-group-text {
      background: #fff;
      border: none;
      padding: 0.375rem 0.5rem;
    }
  }
`;

const Input = styled(DebounceInput)`
  &&& {
    border: none;
    padding-left: 0;
  }
`;

const StyledCol = styled(Col)`
  &&& {
    padding: 0px;
  }
`;

const StyledCol1 = styled(Col)`
  &&& {
    padding: 0px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 26px;
  height: 26px;
  border: 0.5px solid #9a9b9c;
  align-self: center;
`;

const StyledHr = styled.hr`
  &&& {
    margin: 0 -2rem;
    opcaity: 0;
    background-color: #c4c4c4;
  }
`;

const Card = styled(BsCard)`
  &&& {
    background: #ffffff;
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 1rem;
    .card-body {
      display: flex;
      flex-direction: column;
      align-items: left;
      .card-title {
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: 500;
        font-size: 25px;
        line-height: 30px;
        text-align: left;
        color: #003647;
      }
      .card-text {
        font-family: Manrope;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 19px;
        text-align: left;
        color: #393d3e;
        margin-bottom: 1rem;
      }
    }
    .card-footer {
      border: none;
      background-color: #ffffff;
      display: flex;
      justify-content: end;
    }
  }
`;

const CountText = styled.div`
  color: #003647;
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  margin-top: 10px;
`;

const Button = styled.button`
  &&& {
    width: 100%;
    height: 50px;
    background-color: ${(props) => props.backgroundColor};
    opacity: ${(props) => (props.disabled ? 0.25 : 1)};
    color: ${(props) => props.textColor};
    border: none;
    border-radius: 5px;
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    cursor: pointer !important;
    line-height: 24px;
    text-align: center;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 2px;
  top: 2px;
`;

const UserCard = styled.div`
  border-bottom: 0.5px solid #f5f5f5;
`;

const Details = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.5em 0 0.5rem 0;
`;

const Name = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #393d3e;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  .highlight {
    background-color: #ffd700;
  }
`;

const Department = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #6c7374;
  display: flex;
  span {
    display: inline-block;
  }
  .dept {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;
const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
  }
`;
