import React from "react";
import ManagePageHeader from "@ui-library/ManagePageHeader";
import Flash from "@ui-library/Flash";
import Bus from "@utils/Bus";

export default function ProfileLayout({ children }) {
  process.browser
    ? (window.flash = (message, type = "success") =>
        Bus.emit("flash", { message, type }))
    : "";

  return (
    <div className="bs">
      <ManagePageHeader />
      <Flash />
      <>{children}</>
    </div>
  );
}
