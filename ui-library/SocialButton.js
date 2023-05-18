import React from "react";
import SocialLogin from "react-social-login";
import styled from "styled-components";
import FacebookLoginSvg from "@public/svgs/facebook-login.svg";
import Image from "next/image";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { FACEBOOK_APP_ID },
} = getConfig();
// import PropTypes from "prop-types";

export const logoutFB = () =>
  new Promise((resolve) => {
    window.FB.logout(resolve);
  });

// export const onLoad = () => {
//   window.fbAsyncInit = function () {
//     window.FB.init({
//       appId: FACEBOOK_APP_ID,
//       xfbml: true,
//       version: "v3.3",
//     });
//   };
// };

class SocialButton extends React.Component {
  render() {
    const { children, triggerLogin, triggerLogout, ...props } = this.props;
    return (
      <>
        <StyledButton onClick={triggerLogin} {...props}>
          {/* {children} */}
          <StyledDiv>
            <Image src={FacebookLoginSvg} alt="facebook login button" />
          </StyledDiv>
          <StyledSpan> Sign in with Facebook</StyledSpan>
        </StyledButton>
      </>
    );
  }
}

export default SocialLogin(SocialButton);

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.54);
  box-shadow: rgb(0 0 0 / 24%) 0px 2px 2px 0px, rgb(0 0 0 / 24%) 0px 0px 1px 0px;
  padding: 0px;
  border-radius: 2px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 500;
  font-family: Roboto, sans-serif;
`;

const StyledDiv = styled.div`
  margin-right: 10px;
  background: rgb(255, 255, 255);
  padding: 10px 10px 6px 10px;
  border-radius: 2px;
`;

const StyledSpan = styled.span`
  // padding: 0px 0px 0px 7px;
  padding-left: 3.5%;
  font-weight: 500;
  font-family: Roboto, sans-serif;
  font-size: 14px;
`;
