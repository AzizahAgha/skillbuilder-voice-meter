import React from "react";
import SocialButton from "./SocialButton";
import getConfig from "next/config";
import styled from "styled-components";
import { useAuthUser } from "@contexts/AuthContext";

const {
  publicRuntimeConfig: { FACEBOOK_APP_ID },
} = getConfig();

function FacebookSignInBtn({ handleAccessToken, callback }) {
  const { login, refetchAuthUser } = useAuthUser();

  const handleSocialLogin = (user) => {
    handleAccessToken && handleAccessToken(user._token.accessToken);
    login({
      type: "facebook",
      userId: user._profile.id,
      idToken: user._token.accessToken,
    })
      .then(() => {
        if (typeof callback === "function") callback();
      })
      .then(() => refetchAuthUser());
  };

  const handleSocialLoginFailure = (err) => {};
  return (
    <Wrapper>
      <SocialButton
        provider="facebook"
        appId={FACEBOOK_APP_ID}
        onLoginSuccess={handleSocialLogin}
        onLoginFailure={handleSocialLoginFailure}
      >
        Login with Facebook
      </SocialButton>
    </Wrapper>
  );
}

export default FacebookSignInBtn;

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  // width: ${(props) => (props.isLoginPage ? "70%" : "80%")};
  width: 208px;
  button {
    background: #1A73E8 !important;
    color: white !important;
    box-sizing: border-box;
    width: 100%;
    max-width: 208px;
    border-radius: 2px;
    height: 40px;
    >div{
      height: 38px;
    }
  }
`;
