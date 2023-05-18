import React, { useEffect, useState } from "react";
import ManagePageHeader from "@ui-library/ManagePageHeader";
import Title from "@ui-library/Title";
import NotificationsAccordion from "@components/notifications/accordion-copy";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import ActivityService from "@services/activity.service";
import { useTeam } from "@contexts/TeamContext";
import { useQuery, useMutation } from "react-query";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Authorization from "@contexts/Authorization";
import Error from "@components/error";
import styled from "styled-components";
import {
  Button as BsButton,
  Col,
  Container,
  InputGroup,
  Row,
  Badge,
} from "react-bootstrap";
import { DebounceInput } from "react-debounce-input";
import { IoSearchOutline } from "react-icons/io5";
import Tooltip from "@ui-library/Tooltip";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useAuthUser } from "@contexts/AuthContext";
import Bus from "@utils/Bus";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import notificationService from "@services/notification.service";
import { BsCalendar3 } from "react-icons/bs";

const Activity = () => {
  const { team } = useTeam();
  const { auth } = useAuthUser();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentMonth, setCurrentMonth] = useState(
    parseInt(moment().month() + 1)
  );
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [notificationData, setNotificationData] = useState({
    January: [],
    February: [],
    March: [],
    April: [],
    May: [],
    June: [],
    July: [],
    August: [],
    September: [],
    October: [],
    November: [],
    December: [],
  });

  const getInitialState = () => {
    let fullYearObject = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    //if current year then get months from start of year to current month
    if (selectedYear.getFullYear() === new Date().getFullYear()) {
      let startDate = moment(new Date(new Date().getFullYear(), 0, 1));
      let endDate = moment(Date());

      let newobject = [];

      if (startDate < endDate) {
        var date = startDate.startOf("month");
        while (date < endDate.endOf("month")) {
          newobject.push(date.format("MMMM"));
          date.add(1, "month");
        }
      }
      return newobject;
    }
    return fullYearObject;
  };

  const [SelectedTab, setSelectedTab] = useState("All");
  const [type, setType] = useState("all");
  const tabNames = ["All", "Your Activity", "Action Required", "Archived"];
  const [unreadGroupCount, setUnreadGroupCount] = useState(null);
  const [accordionData, setAccordionData] = useState(getInitialState());
  const [activeKey, setActiveKey] = useState([
    moment().format("MMMM") + "_" + parseInt(moment().month() + 1),
  ]);

  const { data, refetch: refetchActivitesNotifications } = useQuery(
    [
      "activities",
      {
        teamId: team?.id,
        searchString: searchKeyword,
        month: selectedMonth,
        year: selectedYear.getFullYear(),
      },
    ],
    () =>
      ActivityService.get(team?.id, {
        type: "all",
        searchString: searchKeyword,
        month: selectedMonth,
        year: selectedYear.getFullYear(),
        isActingSuperAdmin:
          localStorage.getItem("isSuperAdminView") === "true" ? true : false,
      }),
    {
      enabled: !!team?.id,
      onSuccess: (res) => {
        let count = 0;
        res
          .flatMap((e) => e)
          .forEach((e) => {
            if (
              e.groupType === "action_required" &&
              (e.type === "Flashcard_archive_action" ||
                e.type === "Question_merge_action" ||
                e.type === "Answer_merge_action")
            ) {
              count = count + 1;
            }
          });
        setUnreadGroupCount(count);
        let month = moment(selectedMonth, "M").format("MMMM");

        let filteredResponse = res.filter((e) => {
          if (type === "all") {
            return e;
          } else {
            if (e.groupType === type) {
              return e;
            }
          }
        });

        setNotificationData((current) => {
          return {
            ...current,
            [month]: [...current[month], ...filteredResponse],
          };
        });

        let unread = res?.map((_notif) => !_notif.isRead && _notif.id);
        unread = unread.filter((_id) => _id);
        if (unread.length) {
          mutation.mutate(unread);
        } 
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const queryTypeFunction = (value) => {
    switch (value) {
      case "All":
        return "all";
      case "Your Activity":
        return "your_activity";
      case "Action Required":
        return "action_required";
      case "Archived":
        return "archived";
    }
  };

  const setSearchString = (value) => {
    setSearchKeyword(value);
  };
  const userName = auth?.user?.firstName + " " + auth?.user?.lastName;

  useEffect(() => {
    setNotificationData({
      January: [],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: [],
    });
    setAccordionData(getInitialState());
  }, [selectedYear]);

  useEffect(() => {
    refetchActivitesNotifications;
  }, [selectedMonth]);

  useEffect(() => {
    if (accordionData.length == 12) {
      setSelectedMonth(12);
      setActiveKey(["December_12"]);
    } else {
      setSelectedMonth(parseInt(moment().month() + 1));
      setActiveKey([
        moment().format("MMMM") + "_" + parseInt(moment().month() + 1),
      ]);
    }
  }, [accordionData]);

  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener(
        "flashcard-notification-click",
        refetchActivitesNotifications,
        false
      );
    } else {
      document.attachEvent(
        "flashcard-notification-click",
        refetchActivitesNotifications
      );
    }
  }, []);

  const handleAccordionSelect = (newKeys) => {
    if (activeKey.length < newKeys.length) {
      const lastItem = newKeys.slice(-1);
      const month = parseInt(
        lastItem[0].substring(lastItem[0].indexOf("_") + 1)
      );
      setSelectedMonth(month);
    }
    setActiveKey(newKeys);
  };

  const mutation = useMutation(
    (notificationIds) => notificationService.update(team.id, notificationIds),
    {
      onSuccess: () => {
        refetchActivitesNotifications && refetchActivitesNotifications();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  }

  return (
    <Authorization allow={["member"]} fallback={<Error code={401} />}>
      <div className="bs">
        <ManagePageHeader />
        <Container>
          <Row className="mb-5 align-items-center" sm={3}>
            <Col className="d-flex align-items-center">
              <Title>Notification/Activity</Title>
            </Col>
          </Row>
          <Row className="mb-5 align-items-start">
            <Col className="col-12 col-md-12 col-lg-10 ">
              <div>
                <Row>
                  <Col className="col-12 col-lg-7">
                    <StyledTabs
                      className="bs mb-3"
                      defaultActiveKey="All"
                      id="notification-tabs"
                      justify
                      onSelect={(k) => {
                        setSelectedTab(k);
                        setType(queryTypeFunction(k));
                        setNotificationData({
                          January: [],
                          February: [],
                          March: [],
                          April: [],
                          May: [],
                          June: [],
                          July: [],
                          August: [],
                          September: [],
                          October: [],
                          November: [],
                          December: [],
                        });
                        setAccordionData(getInitialState());
                        refetchActivitesNotifications && refetchActivitesNotifications();
                      }}
                    >
                      {tabNames.map((group, index) => (
                        <Tab
                          eventKey={group}
                          title={
                            <StyledtabHeader>
                              <span className="group-name">{group}</span>
                              <span className="badge">
                                {group === "Action Required" &&
                                  unreadGroupCount > 0 && (
                                    <NotificationCount bg="danger">
                                      {unreadGroupCount}
                                    </NotificationCount>
                                  )}
                              </span>
                            </StyledtabHeader>
                          }
                          key={index}
                        ></Tab>
                      ))}
                    </StyledTabs>
                  </Col>
                  <Col className="col-12 col-lg-2">
                    <StyledDatePicker>
                    <label><DatePicker
                        selected={selectedYear}
                        onChange={(date) => setSelectedYear(date)}
                        showYearPicker
                        dateFormat="yyyy"
                        minDate={new Date("01-01-2022")}
                        onChangeRaw={(e)=>handleDateChangeRaw(e)}
                      />
                      <BsCalendar3
                        color="#003647"
                        size={18}
                      /></label>
                      
                    </StyledDatePicker>
                  </Col>
                  <Col className="col-12 col-lg-3">
                    <StyledInputGroup>
                      <InputGroup.Text>
                        <IoSearchOutline color="#003647" size={20} />
                      </InputGroup.Text>

                      <Input
                        type="search"
                        minLength={2}
                        debounceTimeout={300}
                        value={searchKeyword}
                        onChange={(e) => setSearchString(e.target.value)}
                        placeholder="Search by Keywords"
                        className="form-control"
                      />

                      {searchKeyword && (
                        <Tooltip text="Clear" placement="right">
                          <ClearButton
                            variant="default"
                            onClick={() => setSearchKeyword("")}
                          >
                            <IoIosCloseCircleOutline
                              color="#969C9D"
                              size={20}
                            />
                          </ClearButton>
                        </Tooltip>
                      )}
                    </StyledInputGroup>
                  </Col>
                </Row>
              </div>

              <NotificationsAccordion
                handleAccordionSelect={handleAccordionSelect}
                activeKey={activeKey}
                accordionData={accordionData}
                notificationData={notificationData}
                refetchActivitesNotifications={refetchActivitesNotifications}
                userName={userName}
              />
            </Col>
            <Col className="col-12 col-md-12 col-lg-2"></Col>
          </Row>
        </Container>
      </div>
    </Authorization>
  );
};

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <Activity />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/activity");

  return {
    props: { HEAD, BODY },
  };
}

