import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TopSection from "../../../Components/Dashboard/TopSection";
import TaskSummary from "../../../Components/Dashboard/TaskSummary";
import { api } from "../../../utils/api";
import { useLocalSearchParams, useSearchParams } from "expo-router";

const Dashboard = () => {
  const { id } = useSearchParams();
  const { data,isLoading } = api.projects.getProject.useQuery({
    projectId: id,
  });
  console.log(data, id);
  return (
    <View className="pt-10 h-full w-full">
      <TopSection name={data?.name || "Dashboard"} />
      <TaskSummary id={id} />
      {/* {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View className="flex flex-row flex-wrap justify-center  px-4 gap-2">
          {data.map((project) => (
            <TouchableOpacity className="w-full px-4 py-6 shadow-lg border-2 rounded bg-gray-200 border-slate-200">
              <Text className="text-2xl">{project.name}</Text>
            </TouchableOpacity>
          ))} */}
      {/* </View> */}
      {/* )} */}
    </View>
  );
};

export default Dashboard;
