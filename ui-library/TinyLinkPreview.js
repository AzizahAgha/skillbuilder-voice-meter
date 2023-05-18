import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import axios from 'axios';
import LinkPreviewCard from './LinkPreviewCard';
import { Image } from 'react-bootstrap';

export default function TinyLinkPreview({ url }) {

  const { data, isLoading, isError } = useQuery(url, 
    () => axios.get('/api/metadata', { params: { url } }).then(res => res.data),
    { refetchOnMount: false }
  )
  


  return (!isError && !isLoading && data) ? (
    <a href={url} target='_blank' rel="noreferrer" onClick={(e) => e.stopPropagation()}>
      <Wrapper>
      {data?.logo?.url &&  <Image src={data?.logo?.url} alt="" />}
        <span>{data.metadata.title}</span>

        <div className='preview'> 
          <LinkPreviewCard
            url={url}
            title={data.metadata.title}
            description={data.metadata.description}
            image={data.metadata.image}
            logo={data?.logo?.url}
            source={data.metadata.source}
          />
        </div>
      </Wrapper>
    </a>
  ) : null
}

const Wrapper = styled.div`
  border: 1px solid #C4C4C4;
  border-radius: 5px;
  padding: 4px 7px;
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
  margin-top: 2px;
  position: relative;

  img {
    height: 18px;
    width: 18px;
    object-fit: cover;
    margin-right: 6px;
    border-radius: 2px;
  }

  span {
    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: #393D3E;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover > .preview {
    display: block;
  }

  .preview {
    display: none;
    position: absolute;
    bottom: 14px;
  }
`
