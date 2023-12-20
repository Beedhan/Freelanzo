import { useEffect } from "react";
import { View, Image } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
export default function Wave({ imageStyles, animatedStyles }) {
  const c1y = useSharedValue(0.2);
  const c2y = useSharedValue(0.8);

  useEffect(() => {
    handleWave();
  }, []);
  const animatedProps = useAnimatedProps(() => {
    const path = [
      "M 0 0",
      `C 0.4 ${c1y.value}, 0.6 ${c2y.value}, 1 0`,
      "V 1",
      "H 0",
    ].join(" ");
    return { d: path };
  });
  const handleWave = () => {
    c1y.value = withRepeat(withTiming(0.8, { duration: 500 }), -1, true);
    c2y.value = withDelay(
      200,
      withRepeat(withTiming(0.2, { duration: 500 }), -1, true)
    );
  };
  return (
    <Animated.View
      className="w-[80%] h-[40%] pt-40 pb-8 rounded-b-3xl justify-center items-center bg-[#004aad] z-50"
      style={animatedStyles}
    >
      <Animated.Image
        className="w-80 h-20 bottom-10 absolute"
        source={require("../../assets/Logo.png")}
        style={imageStyles}
      />
      {/* <Svg style={{ width: 300, height: 300 }} viewBox="0 0 1 1">
        <AnimatedPath fill={"#004aad"} animatedProps={animatedProps} />
      </Svg> */}
    </Animated.View>
  );
}
