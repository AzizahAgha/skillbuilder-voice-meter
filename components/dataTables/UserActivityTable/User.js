import React from 'react'
import styled from 'styled-components';

export default function User({ user }) {
  return (
    <Wrapper>
      {user?.picture &&
        <Item>
          <Image src={user.picture} alt={user.firstName} />
        </Item>
      }
      <Item className='ms-3'>
        <Name>{user.firstName}</Name>

        <Sub>
          {user?.title}  
          {(user?.title && user?.department) && "  |  "}  
          {user?.department}
        </Sub>
      </Item>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: .75rem 0 !important;
`

const Item = styled.div`
`

const Sub = styled.div`
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
  color: #1F5462;
`

const Image = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  border: 0.5px solid #003647;
`

const Name = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 19px;
  color: #1F5462;
`
