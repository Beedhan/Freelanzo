import * as React from "react";
import Svg, { Path } from "react-native-svg";
const TasksIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      stroke="#004AAD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M27.708 30H7.292a2.876 2.876 0 0 1-2.063-.879A3.044 3.044 0 0 1 4.375 27V9c0-.796.307-1.559.854-2.121A2.876 2.876 0 0 1 7.292 6h14.583c.773 0 1.515.316 2.062.879.547.562.855 1.325.855 2.121v1.5M27.708 30a2.876 2.876 0 0 1-2.062-.879A3.044 3.044 0 0 1 24.792 27V10.5M27.708 30c.774 0 1.516-.316 2.063-.879A3.044 3.044 0 0 0 30.625 27V13.5c0-.796-.307-1.559-.854-2.121a2.876 2.876 0 0 0-2.063-.879h-2.916M18.958 6h-5.833m-2.917 18h8.75m-8.75-12h8.75v6h-8.75v-6Z"
    />
  </Svg>
);
export default TasksIcon;
