import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import TopSection from "../Components/Dashboard/TopSection";
import axios from "axios";
import { SESSION } from "../utils/apiroutes";
import { api } from "../utils/api";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState();
  const { data } = api.projects.getProjects.useQuery();

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
    <View className="pt-10 h-full w-full">
      <TopSection name="Profile" />

      <View className="flex flex-col  items-center pt-8">
        <Image
          className="h-44 w-44 rounded-full"
          source={{
            uri: `${currentUser?.image}`,
          }}
        />
        <Text className="text-2xl font-semibold">{currentUser?.name}</Text>
        <Text>
          Email:{" "}
          <Text className="text-[#65AEC5] font-medium">
            {currentUser?.email}
          </Text>
        </Text>
      </View>

      <View className="pt-4 px-6">
        <Text className="text-lg font-semibold">Current Projects</Text>
        {data.map((project) => (
          <View
            key={project.id}
            className="mt-2 w-full px-2 py-3 flex flex-col  shadow-lg border bg-slate-500 rounded-xl border-slate-200"
          >
            <View className="">
              <Text className="text-xl text-center text-white">
                {project.name.charAt(0).toUpperCase() + project.name.slice(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Profile;
