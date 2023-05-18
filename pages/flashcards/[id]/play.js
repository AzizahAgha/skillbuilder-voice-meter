import React, { useState } from "react";
import QuestionCard from "@components/flashcards/QuestionCard";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import { Button as BsButton, Container, Row, Col } from "react-bootstrap";
import flashcardService from "@services/flashcard.service";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/router";
import { useTeam } from "@contexts/TeamContext";
import styled from "styled-components";
import Bus from "@utils/Bus";
import TokensContextProvider from "@contexts/TokensContext";

import {
	FaChevronCircleLeft,
	FaChevronCircleRight,
	FaRedo,
	FaTimes,
} from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Button = styled(BsButton)`
	&&& {
		background: rgba(31, 84, 98, 0.2);
		border: 1px solid #003647;
		border-radius: 5px;
		font-family: "Barlow Condensed", sans-serif;
		font-style: normal;
		font-weight: 500;
		color: #003647 !important;
		float: right;
		&:hover,
		&:active,
		&:focus {
			color: #ffffff !important;
			background: #003647;
			border-color: #003647;
			outline: none;
			box-shadow: none;
		}
	}
`;

const FlipButton = styled(BsButton)`
	&&& {
		background: #81c2c0;
		border: 1px solid #81c2c0;
		border-radius: 5px;
		font-family: "Barlow Condensed", sans-serif;
		font-style: normal;
		font-weight: 500;
		color: #ffffff;
		&:hover,
		&:active,
		&:focus {
			background: #8ed0ce;
			border-color: #8ed0ce;
			outline: none;
			box-shadow: none;
		}
	}
`;

const StyledText = styled.p`
	font-family: "Barlow Condensed", sans-serif;
	font-weight: 600;
	font-size: 50px;
	text-align: center;
	color: #1f5462;
	margin-top: 25px !important;
`;

const StyledSubText = styled.p`
	font-family: "Manrope", sans-serif;
	font-weight: 700;
	font-size: 16px;
	text-align: center;
	color: #393d3e;
	margin: 24px 0 !important;
`;

const StyledContainer = styled.div`
	max-width: 840px !important;
	margin: 0 auto;
	padding: 0 50px;
	position: relative;
	margin-bottom: 20px;
	.react-multi-carousel-track {
		padding-left: 0;
		margin: 2rem 0;
	}
	.answerComponent {
		@media (max-width: 992px) {
			flex-wrap: wrap;
		}
	}
	.labelsWrap {
		flex-basis: 100%;
		margin-top: 10px;
	}
	@media (max-width: 1200px) {
		max-width: 780px !important;
	}
	@media (max-width: 768px) {
		max-width: 100% !important;
		padding: 0;
	}
`;

const StyledCarousalBtnGrp = styled.div`
	position: absolute;
	top: calc(50% - 25px);
	left: 0;
	right: 0;
	transform: translateY(-50%);
`;

const CarousalbuttonStyles = styled.div`
	outline: 0;
	z-index: 1000;
	border: 0;
	opacity: 1;
	cursor: pointer;
	display: flex;
	align-items: center;
	position: absolute;
	span {
		display: block;
		max-width: 68px;
		color: #1f5462;
		font-family: "Manrope", sans-serif;
		font-weight: normal;
		font-size: 16px;
		text-align: center;
		margin: 0 15px;
		@media (max-width: 899px) {
			display: none;
		}
	}
`;

const StyledCarousalPrevBtn = styled(CarousalbuttonStyles)`
	&&& {
		left: -12%;
		@media (max-width: 992px) {
			left: -8%;
		}
		@media (max-width: 899px) {
			left: 30px;
		}
	}
`;
const StyledCarousalNxtBtn = styled(CarousalbuttonStyles)`
	&&& {
		right: -12%;
		@media (max-width: 992px) {
			right: -8%;
		}
		@media (max-width: 899px) {
			right: 30px;
		}
	}
`;

const responsive = {
	desktop: {
		breakpoint: { max: 3000, min: 1024 },
		items: 1,
		slidesToSlide: 1,
	},
	tablet: {
		breakpoint: { max: 1024, min: 464 },
		items: 1,
		slidesToSlide: 1, // optional, default to 1.
	},
	mobile: {
		breakpoint: { max: 464, min: 0 },
		items: 1,
		slidesToSlide: 1, // optional, default to 1.
	},
};

