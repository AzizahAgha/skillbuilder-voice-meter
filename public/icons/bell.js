import * as React from "react";

function Bell(props) {
  return (
    <svg width={20} height={24} fill="none" {...props}>
      <path
        d="M11.124 4.447a.48.48 0 01-.48-.48v-1.61a.96.96 0 00-.958-.96.96.96 0 00-.959.96v1.61a.48.48 0 01-.958 0v-1.61A1.92 1.92 0 019.686.439a1.92 1.92 0 011.918 1.918v1.61c0 .266-.215.48-.48.48zM9.684 23.448a3.36 3.36 0 01-3.356-3.356.48.48 0 01.959 0 2.4 2.4 0 002.397 2.397 2.4 2.4 0 002.396-2.397.48.48 0 01.959 0 3.36 3.36 0 01-3.355 3.356z"
        fill="#fff"
      />
      <path
        d="M17.837 20.572H1.539a1.44 1.44 0 01-.935-2.531 6.665 6.665 0 002.373-5.102v-2.913c0-3.7 3.01-6.71 6.71-6.71 3.701 0 6.712 3.01 6.712 6.71v2.913c0 1.968.861 3.825 2.365 5.095a1.44 1.44 0 01-.927 2.538zM9.687 4.274a5.758 5.758 0 00-5.751 5.752v2.913a7.616 7.616 0 01-2.705 5.828.48.48 0 00.308.846h16.298a.48.48 0 00.311-.844 7.622 7.622 0 01-2.708-5.83v-2.913a5.758 5.758 0 00-5.752-5.752z"
        fill="#fff"
      />
    </svg>
  );
}

const MemoBell = React.memo(Bell);
export default MemoBell;
