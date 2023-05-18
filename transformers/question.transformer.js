export default function questionTransformer(question) {
  return {
    ...question,
    id: question.questionId || question.id,
    text: question.questionText,
    author: {
      id: question.questionAuthorId,
      name: question.questionAuthorName,
      picture: question.authorProfileUrl || question.questionAuthorProfileUrl,
      title: question.title,
      department: question.department,
    },
    createdAt: question.questionCreatedAt,
    isFavorite:
      typeof question.isFavorite === "boolean"
        ? question.isFavorite
        : question.isFavorite === "True",
    labels: question.questionLabels ?? [],
    qLabels: question?.questionLabels?.join(" ") ?? "",
    aLabels: ""
  };
}
