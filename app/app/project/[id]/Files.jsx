import { View, Text } from "react-native";
import React from "react";
import TopSection from "../../../Components/Dashboard/TopSection";
import FileSection from "../../../Components/Files/FileSection";
import { api } from "../../../utils/api";
import { useSearchParams } from "expo-router";
import dayjs from "dayjs";

const Files = () => {
  const { id } = useSearchParams();

  const { data, isLoading } = api.files.getAll.useQuery({ projectId: id });
  return (
    <View className="pt-10 h-full w-full">
      <TopSection name="Files" />
      <View className="p-3 ">
        <Text className="text-xl font-extrabold">Your files</Text>
        {data?.map((e) => (
          <FileSection
            key={e?.id}
            fileTitle={e?.name}
            invoiceName={e?.Invoice?.title || "No invoice"}
            date={dayjs(e.createdAt).format("DD/MM/YYYY ")}
            time={dayjs(e.createdAt).format("hh:mm A")}
            url={e?.url}
          />
        ))}
      </View>
    </View>
  );
};

export default Files;
