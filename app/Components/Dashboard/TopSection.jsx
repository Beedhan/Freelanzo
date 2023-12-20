import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TopSection = ({ name }) => {
  const router = useRouter();
  return (
    <>
      <View className="flex flex-row justify-between  items-center">
        <View className="flex flex-row p-3 gap-4 items-center ">
          <TouchableOpacity
            onPress={() => router.push("Main")}
            className="flex flex-row items-center border-2 border-[#004aad] rounded-md p-2 py-1"
          >
            <Ionicons name="chevron-back" size={25} color="#004aad" />
            <Text className="text-[#004aad] text-lg font-semibold">
              Project
            </Text>
          </TouchableOpacity>
          <Text className="text-3xl text-[#A49C9C] font-bold">{name}</Text>
        </View>
        <View className="flex flex-row p-4 gap-5 items-center"></View>
      </View>
      <View className="border-b-2 py-1 border-[#A49C9C]"></View>
    </>
  );
};

export default TopSection;
