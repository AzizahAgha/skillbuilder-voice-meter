import Bus from "@utils/Bus";
import React, { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";

export default function Flash() {
  let [visibility, setVisibility] = useState(false);
  let [message, setMessage] = useState("");
  let [type, setType] = useState("");

  useEffect(() => {
    Bus.addListener("flash", ({ message, type }) => {
      setVisibility(true);
      setMessage(message);
      setType(type);
      setTimeout(() => {
        setVisibility(false);
      }, 10000);
    });

    () => {
      setVisibility(false);
    };
  }, []);

  useEffect(() => {
    if (document.querySelector(".close") !== null) {
      document
        .querySelector(".close")
        .addEventListener("click", () => setVisibility(false));
    }
  });

  return (
    visibility && (
      <Container>
        <Alert variant={type}>
          <p className="mb-0">{message}</p>
        </Alert>
      </Container>
    )
  );
}
