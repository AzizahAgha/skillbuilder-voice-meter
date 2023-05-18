import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Title from '@ui-library/FilterComponentTitle';
import CheckboxFieldArray from '@ui-library/CheckboxFieldArray';
import { useQuery } from 'react-query';
import authorService from '@services/author.service';
import { useTeam } from '@contexts/TeamContext';

export default function Authors({ type }) {
  const { team } = useTeam();

  const { data } = useQuery(
    ['authors', { team, type }], 
    () => authorService.getAll({ 
      teamId: team.id,
      type: (type === 'answers') ? 'answer' : 'question'
    }),
    { initialData: [] }
  );

  return (
    <>
      <Row>
        <Col>
          <Title>Authors</Title>
        </Col>
      </Row>
      <Row xs={1} sm={2} lg={2} className='mb-4'>
        <CheckboxFieldArray
          name={`${type}ByAuthors`}
          fields={data?.map((author) => ({
            value: author.id, 
            label: author.name, 
            id: `${type}-${author.id}`
          }))}
        />
      </Row>
    </>
  )
}
