import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const Section = ({ CName, Amount, Day, Type }) => {
  return (
    <TouchableOpacity>
      <View className="border-2  p-2 rounded-lg flex flex-row justify-between mt-2">
        <View>
          <Text className="font-bold text-xl">{CName}</Text>
          <Text className="text-[#A49C9C] text-base">Due {Day}</Text>
        </View>
        <View className="flex flex-col">
          <Text className="text-lg font-bold">$ {Amount}</Text>
          <View className="bg-[#84CC98] p-2 rounded-lg">
            <Text className="text-center text-white">{Type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Section;