export default function ActivityPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
const StyledtabHeader = styled.div`
  &&& {
    position: relative;
    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
    }
  }
`;

const AccordionContainer = styled.div`
  margin-top: 50px;
`;

const StyledTabs = styled(Tabs)`
  &&& {
    border-bottom: none;
    width: 100%;
    flex-wrap: nowrap;
    .nav-link {
      color: #969c9d;
      font-family: "Barlow Condensed", sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;
      text-align: center;
    }
    .active {
      color: #003647;
      font-weight: 600;
      border-color: #fff #fff #003647 #fff;
      border-bottom-width: 3px;
    }
    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

const StyledInputGroup = styled(InputGroup)`
  &&& {
    color: #003647;
    font-family: "Barlow Condensed", sans-serif;
    border: 0.5px solid #003647;
    border-radius: 0.25rem;
    .input-group-text {
      background: none;
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

const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
  }
`;

const NotificationCount = styled(Badge)`
  &&& {
    border-radius: 50rem;
    background-color: #ff804a !important;
    //  position: absolute !important;
    // top: 2px !important;
    // left: 100%;
    // transform: translate(-50%, -50%);
    // font-family: Barlow Condensed;
    // font-style: normal;
    // font-weight: 600;
    // font-size: 14px;
  }
`;
const StyledDatePicker = styled.div`
  text-align: right;
  margin-bottom: 10px;
  position: relative;
  svg{
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container input {
    width: 100%;
    max-width: 100px;
    font-family: "Barlow Condensed",sans-serif;
  }
  .react-datepicker__input-container input {
    padding: 7px;
    cursor: pointer;
    color: #003647;
    font-family: "Barlow Condensed",sans-serif;
    font-size: 17px;
    border: 0.5px solid #003647;
    border-radius: 0.25rem;
    outline: none !important;
    font-weight: 700;
  }
  .react-datepicker__navigation-icon::before{
    border-color: #003647 !important;
  }
  .react-datepicker {
    width: 100%;
    max-width: 150px;
    font-family: "Barlow Condensed",sans-serif;
    font-size: 16px;
    font-weight: 400;
  }
  .react-datepicker__header {
    background-color: #81c2c0;
  }
  .react-datepicker__triangle::after {
    border-bottom-color: #81c2c0 !important;
  }
  .react-datepicker__year-wrapper {
    display: block;
  }
  .react-datepicker__year-text--selected {
    background-color: #81c2c0;
  }
`;
