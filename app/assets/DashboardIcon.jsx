import * as React from "react";
import Svg, { Path } from "react-native-svg";
const DashboardIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      stroke="#004AAD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.667 6.667A2.667 2.667 0 0 1 5.333 4h8v24h-8a2.667 2.667 0 0 1-2.666-2.667V6.667Zm16-2.667h8a2.667 2.667 0 0 1 2.666 2.667v6.666H18.667V4Zm0 14.667h10.666v6.666A2.667 2.667 0 0 1 26.667 28h-8v-9.333Z"
    />
  </Svg>
);
export default DashboardIcon;
