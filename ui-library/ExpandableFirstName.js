import React, { useState } from 'react';
import styled from "styled-components";
import { IoAddCircleSharp, IoRemoveCircleSharp } from "react-icons/io5";
import { useQueryClient } from "react-query";
import { useRouter } from 'next/router';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
`;

const Span = styled.span`
  margin-left: 10px;
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #393D3E;
`;

export default function ExpandableFirstName({ data, idx }) {

  const router = useRouter();
  const [open, setOpen] = useState(data.expanded);
  const queryClient = useQueryClient();

  return (
    <div>
      <Header
        onClick={() => {
          queryClient.setQueryData(["allUsers", router.query?.teamId], (old) => ({
            ...old,
            data: {
              teamUsers: old?.data.teamUsers?.map(u => u.userId === data.userId ? { ...u, expanded: !open } : u)
            }
          }));
          setOpen(!open)
        }
        }
        aria-expanded={open}
        aria-controls={`users${idx}`}
      >
        {open ? <IoRemoveCircleSharp color="#003647" size={29} /> : <IoAddCircleSharp color="#003647" size={29} />}
        <Span>{data.firstName}</Span>
      </Header>

    </div>
  );
}

