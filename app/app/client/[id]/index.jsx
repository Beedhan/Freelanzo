import React from "react";
import { Image, View } from "react-native";
import TopSection from "../../../Components/Dashboard/TopSection";
import { Text } from "react-native";
import { useSearchParams } from "expo-router";
import { api } from "../../../utils/api";

const ClientProfile = () => {
  const { id } = useSearchParams();
  const { data, isLoading } = api.workspace.getSingleClient.useQuery({
    userId: id,
  });
  console.log(data, id, "client");
  return (
    <View className="pt-10 h-full w-full">
      <TopSection name="Client Profile" />

      <View className="flex flex-col  items-center pt-8">
        <Image
          className="h-44 w-44 rounded-full"
          source={{
            uri: `${data?.user?.image}`,
          }}
        />
        <Text className="text-2xl font-semibold">{data?.user.name}</Text>
        <Text>
          Email:{" "}
          <Text className="text-[#65AEC5] font-medium">{data?.user.email}</Text>
        </Text>
      </View>

      <View className="pt-4 px-6">
        <Text className="text-lg font-semibold">Client's Projects</Text>
        {data?.user?.UsersOnProjects.map((project) => (
          <View
            key={project.id}
            className=" w-full px-4 py-6 flex flex-col shadow-lg border bg-slate-600 rounded-xl border-slate-200"
          >
            <View className="">
              <Text className="text-2xl text-white">
                {project.project.name}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ClientProfile;
