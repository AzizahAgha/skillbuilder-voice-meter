import * as React from "react";

function SkillBuilderIcon(props) {
  return (
    <svg width={19} height={20} fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.069.334A.328.328 0 0012.747 0H1.697a.328.328 0 00-.321.334v2.19c0 .184.144.333.321.333h11.05c.178 0 .322-.15.322-.334V.333zM5.503 19.666c0 .185.143.334.32.334h11.051c.178 0 .322-.15.322-.334v-2.19a.328.328 0 00-.322-.333H5.824a.328.328 0 00-.321.334v2.19zM.32 14.286A.328.328 0 010 13.952V6.048c0-.184.144-.334.321-.334H2.43c.177 0 .321.15.321.334v5.047c0 .184.144.334.322.334h9.674c.178 0 .322.149.322.333v2.19a.328.328 0 01-.322.334H.321zm17.929 0c.177 0 .321-.15.321-.334V6.048a.328.328 0 00-.321-.334H5.824a.328.328 0 00-.321.334v2.19c0 .184.144.333.321.333H15.5c.177 0 .321.15.321.334v5.047c0 .184.144.334.322.334h2.108z"
        fill="#81C2C0"
      />
    </svg>
  );
}

const MemoSkillBuilderIcon = React.memo(SkillBuilderIcon);
export default MemoSkillBuilderIcon;
