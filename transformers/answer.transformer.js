export default function answerTransformer(answer) {
  return {
    ...answer,
    id: answer.answerId,
    text: answer.answerText,
    author: {
      id: answer.authorId,
      name: answer.authorName,
      picture: answer.authorProfileUrl,
      title: answer.title,
      department: answer.department,
    },
    labels: answer.labels || [],
    createdAt: answer.answerCreatedAt,
    isFavorite: answer.isFavorite === "True" ? true : false,
    views: answer.answerViews,
    isFlagged: answer.isFlagged === "True" ? true : false,

    currentReaction: {
      isUpVote: answer?.currentReaction?.upVote === "True" ? true : false,
      isDownVote: answer?.currentReaction?.downVote === "True" ? true : false,
      isSmileyFace:
        answer?.currentReaction?.smileyFace === "True" ? true : false,
      isPartyingFace:
        answer?.currentReaction?.partyingFace === "True" ? true : false,
      isRaisedHands:
        answer?.currentReaction?.raisedHands === "True" ? true : false,
    },
    top3: answer.reactionCount
      ? Object.keys(answer?.reactionCount)
          .map((item) => {
            return {
              key: item,
              value: answer.reactionCount[item],
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

    SelectedReaction: SelectedReactionFinder(answer.currentReaction),
  };
}

const SelectedReactionFinder = (currentReaction) => {
  for (const i in currentReaction) {
    if (currentReaction[i] === "True") {
      return i.toString();
    }
  }
};
