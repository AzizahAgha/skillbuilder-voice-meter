import React from 'react'
import styled from "styled-components";
import Image from "next/image";
import plug from "@public/svgs/plug.svg";
import Button from "@ui-library/Button";
import Link from 'next/link';

const Custom404 = () => (
  <Container>
    <Plug />
    <Column>
      <Title>Oops!</Title>
      <Content>404 PAGE NOT FOUND</Content>
      <Description>
        The page you are looking for might have been removed, had it’s name changed or is temporarily unavailable.
      </Description>
      <Row>
        <Link href='/' passHref>
          <a>
            <HomeButton>Go to Home Page</HomeButton>
          </a>
        </Link>
        <Link href='/contact-us' passHref>
          <a>
            <Button>Contact Us</Button>
          </a>
        </Link>
      </Row>
    </Column>
  </Container>
);

export default Custom404;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  margin-left: 15%;
  height: 85vh;

  @media (max-width: 1224px) {
    margin-left: 0;
  }
`;

const Plug = styled(Image).attrs(() => ({
  src: plug
}))`
`;

const Title = styled.div`
  font-family: "Barlow Condensed",sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 200px;
  line-height: 240px;  
  color: #81C2C0;

  @media (max-width: 1224px) {
    font-size: 70px;
    line-height: 90px;
  }
`;

const Content = styled.div`
  font-family: Manrope,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 27px;
  color: #003647;
  margin-top: 60px;

  @media (max-width: 1224px) {
    font-size: 16px;
    margin-top: 23px;
  }
`;

const Description = styled.div`
  font-family: Manrope,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 27px;
  color: #003647;
  margin-bottom: 40px;

  @media (max-width: 1224px) {
    font-size: 16px;
  }
`;

const Column = styled.div`
  display: flex;
  margin-left: 46px;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1224px) {
    margin-left: 23px;
    margin-right: 23px;
    margin-top: 46px;
    flex: 1;
  }
`;

const HomeButton = styled(Button)`
&&&{
  margin-right: 20px;
  background: #003647;
  border-color: #003647;

  @media (max-width: 1224px) {
    font-size: 16px;
    margin-bottom: 16px;
  }
}
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 1224px) {
    flex-direction: column;
  }
`;
