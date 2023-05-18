export default function answerHistoryTransformer(data) {
  let modifiedObj = {};

  Object.entries(data).forEach((history) => {
    const keys = Object.keys(history[1]).reverse();

    const modifiedKeys = keys
      .map((key) => {
        const popularCounts = history[1][key].map((version) =>
          Number(version.mostPopular)
        );
        const mostPopularIndex = popularCounts.indexOf(
          Math.max(...popularCounts)
        );

        const upvoteCounts = history[1][key].map((version) =>
          Number(version.mostUpvoted)
        );
        const mostUpvotedIndex = upvoteCounts.indexOf(
          Math.max(...upvoteCounts)
        );

        return history[1][key].map((version, idx) => ({
          id: version.versionId,
          month: version.month.trim(),
          author: {
            id: version.authorId,
            name: version.authorName,
            picture: version.authorProfile,
          },
          upvotes: version.mostUpvoted,
          views: version.mostViews,
          popular: version.mostPopular,
          isMostPopular: mostPopularIndex === idx,
          isMostUpvoted: mostUpvotedIndex === idx,
          createdAt: version.createdat,
          isMerged: version.is_merged,
          mergeId: version.merge_id,
        }));
      })
      .filter((ver) => ver.length);

    modifiedObj[`${history[0]}`] = modifiedKeys;
  });

  return modifiedObj;
}
