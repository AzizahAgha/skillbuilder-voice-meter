import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Button as BsButton,
  ToggleButtonGroup as BsToggleButtonGroup,
  ToggleButton as BsToggleButton,
} from "react-bootstrap";
import Stat from "./Stat";
import teamService from "@services/team.service";
import { useQuery } from "react-query";
import dashboardStatsTransformer from "@transformers/teamStats.transformer";
import { useTeam } from "@contexts/TeamContext";
import moment from "moment";
import DateRangePickerModal from "./DateRangePickerModal";
import Bus from "@utils/Bus";
const filters = [
  { name: "All Time", value: "all_time" },
  { name: "This Week", value: "this_week" },
  { name: "Last Week", value: "last_week" },
];

export default function DashboardInfo({ onFilterChange, onStatsFetched }) {
  const { team } = useTeam();
  const [selectedFilter, setSelectedFilter] = useState("all_time");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "range",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: stats } = useQuery(
    ["dashboard-stats", selectedFilter, dateRange, team?.id],
    async () => {
      const res = await teamService.getStats({
        teamId: team?.id,
        params: {
          type: selectedFilter,
          startDate: moment(dateRange?.startDate).format("YYYY-MM-DD"),
          endDate: moment(dateRange?.endDate).format("YYYY-MM-DD"),
        },
      });

      const stats = dashboardStatsTransformer(res[0]);
      onStatsFetched(stats);
      return stats;
    },
    {
      enabled: !!team,
      onError:(error)=>{
        Bus.emit("error", { operation: "open",error:error.response});
      }
      // ? !((selectedFilter === 'range') && (dateRange.startDate.toString() === dateRange.endDate.toString()))
      // : true
    }
  );

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        type: selectedFilter,
        dateRange:
          selectedFilter === "range"
            ? {
                startDate: moment(dateRange?.startDate).format("YYYY-MM-DD"),
                endDate: moment(dateRange?.endDate).format("YYYY-MM-DD"),
              }
            : // : getDateRange(selectedFilter)
              { startDate: "", endDate: "" },
      });
    }

    // setShowDatePicker(selectedFilter === 'range')
  }, [selectedFilter, dateRange, onFilterChange]);

  return (
    <Container>
      <Row>
        <Col>
          <ToggleButtonGroup
            className="d-sm-flex flex-sm-row d-lg-inline-flex"
            type="radio"
            name="filter-options"
            defaultValue="this_week"
            value={selectedFilter}
            onChange={setSelectedFilter}
          >
            {filters.map((option, idx) => (
              <ToggleButton
                className="flex-sm-grow-1"
                key={idx}
                id={`radio-${idx}`}
                variant="outline-primary"
                value={option.value}
                active={selectedFilter === option.value}
              >
                {option.name}
              </ToggleButton>
            ))}

            <Button
              variant="outline-primary"
              active={selectedFilter === "range"}
              onClick={() => setShowDatePicker(true)}
            >
              Range
            </Button>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row>
        {showDatePicker && (
          <DateRangePickerModal
            show={showDatePicker}
            onHide={() => setShowDatePicker(false)}
            onChange={(_range) => {
              setDateRange(_range);
              setSelectedFilter("range");
            }}
            // onDismiss={() => setSelectedFilter('all_time')}
          />
        )}
      </Row>

      <Row className="d-none d-lg-flex">
        <Col>
          <Note>
            Values below are from [{stats?.dateRange?.start ?? "MM/DD/YY"} -{" "}
            {stats?.dateRange?.end ?? "MM/DD/YY"}]
          </Note>
        </Col>
      </Row>
      <StatsWrapper>
        {stats &&
          stats.data.map((stat, idx) => (
            <Col key={idx}>
              <Stat label={stat?.label} count={stat?.count} note={stat?.note} />
            </Col>
          ))}
      </StatsWrapper>
    </Container>
  );
}

const StatsWrapper = styled(Row)`
  &&& {
    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: auto auto auto;
    }
  }
`;

const ToggleButtonGroup = styled(BsToggleButtonGroup)`
  &&& {
    border: 1px solid #003647;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }
`;

const ToggleButton = styled(BsToggleButton)`
  &&& {
    font-family: Barlow Condensed;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: center;
    border: none;
  }
`;

const Button = styled(BsButton)`
  &&& {
    font-family: Barlow Condensed;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: center;
    border: none;
  }
`;

const Note = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 20px;
  color: #000000;
  margin-top: 3rem;
`;
