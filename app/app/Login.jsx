"use client"
import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Google from "../Components/Login/Google";
import Animated, {
  Easing,
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import axios from "axios";
import {
  FetchData,
  POSTCREDENTAILS,
  PostData,
  SIGNINCALL,
} from "../utils/apiCalls";
import { CREDENTIALS, CSRF, SIGNIN, TEST } from "../utils/apiroutes";

const Login = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    email: "bhuwaibidhan@gmail.com",
    password: "bidhan123",
  });

  const handleLogin = async () => {
    try {
      const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/;
      if (!pattern.test(userData.email)) {
        return ToastAndroid.show("Incorrect Email format", ToastAndroid.LONG);
      }
      console.log("called");
      const csrf = await FetchData(CSRF);
      console.log(csrf);
      const postdata = {
        ...userData,
        redirect: "false",
        csrfToken: csrf.csrfToken,
        json: "true",
      };
      console.log(postdata);
      const data = await POSTCREDENTAILS(CREDENTIALS, postdata);
      console.log(data.data, "data");
      if (data.data.url.includes("inbox")) {
        router.replace("Main");
      }
    } catch (e) {
      if (e.response.status === 401) {
        ToastAndroid.show("Authentication Error", ToastAndroid.LONG);
      }
      console.log(e.response, "eeeeee");
    }
  };

  return (
    <View className="flex h-full w-full justify-center items-center ">
      <Animated.View
        className="flex items-center"
        entering={FadeInUp.duration(200).springify()}
      >
        <Image
          className="w-80 h-20"
          source={require("../assets/Freelanzo_trans.png")}
        />
        <Text className="font-semibold  text-2xl my-4">
          Work without limits
        </Text>
      </Animated.View>
      <Animated.View
        className="w-full px-10"
        entering={FadeInUp.delay(100).duration(200).springify()}
      >
        <Text className="text-base  font-medium">Your email Address</Text>
        <TextInput
          className="w-full h-12 p-2  text-base rounded-lg font-medium mb-4 border-2 border-[#c2bebe]"
          placeholder="example@gmail.com"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#c2bebe"
          value={userData.email}
          onChangeText={(val) => setUserData({ ...userData, email: val })}
        />
        <Text className="text-base font-medium">Password</Text>
        <TextInput
          className="w-full h-12 p-2 text-base rounded-lg font-medium mb-4 border-2 border-[#c2bebe]"
          placeholder="min. 8 characters"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor="#c2bebe"
          value={userData.password}
          onChangeText={(val) => setUserData({ ...userData, password: val })}
        />
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(300).duration(200).springify()}
        className="flex  w-full justify-center items-center"
      >
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-[#004aad] py-3 px-16 rounded-lg mt-4"
        >
          <Text className="font-bold text-xl text-white">Log In</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Login;
