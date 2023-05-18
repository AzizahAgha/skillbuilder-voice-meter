import React, { useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import LoginInWarning from "@ui-library/LoginInWarning";
import Tooltip from "@ui-library/Tooltip";
import { useMutation } from "react-query";
import teamService from "@services/team.service";
import { useTeam } from "@contexts/TeamContext";
import { useAuthUser } from "@contexts/AuthContext";
import styled from "styled-components";
import Bus from "@utils/Bus";

export default function TableFooter({
  onAdd,
  questions,
  onWarningDismiss,
  // showFooter,
}) {
  const [warningVisible, setWarningVisible] = useState(questions.length === 20);
  const { setTeam } = useTeam();
  const { auth } = useAuthUser();

  const teamMutation = useMutation((teamData) => teamService.create(teamData), {
    onSuccess: (data) => {
      setTeam(data);
    },
    onError:(error) => {
      Bus.emit("error", { operation: "open",error:error.response});
    }
  });

  const onLoginSuccess = () => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");
    teamMutation.mutate({ teamName, displayName });
  };
  // if (showFooter === false) {
  //   return null;
  // } else {
  return (
    <div style={{ position: "relative" }}>
      <Tooltip text="Add Question">
        <button
          type="button"
          className="btn p-0"
          onClick={onAdd}
          disabled={questions.length >= 20 && !auth.isAuthenticated}
        >
          <IoAddCircleSharp color="#81C2C0" size={34} />
        </button>
      </Tooltip>

      {warningVisible && !auth.isAuthenticated && (
        <StyledPopup>
          <LoginInWarning
            dismissWarning={() => {
              setWarningVisible(false);
              onWarningDismiss();
            }}
            onLoginSuccess={onLoginSuccess}
          />
        </StyledPopup>
      )}
    </div>
  );
  // }
}

const StyledPopup = styled.div`
  &&& {
    position: absolute;
    top: -228px;
    z-index: 1000;
  }
`;
