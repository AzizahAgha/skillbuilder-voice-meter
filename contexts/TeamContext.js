import teamService from "@services/team.service";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { useAuthUser } from "./AuthContext";
import Bus from "@utils/Bus";
import { useRouter } from "next/router";

export const TeamContext = createContext();

export const useTeam = () => useContext(TeamContext);

function TeamContextProvider(props) {
  const [team, setTeam] = useState(null);
  const { auth } = useAuthUser();
  const router = useRouter();
  const lastTeamVisitedId = process.browser && localStorage.getItem('superAdminTeam')!==undefined && localStorage.getItem('superAdminTeam') ? localStorage.getItem('superAdminTeam'):auth?.user?.lastTeamVisitedId;
  const teamId = process.browser && localStorage.getItem('superAdminTeam')!==undefined && localStorage.getItem('superAdminTeam') ? localStorage.getItem('superAdminTeam'):team?.id;

  const { data, refetch: refetchTeam } = useQuery(
    ["team", teamId, lastTeamVisitedId],
    () => teamService.get(teamId),
    {
      enabled: auth?.isAuthenticated && teamId ? true : false,
      onSuccess: (data) => {
        setTeam(data);
      },
      onError: (error) => {
        if (!router.asPath.includes("invite")) {
          Bus.emit("error", { operation: "open", error: error.response });
        }
      },
    }
  );

  useEffect(() => {
    if (auth.isAuthenticated && auth?.user && !team?.id)
      if (team?.id !== lastTeamVisitedId)
        setTeam({ id: lastTeamVisitedId });
  }, [auth]);

  return (
    <TeamContext.Provider value={{ team, setTeam, refetchTeam }}>
      {props.children}
    </TeamContext.Provider>
  );
}

export default TeamContextProvider;
