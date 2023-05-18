import Bus from "@utils/Bus";
import React, { useEffect, useState } from "react";
import ErrorPopup from '@components/alert/ErrorPopup';
import { useRouter } from 'next/router'

export default function Error() {
  let [visibility, setVisibility] = useState(false);
  let [errorObj, setError] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    Bus.addListener(
      "error",
      ({ operation, error, duration }) => {
        if(localStorage.getItem('auth') == undefined &&  error?.status ==401 ){
          router.push("/login");
        } else {
          if (operation === "open") {
            setVisibility(true);
            setError(error);
          }

          if (operation === "close") {
            setVisibility(false);
          }

          if (duration) {
            setTimeout(() => {
              setVisibility(false);
            }, duration);
          }
        }
      }
    );
  }, []);


  return (
    visibility && (
      <ErrorPopup show={visibility} setVisibility={setVisibility} error={errorObj}/>
    )
  );
}
