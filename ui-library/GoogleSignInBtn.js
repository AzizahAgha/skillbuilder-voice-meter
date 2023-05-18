import React from "react";
import getConfig from "next/config";
import { useAuthUser } from "@contexts/AuthContext";
import styled from "styled-components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from '@react-oauth/google';
import Bus from "@utils/Bus";

const {
  publicRuntimeConfig: { GOOGLE_CLIENT_ID },
} = getConfig();

export default function GoogleSignInBtn({ callback }) {
  const { login, refetchAuthUser } = useAuthUser();

  return (
    <Wrapper>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLogin
          theme="filled_blue"
          shape="rectangular"
          width="208"
          logo_alignment="left"
          onSuccess={(tokenResponse) => {
            login({
              type: "google",
              idToken: tokenResponse.credential,
            })
              .then(() => {
                if (typeof callback === "function") callback();
              })
              .then(() => refetchAuthUser());
          }}
          onError={(error) => {
            Bus.emit("error", { operation: "open",error:error.response});
          }}
        />
      </GoogleOAuthProvider>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  // width: ${(props) => (props.isLoginPage ? "70%" : "80%")};
  //width: 65%;
  button {
    background: #4f86eb !important;
    color: white !important;
    box-sizing: border-box;
    width: 100%;
  }
`;
