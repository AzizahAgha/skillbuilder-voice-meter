import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import SkillbuilderLogoDark from "@public/svgs/skillbuilder-logo-dark.svg";
import {
  Modal as BsModal,
  Spinner,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import SkillBuilderIcon from "@public/icons/skillbuilder-icon";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import { useRouter } from "next/router";
import Link from "next/link";
import inviteService from "@services/invite.service";
import { useTeam } from "@contexts/TeamContext";
import { useAuthUser } from "@contexts/AuthContext";
import { useQuery, useMutation } from "react-query";
import DocumentDownloadIcon from "@public/icons/document-download";
import PrinterIcon from "@public/icons/printer";
import AddUsersIcon from "@public/icons/add-users";

import {
  Wrapper,
  TeamName,
  OptionsWrapper,
  Info,
  Actions,
} from "@ui-library/DetailPageHeader";
import Auth0SignIn from "@ui-library/Auth0SignIn";
import teamService from "@services/team.service";
import Bus from "@utils/Bus";

export default function InviteVerificationPage() {
  const router = useRouter();
  const { setTeam } = useTeam();
  const { auth, refetchAuthUser, handlelogout } = useAuthUser();

  const [flag, setFlag] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const mutation = useMutation((teamId) => teamService.updateStatus(teamId));

  const inviteMutation = useMutation(({ teamId, token, type }) =>
    inviteService.addUser(teamId, token, type)
  );

  const Routing = (res) => {
    if (res.type === "Question") {
      setTeam(res.invitedTeam);
      mutation.mutate(res.invitedTeam.teamId);
      router.push(`/question/${res.invitedQuestion.id}?view=timeline`);
    }

    if (res.type === "Team") {
      setTeam(res.invitedTeam);
      mutation.mutate(res.invitedTeam.teamId);
      router.push("/detail");
    }

    if (res.type === "Flashcard") {
      setTeam(res.invitedTeam);
      mutation.mutate(res.invitedTeam.teamId);
      router.push(`/flashcards/${res.flashcardSetId}`);
    }
  };

  const inviteQuery = useQuery(
    ["invite", router.query],
    () => inviteService.get(router.query.token, { type: router.query.type }),

    {
      enabled: !!router.query?.token,
      onSuccess: (res) => {
        setFlag(true);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  useEffect(() => {
    refetchAuthUser().then((res) => {
      if (inviteQuery.status === "success") {
        if (res.status === "success") {
          //logged in
          if (inviteQuery.data.inviteStatus === "Accepted") {
            Routing(inviteQuery.data);
          } else {
            setTimeout(() => {
              handlelogout();
            }, 1600);
          }
        }
      }
    });
  }, [flag]);

  const onLogin = useCallback(() => {
    const invite = inviteQuery.data;
    const _team = invite.invitedTeam;

    if (invite.inviteStatus === "Invited") {
      inviteMutation
        .mutateAsync({
          teamId: _team.id,
          token: router.query.token,
          type: invite.type,
        })
        .then(() => {
          refetchAuthUser();
          setShowModal(false);
          setTeam(_team);

          if (invite.type === "Team") router.push("/detail");
          else if (invite.type === "Question")
            router.push(`/question/${invite.invitedQuestion.id}?view=timeline`);
          else if (invite.type === "Flashcard")
            router.push(`/flashcards/${invite.flashcardSetId}`);
        });
    } else if (invite.inviteStatus === "Accepted") {
      refetchAuthUser();
      Routing(invite);
    }
  }, [inviteQuery, inviteMutation, router, setTeam]);

  return (
    <>
      <Modal className="bs" show={showModal} size="md" centered>
        <Modal.Body>
          <div>
            <SignInCard>
              <Image src={SkillbuilderLogoDark.src} alt="Skillbuilder" />

              {!auth.isAuthenticated &&
              inviteQuery?.data?.inviteStatus === "Invited" ? (
                <p className="mt-4">
                  Login with Google, Facebook or Microsoft and you can edit,
                  add. Plus, you’ll be able to invite unlimited colleagues to
                  collaborate!
                </p>
              ) : (
                <p className="mt-4"></p>
              )}

              {(inviteQuery.isLoading || inviteMutation.isLoading) && (
                <SpinnerWrapper>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <div className="mt-1">
                    {inviteMutation.isLoading
                      ? "Adding You to the Team"
                      : "Validating Invite"}
                  </div>
                </SpinnerWrapper>
              )}

              {inviteQuery.isError && (
                <InviteText className="text-danger mt-5 fs-4">
                  Invalid Invite!
                </InviteText>
              )}

              {inviteMutation.isError && (
                <InviteText className="text-danger mt-5 fs-4">
                  {inviteMutation?.error?.response?.data?.message}
                </InviteText>
              )}

              <div>
                {!auth.isAuthenticated &&
                  (inviteQuery?.data?.inviteStatus === "Invited" ||
                    inviteQuery?.data?.inviteStatus === "Accepted") && (
                    <LoginGrid>
                      <Auth0SignIn callback={onLogin} />
                    </LoginGrid>
                  )}

                {inviteQuery.data &&
                  inviteQuery?.data?.inviteStatus !== "Invited" &&
                  inviteQuery?.data?.inviteStatus !== "Accepted" && (
                    <InviteText className="text-danger mt-5 fs-4">
                      Invalid Invite!
                    </InviteText>
                  )}
              </div>
            </SignInCard>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Link href="/" passHref>
            <a target="_blank" className="mx-auto text-decoration-none">
              <Button>
                <SkillBuilderIcon />
                <span className="ms-1">What is SkillBuilder?</span>
              </Button>
            </a>
          </Link>
        </Modal.Footer>
      </Modal>
      <Background className="bs">
        <Header team={inviteQuery.data?.invitedTeam} />
        <Image
          layout="fill"
          src={"/images/invite-page-blur-image.jpg"}
          alt="background"
        />
      </Background>
    </>
  );
}

const Header = ({ team }) => (
  <Wrapper className="mb-1">
    <Container>
      <Row className="py-4">
        <Col>
          <TeamName>{team?.teamDisplayName}</TeamName>
          <Info>
            {team?.questionsCount}{" "}
            {team?.questionsCount == 1 ? " Question" : " Questions"}
            <span className="mx-2">|</span>
            {team?.answersCount}{" "}
            {team?.answersCount == 1 ? " Answer" : " Answers"}
            <span className="mx-2">|</span>
            {team?.contributorsCount}{" "}
            {team?.contributorsCount == 1 ? " Contributor" : " Contributors"}
          </Info>
        </Col>
        <Col>
          <OptionsWrapper>
            <Actions>
              <DocumentDownloadIcon />
              <PrinterIcon className="mx-4" />
              <AddUsersIcon />
            </Actions>
          </OptionsWrapper>
        </Col>
      </Row>
    </Container>
  </Wrapper>
);

const SpinnerWrapper = styled.div`
  margin-top: 2.5rem;
`;

const Background = styled.div`
  width: 100%;
`;

const Modal = styled(BsModal)`
  &&& {
    .modal-content {
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
    }
  }
`;
const Button = styled(ButtonOutlined)`
  border-color: #81c2c0;
  color: #81c2c0;

  &:hover {
    border-color: #81c2c0;
    background: #81c2c0;
    & svg > path {
      fill: #fff;
    }
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SignInCard = styled.div`
  width: 100%;
  height: 250px;
  background: white;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;

  p {
    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #393d3e;
  }
`;

const InviteText = styled.p`
  line-height: 24px !important;
`;

const BlankDiv = styled.div`
  min-width: 50px;
  min-height: 20px;
`;
const LoginGrid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  padding: 5px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;
