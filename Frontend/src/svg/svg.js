import React from "react";
import {
  useTransition,
  animated,
  useChain,
  config,
  useSpring,
} from "react-spring";

function Icon(click) {
  // const transitions = useSpring({
  //   transform: click ? "rotateX(180deg)" : "rotateX(10deg)",
  // });
  return (
    <animated.svg
      // style={transitions}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      enableBackground="new 0 0 512 512"
      viewBox="0 0 480.026 480.026"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        fill="#ffd805"
        d="M475.922 229.325l-144-160c-3.072-3.392-7.36-5.312-11.904-5.312h-96a16.052 16.052 0 00-14.624 9.472c-2.56 5.792-1.504 12.544 2.72 17.216l134.368 149.312-134.368 149.28c-4.224 4.704-5.312 11.456-2.72 17.216 2.592 5.792 8.32 9.504 14.624 9.504h96c4.544 0 8.832-1.952 11.904-5.28l144-160c5.472-6.08 5.472-15.36 0-21.408z"
        data-original="#000000"
        transform="rotate(90 240.013 240.013)"
      ></path>
      <path
        xmlns="http://www.w3.org/2000/svg"
        fill="#ffd805"
        d="M267.922 229.325l-144-160c-3.072-3.392-7.36-5.312-11.904-5.312h-96a16.052 16.052 0 00-14.624 9.472c-2.56 5.792-1.504 12.544 2.72 17.216l134.368 149.312L4.114 389.293c-4.224 4.704-5.312 11.456-2.72 17.216 2.592 5.792 8.32 9.504 14.624 9.504h96c4.544 0 8.832-1.952 11.904-5.28l144-160c5.472-6.08 5.472-15.36 0-21.408z"
        data-original="#000000"
        transform="rotate(90 240.013 240.013)"
      ></path>
    </animated.svg>
  );
}

export default Icon;
