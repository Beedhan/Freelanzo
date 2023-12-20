import { View, Text } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const Notify = ({ pName, notificationType, messageTime }) => {
  return (
    <View className="flex flex-row justify-between w-full p-3 border shadow-sm rounded my-1 ">
      <View className="flex flex-row gap-3 items-start w-[80%]">
        <View>
          <Text className="font-bold text-lg">{pName}</Text>
          <View className="bg-slate-500 mt-1 flex w-fit flex-row justify-center rounded-xl">
            <Text className="text-white w-fit px-2 py-1">
              {notificationType}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text className="text-slate-500 text-base font-bold">
          {dayjs(messageTime).fromNow()}
        </Text>
      </View>
    </View>
  );
};

export default Notify;
