import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

const FileSection = ({ fileTitle, invoiceName, date, time, url }) => {
  const _handlePressButtonAsync = async () => {
    await WebBrowser.openBrowserAsync(url);
  };
  return (
    <TouchableOpacity
      onPress={_handlePressButtonAsync}
      className="bg-slate-300 rounded-md p-2 mt-2 flex flex-row justify-between items-center"
    >
      <View className="flex flex-row items-center gap-1">
        <AntDesign name="filetext1" size={38} color="black" />
        <View>
          <Text className="font-medium text-xl">{fileTitle}</Text>
          <Text className=" text-lg">{invoiceName}</Text>
        </View>
      </View>
      <View>
        <Text className="font-medium text-md">{date}</Text>
        <Text className="font-medium text-md">{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FileSection;
