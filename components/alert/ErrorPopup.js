import React, { useEffect } from "react";
import styled from "styled-components";
import { Card as BsCard, Button as BsButton, Modal } from "react-bootstrap";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import { useRouter } from "next/router";
import { useTeam } from "@contexts/TeamContext";
import errorService from "@services/error.service";
import { useQuery, useMutation } from "react-query";

export default function ErrorPopup({ show = false, setVisibility, error }) {
  const router = useRouter();
  const { team } = useTeam();
  const errMessage = error?.data?.message;
  let errorCode = error?.data?.code;
  if (errorCode == undefined) {
    errorCode = error?.status;
  }

  const errorMutation = useMutation(({ data }) => errorService.create(data));
  useEffect(() => {
    if (show) {
      errorMutation.mutate({
        data: {
          errorCode: errorCode,
          type: "",
          message: errMessage,
          pageUrl: document.location.href,
        },
      });
    }
  }, [show]);

  const getTitle = () => {
    const message =
      {
        400: "Unable to process the request at the moment",
        401: "Not authorized to access the web page",
        403: "Forbidden to access this page",
        404: "Unable to find the server request",
        408: "The request is timed-out",
        500: "Unable to proceed with your request",
      }[errorCode] ?? "Error detected in the application";

    return message;
  };

  const getSubtitle = () => {
    const message =
      {
        400: "No data is lost in the process. The application request was incorrectly accessed or corrupted. Please try requesting again.",
        401: "You will be allowed to access the page once authorized. This happened as you tried to access a restricted web page but aren't authorized to do so. Please try requesting admin to get access to this page.",
        403: "No data is lost in the process. As no login opportunity is available. Please recheck you access to this page.",
        404: "No data is lost in the process. The resource you are trying to access doesn't exist. Please check for the correct link that exists.",
        408: "Your changes might have not been saved. The backend API took too long to process your request. Please try reloading the page.",
        500: "No data is lost in the process. The web server has encountered an internal error. Please try connecting again.",
      }[errorCode] ?? "Error detected in the application";

    return message;
  };

  const onClose = () => {
    setVisibility(false);
    if ((errorCode == 404 || errorCode == 500) && team?.id) {
      router.push("/detail");
    } else if ((errorCode == 400 || errorCode == 403) && team?.id) {
      router.push("/manage/profile");
    } else if (errorCode == 401) {
      localStorage.removeItem("auth");
      localStorage.removeItem("tokenInfo");
      router.push("/login");
    } else {
      router.push("/");
    }
  };

  return (
    <Modal
      className="bs"
      centered
      show={show}
      onHide={() => setVisibility(false)}
    >
      <Modal.Body className="p-0">
        <Card>
          <Card.Body>
            <CloseButton onClick={() => onClose()}>
              <CloseIcon size={24} color="#969C9D" />
            </CloseButton>

            <Card.Title>{getTitle()}</Card.Title>
            <div className="card-text">
              <b>{getSubtitle()}</b>
            </div>
            <div className="card-subtext">
              <b>
                If the issue persists, please write to us at{" "}
                <a
                  href="mailto:help@skillbuilder.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  help@skillbuilder.io
                </a>
                .
              </b>{" "}
              If you need further assistance please click on the help button to
              schedule a call with us!
            </div>

            <Button
              variant="secondary"
              onClick={() =>
                window.open(
                  "https://calendly.com/skillbuilderkit/introcall",
                  "_blank",
                  "noopener"
                )
              }
            >
              Help
            </Button>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}

const Card = styled(BsCard)`
  &&& {
    background: #ffffff;
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 1rem;
    .card-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      .card-title {
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: 500;
        font-size: 40px;
        line-height: 1.2;
        text-align: center;
        color: #003647;
        max-width: 80%;
      }

      .card-text,
      .card-subtext {
        font-family: Manrope;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 19px;
        text-align: center;
        color: #393d3e;
        margin-bottom: 1rem;
        max-width: 80%;
      }
      .card-text {
        color: #003647;
        margin-bottom: 2rem;
      }
    }
  }
`;
const Button = styled(BsButton)`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #ffffff;
    padding: 0.5rem 1.5rem;
    width: 170px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 2px;
  top: 2px;
`;
