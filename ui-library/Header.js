import React, { useContext } from "react";
import { Navbar, Nav, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import logo from "@public/svgs/skill-builder-beta-logo.svg";
import Button from "@ui-library/Button";
import Link from "next/link";
import { AuthContext as AuthC } from "@contexts/AuthContext";
import teamService from "@services/team.service";
import { useQuery } from "react-query";
import { useTeam } from "@contexts/TeamContext";

export default function Header() {
  const AuthContext = React.useContext(AuthC);
  const { team } = useTeam();

  const { data: teams } = useQuery("userTeams", () => teamService.getAll(), {
    enabled: AuthContext.auth?.isAuthenticated,
  });

  return (
    <>
      {!AuthContext.auth?.isAuthenticated && (
        <TopBar>
          <Container>
            <Row>
              <NavLink href="/demo">Schedule Demo</NavLink>
              <NavLink href="/trial">Free Trial</NavLink>
            </Row>
          </Container>
        </TopBar>
      )}

      <StyledNavbar collapseOnSelect expand="lg" variant="dark">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>
              <Image src={logo.src} alt="SkillBuilder" />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="w-100 justify-content-center">
              <NavLink href="/features">How It’s Used</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/examples">Live Example</NavLink>
              <NavLink href="/thoughts">Thoughts</NavLink>
              <NavLink href="/about-us">About Us</NavLink>
            </Nav>
            <Nav>
              <Link href="/login" passHref>
                <Button className="w-100">My Account</Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>
    </>
  );
}

const NavLink = ({ href, children }) => (
  <Link href={href}>
    <a className="nav-link">{children}</a>
  </Link>
);

const TopBar = styled.div`
  background: #003647;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 1;
  padding: 0.25rem;

  .row {
    justify-content: flex-end;
  }

  .nav-link {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #ebebeb;
    width: auto;
  }
`;

const StyledNavbar = styled(Navbar)`
  &&& {
    background-color: #003647;
    padding: 1rem;

    .nav-link {
      color: white !important;
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #ffffff;
      padding: 20px !important;

      &:hover {
        color: rgba(255, 255, 255, 0.75) !important;
      }
    }
  }
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;
