import React from "react";
import styled from "styled-components";
import { Button, Navbar, Container, Nav } from "react-bootstrap";
import { useTeam } from "@contexts/TeamContext";

function ProfileHeader() {
  const { team } = useTeam();
  return (
    <React.Fragment>
      <Styles className="bs">
        <Navbar bg="default" variant="default">
          <Container>
            <Navbar.Brand>{team?.displayName}</Navbar.Brand>
            <span className="mx-3"> </span>
            <Nav className="me-auto">
              <Nav.Link href="/manage/profile">My Profile</Nav.Link>
              <Nav.Link href="/manage/users">Users</Nav.Link>
              <Nav.Link href="/manage/team">Team Profile</Nav.Link>
              <Nav.Link href="/manage/billing">Billing</Nav.Link>
              <Nav.Link href="/manage/invoices">Invoices</Nav.Link>
              <Nav.Link href="/manage/payment">Payment Method</Nav.Link>
            </Nav>
            <Nav.Link href="/manage/activity">Activity</Nav.Link>
            <StyledButton>Logout</StyledButton>
          </Container>
        </Navbar>
      </Styles>
    </React.Fragment>
  );
}

export default ProfileHeader;

const Styles = styled.div`
  .navbar {
    height: 100px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
    background-color: #fff !important;
  }
  .navbar-brand {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 600;
    font-size: 42px;
    line-height: 60px;
    color: #003647;
    align-self: flex-end;

    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .container {
    align-items: flex-end;
  }
  .navbar-nav {
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
  }

  .nav-link {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 400;
    font-size: 21.5px;
    line-height: 26px;
    color: #003647;
    padding-right: 1rem !important;
    padding-left: 1rem !important;
    // :active {
    //   color: #cccccc;
    // }
  }
`;

const StyledButton = styled(Button).attrs({
  variant: "outline-primary",
})`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: normal;
    font-size: 22px;
    line-height: 26px;

    color: #003647;
    background: #ffffff;
    border: 1px solid #003647;
    box-sizing: border-box;
    border-radius: 5px;
  }
`;
