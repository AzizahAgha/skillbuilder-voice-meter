import React, { useEffect, useState } from "react";
import { Dropdown, Image, Button as BsButton } from "react-bootstrap";
import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import teamService from "@services/team.service";
import NotificationDropdown from "@components/notifications";
import { AuthContext as AuthC, useAuthUser } from "@contexts/AuthContext";
import { useTeam } from "@contexts/TeamContext";
import Link from "next/link";
import Button from "@ui-library/Button";
import { useRouter } from "next/router";
import { AiFillSetting } from "react-icons/ai";

const Widget = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  /* Weflow fixes */
  position: relative;
  width: auto;
  float: right;
  padding: 6px;
  margin: 0 auto;
  .dropdown {
    position: relative;
    display: inline;
  }

  .dropdown-toggle {
    color: #fff;
    display: inline;
    color: #81c2c0;
    display: inline-flex;
    align-items: center;
    line-height: 30px;

    &::after {
      display: none;
    }
  }

  .dropdown-menu {
  }

  #dropdown-teams .dropdown-item {
    white-space: nowrap;
    max-width: 170px;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 992px) {
    float: none;
    width: 720px;
  }
  @media (max-width: 768px) {
    width: 540px;
  }
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const PersonName = styled.span`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 30px;
  text-align: center;
  color: #81c2c0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  display: inline-block;
`;

const ProfileImage = styled.span`
  display: inline-block;
  margin-right: 15px;
  position: relative;
  img {
    border: 2px solid #81c2c0;
    border-radius: 50%;
  }
  svg{
    position: absolute;
    z-index: 99;
    bottom: -8px;
    right: -8px;
  }
`;

const LogoutBtn = styled(BsButton).attrs(() => ({
  variant: "outline-primary",
}))`
  &&& {
    margin: 0.45rem 0.75rem;
    margin-bottom: 0;
    width: 85%;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    padding: 0.175rem 0.75rem;
  }
`;

export default function HeaderSessionWidget() {
  const { setTeam, team } = useTeam();
  const { refetchAuthUser } = useAuthUser();
  const mutation = useMutation((teamId) => teamService.updateStatus(teamId));
  const router = useRouter();
  const [adminStrip, setadminStrip] = useState(false);
  const AuthContext = React.useContext(AuthC);

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

  const { data: teams } = useQuery("userTeams", () => teamService.getAll(), {
    enabled: AuthContext.auth?.isAuthenticated,
  });

  const teamName = team?.displayName;
  const profileImageUrl = AuthContext.auth?.user?.avtarUrl;

  const onTeamChange = (newTeam) => {
    setTeam(newTeam);
    mutation.mutateAsync(newTeam.id).then(() => {
      refetchAuthUser();
    });
    if (router.route !== "/detail") router.push("/detail");
  };

  if (!AuthContext.auth?.isAuthenticated) {
    return (
      <Link href="/login" passHref>
        <Button className="myAccBtn" style={{ float: "right" }}>
          My Account
        </Button>
      </Link>
    );
  }

  return (
    <Widget className="bs">
      <Dropdown align={{ lg: "end" }} id="dropdown-teams">
        {!adminStrip && (
          <Dropdown.Toggle split variant="default">
            <PersonName>{teamName}</PersonName>
            <FiChevronDown color="#81C2C0" />
          </Dropdown.Toggle>
        )}
        <ProfileImage>
          <Link href="/manage/profile" passHref>
            <a>
              <AiFillSetting size={22} color="#81c2c0" />
              <Image
                style={{ position: "relative" }}
                src={profileImageUrl || "/images/default-user-avatar.jpg"}
                alt={`Profile picture of ${AuthContext.auth?.user?.firstName}`}
                width={38}
                height={38}
                referrerPolicy="no-referrer"
              />
            </a>
          </Link>
        </ProfileImage>
        <Dropdown.Menu>
          <div style={{ maxHeight: 214, overflowY: "auto" }}>
            <Dropdown.Item onClick={() => router.push("/detail")}>
              {team?.displayName}
            </Dropdown.Item>
            {teams &&
              teams
                .sort((a, b) =>
                  a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                )
                .map(
                  (_team) =>
                    _team.id !== team?.id && (
                      <Dropdown.Item
                        key={_team.id}
                        onClick={() => onTeamChange(_team)}
                      >
                        {_team.displayName}
                      </Dropdown.Item>
                    )
                )}
          </div>

          <div style={{ boxShadow: "0px -4px 4px rgba(0,0,0,0.08)" }}>
            <LogoutBtn onClick={() => AuthContext.handlelogout()}>
              Logout
            </LogoutBtn>
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <NotificationDropdown />
    </Widget>
  );
}
