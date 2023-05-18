import React from "react";
import styled from "styled-components";
import { IoIosArrowDropleft as LeftArrow} from "react-icons/io";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { useAuthUser } from "@contexts/AuthContext";
import Bus from "@utils/Bus";
import { useTeam } from "@contexts/TeamContext";
import { useQuery,useMutation } from "react-query";
import teamService from "@services/team.service";

const SuperAdminStrip = () => {
    const router = useRouter();
    const { auth } = useAuthUser();
    const { team, setTeam } = useTeam();
    const switchTeamMutation = useMutation(
		(data) =>
            teamService.get(auth?.user?.lastTeamVisitedId),{
            onSuccess:(data)=>{
                setTeam(data);
                localStorage.removeItem("isSuperAdminView");
                localStorage.removeItem("superAdminTeam");
                router.push("/manage/accounts");
            },
			onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
		}
	);
    
    const endSupport=()=>{
        switchTeamMutation.mutate();
       
        
    }
    return(
        <StyledSuperAdmin>
            <Container>
            <p> {`YOU ARE VIEWING AND ACTING AS SUPER ADMIN: ${auth?.user?.firstName} ${auth?.user?.lastName || ""}`}</p>
            <button onClick={()=>endSupport()}>
                <LeftArrow
                color="#fff"
                size={22}/>EXIT BACK TO DASHBOARD
            </button>
            </Container>
        </StyledSuperAdmin>
    );
}


const StyledSuperAdmin = styled.div`
  width: 100%;
  min-height: 30px;
  background-color: #F0BB00;
  color: #fff;
  div{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  p{
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    margin-bottom: 0;
    font-size: 17px;
    padding: 8px 0;
    text-transform: uppercase;
  }
  button{
    border: none;
    border-radius: 0;
    outline: none;
    background-color: #ED9D03;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 17px;
    padding: 8px 12px;
    svg{
      vertical-align: text-top;
      margin-right: 5px;
    }
  }
`;


export default SuperAdminStrip;
