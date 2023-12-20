import * as React from "react";
import Svg, { Path } from "react-native-svg";
const FileIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      stroke="#004AAD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M30 24.857v-12l-8.572-8.571h-8.571a3.428 3.428 0 0 0-3.429 3.428v17.143a3.429 3.429 0 0 0 3.429 3.429h13.714A3.429 3.429 0 0 0 30 24.857Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#004AAD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 7.714v17.143a6.857 6.857 0 0 0 6.857 6.857h13.714M21.43 4.286v5.143a3.428 3.428 0 0 0 3.428 3.428H30"
    />
  </Svg>
);
export default FileIcon;
