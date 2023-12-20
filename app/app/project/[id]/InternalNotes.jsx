import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import TopSection from "../../../Components/Dashboard/TopSection";
import { api } from "../../../utils/api";
import { useSearchParams } from "expo-router";
import { Entypo, FontAwesome, Feather } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";

const InternalNotes = () => {
  const [noteTitle, setNoteTitle] = useState("");

  const { id } = useSearchParams();

  const { data, refetch } = api.conversation.getInternalNotes.useQuery({
    projectId: id,
  });
  const noteMutation = api.conversation.sendInteralNote.useMutation({
    onSuccess: () => {
      setNoteTitle("");
      void refetch();
    },
  });
  const noteDelete = api.conversation.deleteInteralNotes.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });
  const handleSend = (e) => {
    e.preventDefault();
    noteMutation.mutate({
      projectId: id,
      note: noteTitle,
    });
  };

  const handleDelete = (Id) => {
    e.preventDefault();
    noteDelete.mutate({
      id: Id,
    });
  };

  return (
    <View className="pt-10 h-full w-full">
      <TopSection name="InternalNotes" />
      <ScrollView
        className=" mb-24 "
        ref={(ref) => {
          this.scrollView = ref;
        }}
        onContentSizeChange={() =>
          this.scrollView.scrollToEnd({ animated: true })
        }
      >
        <Text className="px-3 pt-2 text-2xl text-[#004aad] font-extrabold">
          Personal Notes
        </Text>
        {data?.map((note) => (
          <View className="px-2 pt-4">
            <View className=" py-2 px-2 border border-slate-400 rounded-xl m-2 flex flex-row items-center">
              <Text className="text-base  font-medium w-10/12">
                {note.text}
              </Text>

              <TouchableOpacity
                className="flex flex-row  justify-center align-middle items-center w-1/5 h-10"
                onPress={() => noteDelete(note.id)}
              >
                <AntDesign name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm px-4">
              {dayjs(note.createdAt).format("hh:mm A")}
              {"  "}
              {dayjs(note.createdAt).format("DD/MM/YYYY ")}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View className="p-2 absolute bottom-0 ">
        <View className="p-2 border-2 border-[#A49C9C]  rounded-xl ">
          <View className="flex flex-row gap-4 items-center">
            <TextInput
              onChangeText={(text) => setNoteTitle(text)}
              placeholder="Type your note..."
              className="w-[80%] text-lg"
            />
            <TouchableOpacity
              className="bg-[#004aad] p-2 rounded-lg "
              onPress={handleSend}
            >
              <FontAwesome name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InternalNotes;
