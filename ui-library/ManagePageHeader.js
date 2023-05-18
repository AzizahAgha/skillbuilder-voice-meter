import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Col, Container, Row, Form } from "react-bootstrap";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import { useRouter } from "next/router";
import { useAuthUser } from "@contexts/AuthContext";
import { useTeam } from "@contexts/TeamContext";
import Authorization from "@contexts/Authorization";
import Select from "./Select";
import SuperAdminStrip from "@ui-library/SuperAdminStrip";

export default function ManagePageHeader() {
  const router = useRouter();
  const { handlelogout, auth: { user: { isSuperAdmin, isAdmin } = {} } = {} } =
    useAuthUser();
  const path = router.pathname;
  const { team } = useTeam();
  const [adminStrip, setadminStrip] = useState(false);

  const options = useMemo(() => {
    const options = [
      { name: "Questions", value: "/detail" },
      { name: "My Profile", value: "/manage/profile" },
    ];

    if (isSuperAdmin) {
      options.push({ name: "Accounts", value: "/manage/accounts" });
    }

    if (isSuperAdmin || isAdmin) {
      options.push(
        { name: "Users", value: "/manage/users" },
        { name: "Team Profile", value: "/manage/team" },
        { name: "Billing", value: "/manage/billing" },
        { name: "Invoices", value: "/manage/invoices" },
        { name: "Activity", value: "/manage/activity?&fromHeader=true" }
      );
    }

    return options;
  }, [isAdmin, isSuperAdmin]);

  const value = useMemo(() => {
    const option = options.find((opt) => opt.value.includes(path));
    return option?.value ?? "/manage/profile";
  }, [path, options]);

  useEffect(() => {
    const storageEventHandler = () => {
      let flag =
        localStorage.getItem("isSuperAdminView") === "true" ? true : false;
      setadminStrip(flag);
    };

    window.addEventListener("storage", storageEventHandler, false);
    storageEventHandler();
    if (router.asPath.includes("accounts")) {
      localStorage.removeItem("superAdminTeam");
      localStorage.removeItem("isSuperAdminView");
      setadminStrip(false);
    }
  }, []);

  return (
    <Wrapper className="mb-3 mb-lg-5">
      {adminStrip && <SuperAdminStrip></SuperAdminStrip>}
      <Container>
        <Row className="py-4 align-items-center">
          <Col className="d-none d-lg-flex align-items-center">
            {!isSuperAdmin && <Team>{team?.displayName}</Team>}

            <NavButton
              active={path.includes("detail")}
              onClick={() => router.push("/detail")}
            >
              Questions
            </NavButton>

            {!adminStrip && (
              <NavButton
                active={path.includes("profile")}
                onClick={() => {
                  router.push("/manage/profile");
                  // router.reload();
                  // refetchAuthUser();
                }}
              >
                My Profile
              </NavButton>
            )}

            <Authorization allow={["admin", "superadmin"]}>
              <NavButton
                active={path.includes("users")}
                onClick={() =>
                  router.push(
                    `/manage/users?teamId=${team.id}&teamName=${team.teamName}`
                  )
                }
              >
                Users
              </NavButton>
            </Authorization>

            <Authorization allow={["admin", "superadmin"]}>
              <NavButton
                active={path.endsWith("team")}
                onClick={() => router.push("/manage/team")}
              >
                Team Profile
              </NavButton>
            </Authorization>

            <Authorization allow={["admin", "superadmin"]}>
              <NavButton
                active={path.includes("billing")}
                onClick={() => router.push("/manage/billing")}
              >
                Billing
              </NavButton>
            </Authorization>

            <Authorization allow={["admin", "superadmin"]}>
              <NavButton
                active={path.includes("invoices")}
                onClick={() => router.push("/manage/invoices")}
              >
                Invoices
              </NavButton>
            </Authorization>

            <NavButton
              active={path.includes("activity")}
              onClick={() => router.push(`/manage/activity`)}
            >
              Activity
            </NavButton>
            {!adminStrip && (
              <Authorization allow={["superadmin"]}>
                <NavButton style={{ cursor: "auto" }}> | </NavButton>

                <NavButton
                  active={path.includes("accounts")}
                  onClick={() => router.push("/manage/accounts")}
                >
                  All Accounts
                </NavButton>
              </Authorization>
            )}
          </Col>
          <Col className="d-flex d-lg-none align-items-center">
            {!isSuperAdmin && <Team>{team?.teamName}</Team>}
            <div className="flex-grow-1" />
            <Select
              value={value}
              onChange={(event) => {
                const val = event?.target?.value;
                const path =
                  val == "/manage/users"
                    ? `/manage/users?teamId=${team.id}&teamName=${team.teamName}`
                    : val;

                if (path === "/logout") {
                  handlelogout();
                  return;
                }
                router.push(path);
              }}
            >
              {options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.name}
                </option>
              ))}
            </Select>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.08);
`;

const OptionsWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NavButton = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  font-size: 20.5px;
  line-height: 26px;
  color: #003647;
  margin-right: 30px;
  cursor: pointer;
  padding: 6px;
  border-bottom: ${(props) =>
    props.active ? "2px solid #81C2C0" : "2px solid transparent"};
`;

const Team = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 60px;
  color: #003647;
  margin-right: 36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`;
