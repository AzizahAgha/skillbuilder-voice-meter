import React, { useState, useEffect } from "react";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { getPageFromWebflow, createReactPageFromHTML } from "@utils/helpers";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import styled from "styled-components";
import {
  Col,
  Container,
  Row,
  InputGroup,
  Button as BsButton,
} from "react-bootstrap";
import FlashCard from "@components/flashcards/FlashCard";
import CreateFlashCard from "@ui-library/CreateFlashCard";
import { useTeam } from "@contexts/TeamContext";
import FlashcardFilter from "@components/filters/FlashcardFilters";
import { GetAllFlashcards } from "@components/queries/getAllFlashcards";
import { GetFlashcardHeaderDetails } from "@components/queries/getFlashcardHeaderDetails";
import BsDropdown from "react-bootstrap/Dropdown";
import { useAppContext } from "@contexts/AppContext";
import { DebounceInput } from "react-debounce-input";
import { IoSearchOutline } from "react-icons/io5";
import Tooltip from "@ui-library/Tooltip";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useRouter } from "next/router";
import { useAuthUser } from "@contexts/AuthContext";

export function Learn() {
  const { team } = useTeam();
  const router = useRouter();
  const { auth: { user: { isAdmin } = {} } = {} } = useAuthUser();
  const { setSelection } = useAppContext();
  const [filters, setFilters] = useState(undefined);
  const [sortOn, setSort] = useState("createdAt");
  const [sortBy, setSortBy] = useState("ASC");
  const [isToggle, setiIsToggle] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data, refetch: refetchFlashcard } = GetAllFlashcards({
    teamId: team?.id,
    filters: filters,
    sortOn: sortOn,
    sortBy: sortBy,
    searchString: searchKeyword,
  });

  const { data: dataHeader } = GetFlashcardHeaderDetails({ teamId: team?.id });

  useEffect(() => {
    setSelection({});

    if (document.addEventListener) {
      document.addEventListener(
        "flashcard-notification-click",
        refetchFlashcard,
        false
      );
    } else {
      document.attachEvent("flashcard-notification-click", refetchFlashcard);
    }
  }, []);

  useEffect(() => {
    if (isToggle) {
      setSortBy("DESC");
    } else {
      setSortBy("ASC");
    }
  }, [isToggle]);

  const setSearchString = (value) => {
    setSearchKeyword(value);
    refetchFlashcard();
  };

  return (
    <div className="bs">
      <DetailPageHeader />
      <Container>
        <Row>
          <WelcomeHeader>Welcome to Learn Mode</WelcomeHeader>
        </Row>
        <Row>
          <IntroText>
            <b>How it works?</b>
          </IntroText>
        </Row>
        <Row>
          <IntroText>
            Easy way to build sets of flashcards to review the factors that
            change your business. Simply click on create new set, add questions,
            and get started. Click here to view an introductory video!
          </IntroText>
        </Row>

        <br />
        <Row>
          <StyledNote>
            Note: Your favorites(starred) will automatically appear in the
            &quot;Favorites&quot; set while any questions and related answers
            can be created as a set by clicking the &quot;Create New Set&quot;
            button.
          </StyledNote>
        </Row>

        <Row>
          <Col>
            <FlashcardFilter
              onFiltersChange={setFilters}
              searchKeyword={searchKeyword}
              sortOn={sortOn}
              sortBy={sortBy}
              isToggle={isToggle}
              setSort={setSort}
              setSortBy={setSortBy}
              setiIsToggle={setiIsToggle}
              refetchFlashcard={refetchFlashcard}
            />
            <span className="mx-1" />
          </Col>
          <Col>
            <CreateFlashCardButton
              onClick={() => router.push(`/flashcards/${0}`)}
            >
              + Create New Set
            </CreateFlashCardButton>
          </Col>
          <Col>
            <StyledInputSearchGroup>
              <InputGroup.Text>
                <IoSearchOutline color="#003647" size={20} />
              </InputGroup.Text>

              <Input
                type="search"
                minLength={2}
                debounceTimeout={300}
                value={searchKeyword}
                onChange={(e) => setSearchString(e.target.value)}
                placeholder="Search"
                className="form-control"
              />

              {searchKeyword && (
                <Tooltip text="Clear" placement="right">
                  <ClearButton
                    variant="default"
                    onClick={() => setSearchKeyword("")}
                  >
                    <IoIosCloseCircleOutline color="#969C9D" size={20} />
                  </ClearButton>
                </Tooltip>
              )}
            </StyledInputSearchGroup>
          </Col>
        </Row>
        <br />
        <br />
        <br />
        <Row>
          <Info>
            {dataHeader?.totalFlashcardSets} Flashcard sets
            <span className="mx-2">|</span>
            {dataHeader?.totalFlashcardsQuestions} Questions
            <span className="mx-2">|</span>
            {dataHeader?.totalFlashcardContributors} Contributors
          </Info>
        </Row>

        <Row>
          {data?.data?.map((flashcard, idx) => (
            <React.Fragment key={idx}>
              {flashcard?.status !== "Archive" ? (
                <Col className="col-12 col-lg-4 mb-4" key={idx}>
                  <FlashCard
                    data={flashcard}
                    refetchFlashcard={refetchFlashcard}
                  />
                </Col>
              ) : isAdmin ? (
                <Col className="col-12 col-lg-4 mb-4" key={idx}>
                  <FlashCard
                    data={flashcard}
                    refetchFlashcard={refetchFlashcard}
                  />
                </Col>
              ) : null}
            </React.Fragment>
          ))}

          <Col className="col-12 col-lg-4 mb-4">
            <CreateFlashCard />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const WelcomeHeader = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 60px;
  color: #003647;
`;

const IntroText = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 30px;
  /* identical to box height, or 200% */
  letter-spacing: 0.02em;
  color: #393d3e;
`;

const StyledNote = styled.div`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 25px;
  letter-spacing: 0.02em;
  margin-bottom: 1rem;
  color: #393d3e;
`;

const Info = styled.p`
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #003647;
`;

const OptionsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Dropdown = styled(BsDropdown)`
  &&& {
    font-family: "Barlow Condensed";
    font-style: normal;
  }
`;

const DropdownToggled = styled(Dropdown.Toggle)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: #003647;
    font-family: "Barlow Condensed", sans-serif;

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:after {
      content: none;
    }

    &.btn-primary.dropdown-toggle {
      color: #003647;
      background-color: transparent;
      border-color: #003647;
      width: 100%;
      text-align: inherit;
    }

    &.btn-primary.dropdown-toggle:hover {
      color: #fff;
      background-color: #003647;
    }
  }
`;
const StyledInputSearchGroup = styled(InputGroup)`
  &&& {
    width: fit-content;
    margin-left: 0.5rem;
    color: #003647;
    font-family: "Barlow Condensed", sans-serif;
    border: 0.5px solid #003647;
    border-radius: 0.25rem;
    .input-group-text {
      background: none;
      border: none;
      padding: 0.375rem 0.5rem;
    }
  }
`;

const Input = styled(DebounceInput)`
  &&& {
    border: none;
    padding-left: 0;
    margin-right: 150px;
  }
`;

const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
  }
`;
const CreateFlashCardButton = styled(BsButton)`
  &&& {
    background: #81c2c0;
    border: 1px solid #81c2c0;
    border-radius: 5px;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #ffffff;
    float: right;
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

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <Learn />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/learn");

  return {
    props: { HEAD, BODY },
  };
}

export default function LearnPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
