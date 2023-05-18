import React, { useState } from "react";
import styled from "styled-components";
import { Button as BsButton, Modal } from "react-bootstrap";
import { useAuthUser } from "@contexts/AuthContext";
import { useTeam } from "@contexts/TeamContext";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import teamService from "@services/team.service";
import { useRouter } from "next/router";

export default function LeaveOrDelete() {
  const router = useRouter();
  const { auth, handlelogout, refetchAuthUser } = useAuthUser();
  const { team, refetchTeam, setTeam } = useTeam();

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  return (
    <div className="mb-5">
      <Leave_Delete_text>
        By leaving the team, you will lose access to all projects.
      </Leave_Delete_text>
      <Leave_Delete_text>
        Deleting the team will irreveribily remove all its boards and disbands
        users. You might want to export or save backups of your boards.
      </Leave_Delete_text>

      <Button variant="outline-primary" size="lg" onClick={handleShow1}>
        Leave Team
      </Button>
      <Modal show={show1} onHide={handleClose1} className="bs" centered>
        <Modal.Body style={{ padding: 0 }}>
          <ConfirmAlert
            title="Leave Team"
            message={`Are you sure you want to Leave team, ${team?.displayName}?`}
            doneLabel="Leave"
            onDone={() => {
              teamService
                .leave({
                  teamId: team?.id,
                  userId: auth?.user?.id,
                })
                .then(async (res) => {
                  if (res.is_team) {
                    handlelogout(() => setTeam(null)).then(() => router.push("/"));
                  } else {
                    await setTeam(res.teamInfo[0]);
                    await refetchAuthUser();
                    await router.push("/detail");
                  }
                })
                .catch(console.error);
            }}
            onCancel={handleClose1}
          />
        </Modal.Body>
      </Modal>

      <Button variant="outline-danger" size="lg" onClick={handleShow2}>
        Delete Team
      </Button>

      <Modal show={show2} onHide={handleClose2} className="bs" centered>
        <Modal.Body style={{ padding: 0 }}>
          <ConfirmAlert
            title="Delete Team"
            message={`Are you sure you want to DELETE your team ${team?.name}?`}
            doneLabel="Delete"
            onDone={() => {
              teamService
                .delete(team.id)
                .then(async (res) => {
                  if (res.is_team) {
                    handlelogout(() => setTeam(null)).then(() => router.push("/"));
                  } else {
                    await refetchAuthUser();
                    await setTeam(auth?.user?.lastTeamVisitedId);
                    await router.push("/detail");
                  }
                })
                .catch(console.error);
            }}
            onCancel={handleClose2}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

const Leave_Delete_text = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: 0.02em;
  margin-bottom: 1rem;

  color: #393d3e;
`;

const Button = styled(BsButton)`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    margin-right: 1rem;

    @media (max-width: 576px) {
      & {
        width: 48%;
        margin-right: 0.5rem;
      }
    }
  }
`;
