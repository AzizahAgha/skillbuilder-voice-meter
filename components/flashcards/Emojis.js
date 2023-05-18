import React, { useState } from "react";
import { useTeam } from "@contexts/TeamContext";
import { useMutation } from "react-query";
import flashcardService from "@services/flashcard.service";
import EmojiPalette from "@ui-library/EmojiPalette";
import Bus from "@utils/Bus";

const Emojis = ({ data, refetchFlashcard }) => {
  const { team } = useTeam();
  const [showReaction, setshowReaction] = useState(false);
  const toggleShowReaction = () => setshowReaction(!showReaction);

  const removeReactionMutation = useMutation(
    ({ teamId, flashId }) => flashcardService.removeReaction(teamId, flashId),
    {
      onSuccess: () => {
        refetchFlashcard && refetchFlashcard();
      },
      onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
    }
  );

  const addReactionMutation = useMutation(
    ({ teamId, flashId, data }) =>
      flashcardService.addReaction(teamId, flashId, data),
    {
      onSuccess: () => {
        refetchFlashcard && refetchFlashcard();
      },
      onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
    }
  );

  const sendReaction = (number) => {
    addReactionMutation.mutate({
      teamId: team?.id,
      flashId: data?.flashId,
      data: { reaction: number, userId: data?.createdById },
    });
    setshowReaction(false);
  };

  const removeCurrentReaction = () => {
    removeReactionMutation.mutate({
      teamId: team?.id,
      flashId: data?.flashId,
    });
    showReaction && setshowReaction(false);
  };

  return (
    <>
      {data && (
        <EmojiPalette
          data={data}
          removeCurrentReaction={removeCurrentReaction}
          sendReaction={sendReaction}
          showReaction={showReaction}
          toggleShowReaction={toggleShowReaction}
          setshowReaction={setshowReaction}
        />
      )}
    </>
  );
};

export default Emojis;
