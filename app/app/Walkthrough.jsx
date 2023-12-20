import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import { Image, Text, TextBase, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ArtWork1 from "../Components/Walkthrough/Artwork1";
import ArtWork2 from "../Components/Walkthrough/Artwork2";
import { verticalScale } from "react-native-size-matters";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Wave from "../Components/Walkthrough/Wave";
export const GradientText = (props) => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={["red", "blue"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

const Walkthrough = () => {
  const router = useRouter();
  const offset = useSharedValue(1);
  const opacity = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(1 * offset.value, {
            duration: 1000,
          }),
        },
      ],
    };
  });
  const imageStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1 * opacity.value, { duration: 100 }),
    };
  });
  const handleNavigation = () => {
    offset.value = 100;
    opacity.value = 0;

    router.push("Login");
  };
  return (
    <Swiper
      className="relative"
      showsButtons={true}
      loop={false}
      dot={
        <View
          style={{
            backgroundColor: "#C2BEBE",
            width: 24,
            height: 10,
            borderRadius: 4,
            margin: 4,
            marginBottom: verticalScale(50),
          }}
        />
      }
      activeDot={
        <View
          style={{
            backgroundColor: "#004AAD",
            width: 24,
            height: 10,
            borderRadius: 4,
            margin: 4,
            marginBottom: verticalScale(50),
          }}
        />
      }
      nextButton={
        <Text
          className=" bg-[#004AAD] text-white p-2 rounded-md mr-2 absolute right-0"
          style={{ top: verticalScale(290) }}
        >
          <MaterialIcons name="navigate-next" size={24} />
        </Text>
      }
      prevButton={
        <Text
          className="text-4xl left-0 absolute text-slate-600 p-2 "
          style={{ top: verticalScale(-320) }}
        >
          <Ionicons name="arrow-back" size={24} />
        </Text>
      }
    >
      <View className="h-full w-full  flex justify-center items-center px-5">
        <View className="h-1/2 flex w-full">
          <ArtWork2 />
        </View>
        <GradientText className="text-3xl font-bold text-center ">
          A platform built for a new way of working.
        </GradientText>
      </View>
      <View className="h-full  justify-center items-center px-5">
        <View className="h-1/2 flex w-full">
          <ArtWork1 />
        </View>
        <GradientText className="text-3xl font-bold text-center">
          Freelanzo is smarter, easier, more efficient way to manage client's
          projects.
        </GradientText>
      </View>
      <View className="h-full flex  items-center  px-5 ">
        <Wave imageStyles={imageStyles} animatedStyles={animatedStyles} />
        <GradientText className="text-3xl font-semibold text-center  pt-40">
          Everything you do with clients, now in one place.
        </GradientText>
        <TouchableOpacity
          style={{ bottom: verticalScale(15), left: verticalScale(115) }}
          className="flex flex-row items-center absolute bg-[#004AAD] text-white text-xl p-2 rounded-lg"
          onPress={handleNavigation}
        >
          <Text className="text-xl text-white font-semibold">Get Started</Text>
          <MaterialIcons name="navigate-next" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

export default Walkthrough;
