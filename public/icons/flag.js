import * as React from "react";

function Flag(props) {
  const color = props?.color ? props?.color: "#1F5462";
  return (
    <svg width={15} height={20} fill="none" {...props}>
      <path
        d="M11.938 5.978l2.656-4.774a.332.332 0 00-.29-.494H5.787a.333.333 0 000 .665h7.95l-2.471 4.442a.333.333 0 000 .323l2.47 4.442H1.77V1.375h2.8a.333.333 0 100-.665h-2.8V.333A.333.333 0 001.437 0H.333A.333.333 0 000 .333v15.4a.333.333 0 10.665 0V.665h.44v18.67h-.44V16.93a.333.333 0 00-.665 0v2.737c0 .184.149.333.333.333h1.104a.333.333 0 00.332-.333v-8.42h12.534a.333.333 0 00.291-.494l-2.656-4.775z"
        fill={color}
      />
    </svg>
  );
}

const MemoFlag = React.memo(Flag);
export default MemoFlag;
