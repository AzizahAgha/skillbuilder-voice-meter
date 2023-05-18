import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "@services/auth.service";
import { useRouter } from "next/router";
import userService from "@services/user.service";
import { useQuery, useQueryClient } from "react-query";
import Bus from "@utils/Bus";
import { useAuth0 } from "@auth0/auth0-react";
export const AuthContext = createContext();

export const useAuthUser = () => useContext(AuthContext);
function AuthContextProvider(props) {
  let jwt = require("jsonwebtoken");
  const router = useRouter();
  const queryClient = useQueryClient();
  const initialState = {
    isAuthenticated: false,
    token: process.browser && localStorage.getItem("auth"),
  };
  const [auth, setAuth] = useState(initialState);
  const {logout} = useAuth0();

  const {
    isLoading,
    isError,
    data: user,
    error,
    isSuccess,
    refetch: refetchAuthUser,
    remove,
  } = useQuery("profile", () => userService.get("profile"), {
    enabled: !!auth?.token,
    onSuccess: (res) => {
      if (!router.asPath.includes("login")){
        setAuth((old) => ({
          ...old,
          user: res?.data,
          isAuthenticated: true,
        }));
      }
      
      localStorage.removeItem("showIcons");
    },
    onError: (error) => {
      if (!router.asPath.includes("invite")) {
        Bus.emit("error", { operation: "open", error: error.response });
      }
    },
  });

  useEffect(() => {
    if (user) {
      setAuth((old) => ({
        ...old,
        user: user?.data,
        isAuthenticated: true,
      }));
    }
  }, [user]);

  const login = async ({ accessToken }) => {
    const { data: user } = await authService.signIn({
      accessToken: accessToken
    });

    localStorage.setItem("auth", user.token);
    setAuth({
      isAuthenticated: true,
      ...user,
    });
  };

  const handlelogout = async (callback) => {
    if (auth?.user?.lastTeamVisitedId) {
      const { teamId } = await authService.logout(
        auth?.user?.lastTeamVisitedId
      );
    }
    setAuth({ isAuthenticated: false });
    localStorage.clear();
    remove();
    queryClient.removeQueries(["team", auth?.user?.lastTeamVisitedId]);

    if (typeof callback === "function") callback();
    else {
      if (auth?.user?.lastTeamVisitedId && !router.asPath.includes("invite")) {
        logout({
          returnTo: window.location.origin
        });
      } else {
        logout({
          localOnly:true
        });
      }
    }
  };

  useEffect(() => {
    const today = new Date();
    const token = localStorage.getItem("auth");
    var decodedToken = jwt.decode(token, { complete: true });

    if (decodedToken) {
      if (new Date(decodedToken.payload.exp * 1000) < today) {
        // Login token is expired
        localStorage.removeItem("auth");
        localStorage.removeItem("tokenInfo");
        router.push("/login");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        handlelogout,
        refetchAuthUser,
        isLoading,
        isError,
        error,
        isSuccess,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