export function PlayFlashCard() {
	const router = useRouter();

	const [counter, setCounter] = useState(1);
	const [flashcardData, setFlashcardData] = useState({});
	const [questionCount, setQuestionCount] = useState(0);
	const [allquestionsData, setQuestionsData] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [toggleMode, setToggleMode] = useState(false);

	const [slides, setSlides] = useState([]);

	const [flashcardaccess, setflashcardaccess] = useState(true);
	const [errorMessage, seterrorMessage] = useState("");

	const { team } = useTeam();
	// Question Data query with flashcard api response in sucess block
	useQuery(
		["flashcard-questions"],
		() =>
			flashcardService.playflashcard({
				teamId: team?.id,
				flashcardSetId: router.query.id,
				userId: router.query.c !== undefined ? router.query.c : "",
			}),
		{
			enabled: team?.id ? true : false,
			onSuccess: (data) => {
				if (data.status == "Archive") {
					seterrorMessage(data.message);
					setflashcardaccess(false);
					return;
				}
				setFlashcardData(data);
				if (data?.questionsData) {
					if (data?.questionsData.length > 0) {
						const transformed = data.questionsData.map(
							({
								questionId: id,
								questionAuthorId: authorId,
								questionAuthorName: name,
								questionText: text,
								frequency: frequency,
								importance: importance,
								priority: priority,
								questionLabels: labels,
								created_at: createdAt,
								authorProfileUrl: picture,
								status: status,
								mergeId:mergeId
							}) => ({
								id,
								authorId,
								name,
								text,
								frequency,
								importance,
								priority,
								labels,
								createdAt,
								picture,
								status,
								mergeId
							})
						);
						setQuestionsData(transformed);
					}
					setQuestionCount(data.questionsData.length);
					setIsLoaded(true);
					for (const question of allquestionsData) {
						setSlides((current) => [...current, question.id]);
					}
					flashcardLogMutation.mutate({
						newdata: {
							action: "flashcard",
							questionId: "",
							answerId: "",
						},
					});
				}
			},
			onError: (error) => {
				setflashcardaccess(false);
				seterrorMessage(error.message);
				Bus.emit("error", { operation: "open",error:error.response});
			},
		}
	);

	const flashcardLogMutation = useMutation(
		({ data }) =>
			flashcardService.addlogflashcard({
				teamId: team?.id,
				flashcardSetId: router.query.id,
				data,
			}),
		{
			onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
		}
	);

	const ButtonGroup = ({ next, previous, goToSlide, ...rest }) => {
		const {
			carouselState: { currentSlide },
		} = rest;
		setCounter(currentSlide + 1);
		return (
			<StyledCarousalBtnGrp>
				<StyledCarousalPrevBtn
					className={currentSlide === 0 ? "d-none" : ""}
					onClick={() =>
						previous(
							goToSlide(currentSlide - 1),
							setToggleMode(false)
						)
					}
				>
					<span>Previous Question</span>
					<FaChevronCircleLeft color="#1F5462" size={26} />
				</StyledCarousalPrevBtn>
				<StyledCarousalNxtBtn
					className={
						currentSlide + 1 === questionCount ? "d-none" : ""
					}
					onClick={() =>
						next(goToSlide(currentSlide + 1), setToggleMode(false))
					}
				>
					<FaChevronCircleRight color="#1F5462" size={26} />
					<span>Next Question</span>
				</StyledCarousalNxtBtn>
			</StyledCarousalBtnGrp>
		);
	};

	return (
		<>
			<div className="bs">
				<TokensContextProvider>
					<DetailPageHeader />
					<Container>
						<Row>
							<Col>
								<Button
									variant="secondary"
									onClick={() => router.push(`/flashcards/learn`)}
								>
									Exit Play Mode <FaTimes size={12} />
								</Button>
							</Col>
						</Row>
						{isLoaded && flashcardaccess && (
							<>
								<StyledText>
									{flashcardData?.flashcardSets?.setTitle}
								</StyledText>
								{allquestionsData.length > 0 ? (
									<>
										<StyledSubText>
											Question {counter} / {questionCount}
										</StyledSubText>

										<StyledContainer>
											<Carousel
												ssr
												responsive={responsive}
												partialVisbile={false}
												centerMode={false}
												arrows={false}
												renderButtonGroupOutside={true}
												customButtonGroup={<ButtonGroup />}
												swipeable={true}
												draggable={true}
												keyBoardControl={true}
												itemClass="flipcard-question"
												autoPlay={false}
												afterChange={(
													nextSlide,
													{ currentSlide, onMove }
												) => {
													flashcardLogMutation.mutate({
														newdata: {
															action: "question",
															questionId:
																slides[
																	currentSlide
																],
															answerId: "",
														},
													});
												}}
											>
												{allquestionsData.map(
													(question) => (
														<QuestionCard
															key={
																question.questionId
															}
															question={question}
															toggleMode={toggleMode}
														/>
													)
												)}
											</Carousel>
										</StyledContainer>
										<StyledContainer className="d-flex justify-content-center">
											<FlipButton
												onClick={() =>
													setToggleMode(!toggleMode)
												}
											>
												<FaRedo size={12} />{" "}
												{toggleMode
													? "Flip to Questions"
													: "Flip to Answers"}
											</FlipButton>
										</StyledContainer>
										<div className="mt-5 pb-5"></div>
									</>
								) : (
									<div className="text-center mt-5 mb-5">
										No Questions added to flashcard.
									</div>
								)}
							</>
						)}
						{!flashcardaccess && (
							<div className="text-center mt-5 mb-5">
								{errorMessage}
							</div>
						)}
					</Container>
				</TokensContextProvider>
			</div>
		</>
	);
}

const instructions = {
	replace: (domNode) => {
		if (domNode.attribs && domNode.attribs.id === "detail") {
			return <PlayFlashCard />;
		}
		if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
			return <HeaderSessionWidget />;
		}
	},
};

export async function getStaticPaths() {
	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: "blocking", //indicates the type of fallback
	};
}

export async function getStaticProps() {
	const { BODY, HEAD } = await getPageFromWebflow("/flashcard");

	return {
		props: { HEAD, BODY },
	};
}

export default function FlashCardPage({ HEAD, BODY }) {
	return (
		<>
			<Head>{createReactPageFromHTML(HEAD)}</Head>
			<>{createReactPageFromHTML(BODY, instructions)}</>
		</>
	);
}
