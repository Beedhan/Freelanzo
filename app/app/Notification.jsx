import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopSection from "../Components/Dashboard/TopSection";
import Notify from "../Components/Notification/Notify";
import { api } from "../utils/api";

const Notification = ({}) => {
  const router = useRouter();
  const { data, isLoading } = api.notification.get.useQuery();
  console.log(data);
  return (
    <View className="pt-10">
      <TopSection name="Notification" />
      <ScrollView className=" mx-4 pt-3 mb-20 rounded-xl">
        {data?.notifications?.map((notification) => (
          <Notify
            key={notification.id}
            pName={notification.text}
            latestMessage="I am Rakesh yo."
            notificationType={notification.type}
            messageTime={notification.createdAt}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Notification;
