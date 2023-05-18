import React, { useState } from "react";
import MergedHistoryPopup from "@components/questionMerge/MergedHistoryPopup";
import { useTeam } from "@contexts/TeamContext";
import { Button } from "react-bootstrap";
import { MdOutlineHistory } from "react-icons/md";

export default function AnswerSerialNumber({ mergeId }) {
  const { team } = useTeam();
  const [showMergedHistoryPopup, setShowMergedHistoryPopup] = useState(false);

  return (
    <>
      <MergedHistoryPopup
        show={showMergedHistoryPopup}
        setShow={setShowMergedHistoryPopup}
        teamId={team?.id}
        mergeId={mergeId}
        mergeType="Answer"
      />
      <Button variant="default" onClick={() => setShowMergedHistoryPopup(true)}>
        <MdOutlineHistory color="#969C9D" size={20} />
      </Button>
    </>
  );
}
