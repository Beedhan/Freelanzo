import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ProfileIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      fill="#004AAD"
      fillRule="evenodd"
      d="M2.105 18a15.895 15.895 0 1 1 31.79 0 15.895 15.895 0 0 1-31.79 0ZM18 4.385A13.615 13.615 0 0 0 7.937 27.17 11.93 11.93 0 0 1 18 21.66a11.928 11.928 0 0 1 10.063 5.51A13.616 13.616 0 0 0 18 4.385Zm8.357 24.365A9.655 9.655 0 0 0 18 23.94a9.654 9.654 0 0 0-8.357 4.81A13.555 13.555 0 0 0 18 31.615c3.149 0 6.048-1.07 8.357-2.865ZM12.36 15.612a5.64 5.64 0 1 1 11.28 0 5.64 5.64 0 0 1-11.28 0Zm5.64-3.36a3.36 3.36 0 1 0 0 6.72 3.36 3.36 0 0 0 0-6.72Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default ProfileIcon;
