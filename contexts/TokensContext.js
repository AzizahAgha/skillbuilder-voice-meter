import React, { createContext, useState, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import authService from "@services/auth.service";
import { useAuthUser } from "./AuthContext";
import { useTeam } from "./TeamContext";
import Bus from "@utils/Bus";
import { useRouter } from "next/router";
export const TokensContext = createContext();

export const useTokens = () => useContext(TokensContext);

function TokensContextProvider(props) {
  const { auth } = useAuthUser();
  const { team } = useTeam();
  const [tokens, setTokens] = useState(null);
  const router = useRouter();
  const {
    isLoading,
    isError,
    data: userTokens,
    error,
    isSuccess,
    refetch: refetchTokens,
  } = useQuery(
    ["tokens", auth?.token, team?.id],
    () => authService.getUserTokens(),
    {
      enabled: !!auth?.token && !!team?.id,

      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );
  useEffect(() => {
    if (userTokens) {
      setTokens(userTokens.data);
    }
  }, [userTokens]);
  return (
    <TokensContext.Provider value={{ tokens, setTokens, refetchTokens }}>
      {props.children}
    </TokensContext.Provider>
  );
}

export default TokensContextProvider;
