import React, { useState } from "react";
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

export default function ExpandableUserActivity({ data, idx, dateFilter }) {
  const { user } = data;
  const { team } = useTeam();
  const [open, setOpen] = useState(data.expanded);
  const queryClient = useQueryClient();

  return (
    <div>
      <Header
        onClick={() => {
          queryClient.setQueryData(
            ["user-activity", team?.id, dateFilter],
            (old) => {
              // console.log(old);
              return {
                ...old,
                pages:
                  old?.pages?.map((page) => ({
                    ...page,
                    data: page.data?.map((u) => {
                      // console.log(u.userId)
                      // console.log(data.userId)
                      return u.userId === data.userId
                        ? { ...u, expanded: !open }
                        : u;
                    }),
                  })) ?? old?.pages,
              };
            }
          );
          setOpen(!open);
        }}
        aria-expanded={open}
        aria-controls={`user-activity${idx}`}
      >
        {open ? (
          <IoRemoveCircleSharp color="#81C2C0" size={34} />
        ) : (
          <IoAddCircleSharp color="#81C2C0" size={34} />
        )}
        <Wrapper>
          {user?.picture && (
            <Item style={{ minWidth: "30%" }}>
              <Image src={user.picture} alt={user.firstName} />
            </Item>
          )}
          <Item style={{ minWidth: "70%", textAlign: "left" }} className="ms-3">
            <Name>{user.firstName}</Name>

            <Sub>
              {user?.title}
              {user?.title && user?.department && "  |  "}
              {user?.department}
            </Sub>
          </Item>
        </Wrapper>
      </Header>
    </div>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0 !important;
  width: 100%;
`;

const Item = styled.div``;

const Sub = styled.div`
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  color: #1f5462;
`;

const Image = styled.img`
  min-width: 50px;
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  border: 0.5px solid #003647;
`;

const Name = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 19px;
  color: #1f5462;
`;
