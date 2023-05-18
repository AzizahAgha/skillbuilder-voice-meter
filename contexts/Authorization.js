
import React, { useState, useEffect } from "react";
import { useQueryClient } from 'react-query';
import { useTeam } from "@contexts/TeamContext";
import { useAuthUser } from "@contexts/AuthContext";

const Authorization = (props) => {

  const isAdmin = props?.allow?.includes("admin") ? true : false
  const isSuperAdmin = props?.allow?.includes("superadmin") ? true : false
  const isMember = props?.allow?.includes("member") ? true : false

  const { auth, isSuccess } = useAuthUser();
  const { team } = useTeam();
  const queryClient = useQueryClient();
  const usersTeams = queryClient.getQueryData("userTeams");

  const [selectedTeam, setSelectedTeam] = useState("");
  

  useEffect(() => {
    const TeamSelection = () => {
      usersTeams?.map((element) => {
        if ((element.id) === (team?.id)) { setSelectedTeam(element) }
      })
    }
    TeamSelection();

  }, [team])

  if(!process.browser) {
    return null;
  }

  if (!auth?.token) {
    return props?.fallback || null
  }

  if (!isSuccess) {
    return null
  }

  if (isMember) {
    if (!auth?.isAuthenticated)
      return props?.fallback || null
    else
      return props?.children
  }

  else if (isAdmin=== true && isSuperAdmin=== true)
  {
    if(selectedTeam.isAdmin && auth?.user?.isSuperAdmin) {
      return (props.children)
    }
    else if(selectedTeam.isAdmin){
      return (props.children)
    }
    else if(auth?.user?.isSuperAdmin){
      return (props.children)
    }
    else {
      return usersTeams ? props.fallback ? props.fallback : null : null;
    }
  }

  else if (isAdmin === true && isSuperAdmin === false) {
    if (selectedTeam.isAdmin) {
      return (props.children)
    }
    else {
      return usersTeams ? props.fallback ? props.fallback : null : null;
    }
  }

  else if (isAdmin === false && isSuperAdmin === true) {
    if (auth?.user?.isSuperAdmin) {
      return (props.children)
    }
    else {
      return usersTeams ? props.fallback ? props.fallback : null : null;
    }
  }

  else if (isAdmin === false && isSuperAdmin === false) {
    return (props.fallback ? props.fallback : <div> 401- You are not Authorized !</div>)
  }


}

export default Authorization