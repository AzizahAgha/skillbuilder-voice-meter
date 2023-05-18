import React, { useState } from 'react';
import styled from "styled-components";
import { IoAddCircleSharp, IoRemoveCircleSharp } from "react-icons/io5";
import moment from "moment";
import { useQueryClient } from "react-query";
import { useTeam } from "@contexts/TeamContext";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
`;

const Span = styled.span`
  margin-left: 10px;
`;

export default function ExpandableIssueDate({ data, idx, onChange }) {

  const { team } = useTeam();
  const [open, setOpen] = useState(data.expanded);
  const queryClient = useQueryClient();

  return (
    <div>
      <Header
        onClick={() => {
          queryClient.setQueryData(["team-invoices", team?.id], (old) => ({
            ...old,
            pages:
              old?.pages?.map((page) => ({
                ...page,
                data: page.data?.map((q) =>
                  q.id === data.id
                    ? { ...q, expanded: !open }
                    : q
                ),
              })) ?? old?.pages,
          }));
          setOpen(!open)
        }}
        aria-expanded={open}
        aria-controls={`invoices${idx}`}
      >
        {open ? <IoRemoveCircleSharp color="#81C2C0" size={34} /> : <IoAddCircleSharp color="#81C2C0" size={34} />}
        <Span>{moment(data.issueDate).format("MMM DD, YYYY")}</Span>
      </Header>

    </div>
  );
}

