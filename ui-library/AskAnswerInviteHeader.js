import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import edit from "@public/svgs/edit.svg";
import Tooltip from "@ui-library/Tooltip";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BiSave } from "react-icons/bi";
import { useAuthUser } from "@contexts/AuthContext";
import useTeamUpdateMutation from "@hooks/useTeamUpdateMutation";
import { useTeam } from "@contexts/TeamContext";

export default function Header({ component }) {
  const [org, setOrg] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [size, setSize] = useState(org.length);
  const ref = useRef(null);
  const { auth } = useAuthUser();
  const { team } = useTeam();

  const teamUpdateMutation = useTeamUpdateMutation();

  useEffect(() => {
    let savedOrg =
      localStorage.getItem("ORG") ||
      localStorage.getItem("teamName") ||
      "maad labs";
    setOrg(savedOrg);
    setSize(savedOrg.length);
  }, []);

  return (
    <Wrapper className="bs">
      <Container>
        <Row className="py-4">
          <StyledColOrgName sm={7} className="my-auto">
            <Label>Your Organization</Label>
            <Input
              ref={ref}
              size={size}
              value={org}
              onChange={(e) => {
                setOrg(e.target.value);
              }}
              disabled={disabled}
              onInput={(e) => {
                setSize(e.target.value.length);
              }}
            />
            {disabled ? (
              <Tooltip text="Edit Org Name" placement="right">
                <Button variant="default">
                  <Icon
                    src={edit}
                    alt="edit"
                    onClick={() => {
                      setDisabled(false);
                      setTimeout(() => {
                        ref.current.focus();
                      }, 100);
                    }}
                  />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip text="Save" placement="right">
                <Button
                  variant="default"
                  onClick={() => {
                    const value = org.trim();
                    localStorage.setItem("ORG", value);
                    localStorage.setItem("teamName", value);
                    setOrg(value);
                    setSize(value.length);
                    setDisabled(true);

                    if (auth.isAuthenticated) {
                      teamUpdateMutation.mutate({
                        id: team.id,
                        data: {
                          teamDetails: {
                            teamName: org,
                          },
                        },
                      });
                    }
                  }}
                >
                  <BiSave color="#003647" size={30} />
                </Button>
              </Tooltip>
            )}
          </StyledColOrgName>

          <StyledColSignin>
            <>{component}</>
          </StyledColSignin>
        </Row>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 4rem;
`;

const Label = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: #969c9d;
  margin-bottom: -10px;
`;
const Input = styled.input`
  &&& {
    font-family: Barlow Condensed, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 50px;
    outline: none;
    border: 0;
    background: none;
    color: #003647;

    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
    vertical-align: bottom;

    @media (max-width: 1224px) {
      font-size: 40px;
    }
  }
`;

const StyledColOrgName = styled(Col)`
  &&& {
    flex-basis: 500px;
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

const StyledColSignin = styled(Col)`
  &&& {
    flex-basis: 40%;
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

const Icon = styled(Image).attrs(() => ({
  width: "24px",
  height: "24px",
}))`
  cursor: pointer;
`;
