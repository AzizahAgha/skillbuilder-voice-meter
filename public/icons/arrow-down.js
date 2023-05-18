import * as React from "react";
import { memo } from "react";

const ArrowDownIcon = (props) => (
  <svg
    width={9}
    height={6}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M.142.373a.5.5 0 0 0 .004.703l3.986 3.987a.5.5 0 0 0 .708 0l3.986-3.987A.5.5 0 0 0 8.83.373L8.612.15A.5.5 0 0 0 7.899.15L4.842 3.246a.5.5 0 0 1-.712 0L1.073.15A.5.5 0 0 0 .36.15L.142.373Z"
      fill="#81C2C0"
    />
  </svg>
);

const Memo = memo(ArrowDownIcon);
export default Memo;
