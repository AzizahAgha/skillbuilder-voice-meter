import React, { useState } from "react";
import { useAuthUser } from "@contexts/AuthContext";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

export default function Auth0SignIn({ callback }) {
  const { loginWithPopup, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const { login, refetchAuthUser } = useAuthUser();

  const auth0Login = async () => {
    await loginWithPopup({
      prompt: 'login'
    });
    try {
      await getAccessTokenSilently().then((tokenResponse) => {
        setAccessToken(tokenResponse);
        login({
          accessToken: tokenResponse,
        })
          .then(() => {
            if (typeof callback === "function") callback();
          })
          .then(() => refetchAuthUser());
      });
    } catch (error) {
      return error;
    }
  };
  return (
    <Wrapper>
      <Button className="signIn-btn" onClick={() => auth0Login()}>Log in</Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  // width: ${(props) => (props.isLoginPage ? "70%" : "80%")};
  //width: 65%;
  button {
    min-width: 110px;
    width: 100%;
  }
`;
