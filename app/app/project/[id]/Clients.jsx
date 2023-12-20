import React from "react";
import { Image, Text, View } from "react-native";
import TopSection from "../../../Components/Dashboard/TopSection";
import { api } from "../../../utils/api";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Clients = () => {
  const { data, isLoading, error } = api.workspace.joinedClients.useQuery();
  const router = useRouter();
  return (
    <View className="pt-10 h-full w-full">
      <TopSection name="Clients" />
      {data?.map((client) => (
        <TouchableOpacity
          className="flex flex-row p-4 items-center gap-5  border-b"
          onPress={() => router.push(`client/${client.user.id}`)}
        >
          <Image
            className="h-14 w-14 rounded-full"
            source={{
              uri: client.user.image,
            }}
          />
          <View>
            <Text className="font-medium text-2xl">{client?.user.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Clients;
