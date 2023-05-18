import React from "react";
import { Card as BsCard, Image } from 'react-bootstrap';
import styled from "styled-components";


export default function LinkPreviewCard({ url, title, description, image, source, logo }) {
  return (
    <Card className='link-preview-card'>
      <Card.Body>
        <div className="card-info">
          {logo && <Image src={logo} alt="" />}
          <h4>{source.replace(/.+\/\/|www.|\..+/g, '')}</h4>
        </div>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Img src={image} alt={title} />
    </Card>
  )
}

const Card = styled(BsCard)`
&&& {
  width: 360px;
  flex-direction: row;
  align-items: center;
  color: black;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
  z-index: 1;

  .card-img {
    margin: 1rem;
    object-fit: contain;
    width: 120px;
    height: 100%;
  }

  .card-title {
    font-family: Barlow Condensed;
    font-weight: 500;
    color: #003647;
  }

  .card-text {
    font-family: Manrope;
    font-weight: normal;
    color: #393D3E;
  }

  .card-info {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    img {
      height: 18px;
      width: 18px;
      object-fit: cover;
      margin-right: 6px;
      border-radius: 2px;
    }

    h4 {
      display: inline-block;
      font-size: 0.8rem;
      color: black;
    }

  }
}
`
