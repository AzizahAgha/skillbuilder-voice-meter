import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CardsAnswer from './CardsAnswer';

export default function CardsAnswerWrapper({ data, searchKeyword, question }) {

  const [answers, setAnswers] = useState(data);

  useEffect(() => setAnswers(data), [data])

  const updateData = useCallback((rowIndex, columnId, value) => {
    setAnswers(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }, [])

  const memoSearchKeyword = useMemo(() => searchKeyword, [searchKeyword])

  return (
    <>
      {answers.map((answer, index) => <CardsAnswer
        index={index}
        lastItem={index === answers.length - 1}
        key={answer.answerId}
        answer={answer}
        searchKeyword={memoSearchKeyword}
        updateData={updateData}
        question={question}
      />
      )}
    </>
  );
}
