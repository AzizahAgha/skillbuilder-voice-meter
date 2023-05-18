import * as React from "react";

function Printer(props) {
  return (
    <svg width={30} height={30} fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.56 9.303h-1.746V4.766c0-.576-.47-1.045-1.045-1.045h-1.747V1.51c0-.833-.677-1.51-1.51-1.51H8.488c-.833 0-1.51.677-1.51 1.51v2.211H5.23c-.576 0-1.044.469-1.044 1.045v4.537H2.44A2.443 2.443 0 000 11.743v10.235a2.443 2.443 0 002.44 2.44h4.538v4.072c0 .833.677 1.51 1.51 1.51h13.024c.833 0 1.51-.677 1.51-1.51v-4.072h4.538a2.443 2.443 0 002.44-2.44V11.744a2.443 2.443 0 00-2.44-2.44zm-2.906-4.422v4.422h-1.632V4.881h1.632zM8.137 1.51c0-.193.157-.35.35-.35h13.025c.194 0 .351.157.351.35v7.793H8.137V1.51zM5.346 4.88h1.632v4.423H5.346V4.881zm16.517 23.61c0 .193-.157.35-.35.35H8.487a.351.351 0 01-.351-.35v-7.793h13.726v7.793zm6.978-6.512c0 .706-.575 1.28-1.281 1.28h-4.538v-2.561h.816a.58.58 0 000-1.16H6.162a.58.58 0 000 1.16h.816v2.562H2.44a1.283 1.283 0 01-1.28-1.281V11.744c0-.706.574-1.281 1.28-1.281h25.12c.706 0 1.28.575 1.28 1.28v10.235zm1.044-10.234a2.329 2.329 0 00-2.325-2.326h-1.861V4.766a.931.931 0 00-.93-.93h-1.861V1.51c0-.77-.626-1.395-1.396-1.395H8.488h13.024c.77 0 1.395.626 1.395 1.395v2.326h1.861c.513 0 .93.417.93.93v4.652h1.861a2.328 2.328 0 012.326 2.326v10.234-10.234zm-6.977 12.56v4.186-4.187zM7.092 3.835H5.23h1.86zM4.3 9.418H2.44 4.3zm18.607 0V4.766v4.652h1.86-1.86zm-.93 0H8.021V1.51v7.908h13.955zm-14.886 0H5.23V4.766v4.652h1.86zm14.42 19.537H8.488a.466.466 0 01-.466-.465v-7.908 7.908c0 .257.209.465.465.465h13.025zM2.3 10.355a1.397 1.397 0 00-1.255 1.389v10.234c0 .769.626 1.395 1.396 1.395h4.652H2.44c-.77 0-1.395-.626-1.395-1.395V11.744c0-.722.55-1.317 1.254-1.389zm17.827 12.553a.465.465 0 00-.01-.93h-9.768 9.768a.465.465 0 01.01.93zm-.01-1.045h-9.768a.58.58 0 100 1.16h9.769a.58.58 0 000-1.16zm.01 3.37a.465.465 0 00-.01-.93h-9.768 9.768a.465.465 0 01.01.93zm-.01-1.044h-9.768a.58.58 0 000 1.16h9.769a.58.58 0 000-1.16zm0 2.326h-9.768a.58.58 0 000 1.16h9.769a.58.58 0 100-1.16z"
        fill="#003647"
      />
    </svg>
  );
}

const MemoPrinter = React.memo(Printer);
export default MemoPrinter;