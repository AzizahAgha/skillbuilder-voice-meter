import React from "react";
import QuestionCard from "./QuestionCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled from "styled-components";

const StyledCarousel = styled.div`
  .related-question {
    z-index: 99999;
    min-width: 300px;
  }

  ul {
    padding: 0;
  }
`;

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 2,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default function Questions({ data = [] }) {
  return (
    <StyledCarousel>
      <Carousel
        ssr
        responsive={responsive}
        arrows={true}
        swipeable={true}
        draggable={true}
        keyBoardControl={true}
        itemClass="related-question"
        autoPlay={false}
        infinite
        //removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {data?.map((question, idx) => (
          <QuestionCard key={idx} question={question} />
        ))}
      </Carousel>
    </StyledCarousel>
  );
}

// .react-multi-carousel-item{
//   max-width: 230px;
//   min-width:230px;
// }
