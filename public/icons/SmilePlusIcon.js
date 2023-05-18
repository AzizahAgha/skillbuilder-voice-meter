import * as React from "react";

function SmilePlusIcon(props) {
  return (
    <svg viewBox="0 0 512 512" width="1em" height="1em" {...props}>
      <path d="M443.7 68.3V0h-34.1v68.3h-68.3v34.1h68.3v68.3h34.1v-68.3H512V68.3zM102.4 256h42.7v42.7h-42.7zM247.5 256h42.7v42.7h-42.7zM199.9 392.5h-7.5c-28.4 0-52.7-17.5-62.9-42.2l-.2-.5H92.5l5 12.4c15.4 38 52 64.4 94.8 64.4H200.2c42.8 0 79.4-26.4 94.5-63.7l.2-.7 5-12.4h-36.8c-10.3 25.2-34.6 42.7-63.1 42.7h-.1z" />
      <path d="M196.3 119.5C88 119.5 0 207.5 0 315.7S88 512 196.3 512s196.3-88 196.3-196.3-88.1-196.2-196.3-196.2zm0 358.4c-89.4 0-162.1-72.7-162.1-162.1s72.7-162.1 162.1-162.1 162.1 72.7 162.1 162.1-72.7 162.1-162.1 162.1z" />
    </svg>
  );
}

const MemoSmilePlusIcon = React.memo(SmilePlusIcon);
export default MemoSmilePlusIcon;
