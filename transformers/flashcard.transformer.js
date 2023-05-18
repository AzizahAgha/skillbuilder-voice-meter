export default function answerTransformer(flashcard) {
  return {
    ...flashcard,
    isFavorite: flashcard.isFavorite === "True" ? true : false,
    isFlagged: flashcard.isFlagged === "True" ? true : false,
    currentReaction: {
      isUpVote: flashcard?.currentReaction?.upVote === "True" ? true : false,
      isDownVote:
        flashcard?.currentReaction?.downVote === "True" ? true : false,
      isSmileyFace:
        flashcard?.currentReaction?.smileyFace === "True" ? true : false,
      isPartyingFace:
        flashcard?.currentReaction?.partyingFace === "True" ? true : false,
      isRaisedHands:
        flashcard?.currentReaction?.raisedHands === "True" ? true : false,
    },
    top3: flashcard.reactionCount
      ? Object.keys(flashcard?.reactionCount)
          .map((item) => {
            return {
              key: item,
              value: flashcard.reactionCount[item],
            };
          })
          .sort(function (a, b) {
            return b.value - a.value;
          })
      : [
          { key: "smileyFace", value: 0 },
          { key: "upVote", value: 0 },
          { key: "downVote", value: 0 },
        ],

    SelectedReaction: SelectedReactionFinder(flashcard.currentReaction),
  };
}

const SelectedReactionFinder = (currentReaction) => {
  for (const i in currentReaction) {
    if (currentReaction[i] === "True") {
      return i.toString();
    }
  }
};
