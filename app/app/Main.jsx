import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { SESSION } from "../utils/apiroutes";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import { StyleSheet, Pressable } from "react-native";

const Spacer = ({ height = 16 }) => <MotiView style={{ height }} />;

const Main = () => {
  const { data, isLoading, error } = api.projects.getProjects.useQuery();
  console.log(data, error, isLoading);
  const router = useRouter();
  const handleNavigation = (id) => {
    router.push(`/project/${id}`);
  };
  const handleUser = () => {
    router.push(`/Profile`);
  };
  const [currentUser, setCurrentUser] = useState();

  const fetchUser = async () => {
    try {
      const user = await axios.get(
        SESSION,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(user);
      setCurrentUser(user.data.user);
    } catch (error) {
      console.log(error.response.data, "session");
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <View className="pt-10 h-full w-full ">
      <View className="bg-[#004aad] p-5  flex flex-row justify-between items-center">
        <Text className="text-2xl font-normal text-white">
          Welcome, {currentUser?.name}
        </Text>
        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.push("Notification")}>
            <Ionicons name="notifications-outline" size={30} color="gold" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUser}>
            <Image
              className="h-12 w-12 rounded-full"
              source={{
                uri: `${currentUser?.image}`,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-2xl font-bold text-center px-2 text-[#004aad] mt-5">
        Your Projects
      </Text>
      {/* <View className="border-t-4 border-[#004aad] my-2"></View> */}

      {isLoading ? (
        <MotiView
          transition={{
            type: "spring",
            delay: "50",
          }}
          style={[styles.container, styles.padded]}
        >
          <Skeleton width={"100%"} height={100} colorMode="light" />
          <Spacer height={6} />
          <Skeleton width={"100%"} height={100} colorMode="light" />
        </MotiView>
      ) : (
        <View className="flex flex-row flex-wrap justify-center py-2 px-3 gap-2 h-full ">
          {data?.map((project) => (
            <TouchableOpacity
              key={project.id}
              onPress={() => handleNavigation(project.id)}
              className=" w-full px-2 py-6  border border-slate-400  rounded-2xl "
            >
              <View className="flex flex-row items-center justify-between ">
                <View className="w-[80%]">
                  <Text className="text-2xl font-semibold text-slate-600">
                    {project.name.charAt(0).toUpperCase() +
                      project.name.slice(1)}
                  </Text>
                  <Text className="text-lg text-slate-500 w-full">
                    {project.description.charAt(0).toUpperCase() +
                      project.description.slice(1)}
                  </Text>
                </View>

                <Entypo name="chevron-thin-right" size={35} color="black" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padded: {
    padding: 12,
  },
});

export default Main;
