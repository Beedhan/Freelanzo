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
import axios from "axios";
import { SESSION } from "../../../utils/apiroutes";

const Conversation = () => {
  const [messageTitle, setMessageTitle] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const { id } = useSearchParams();

  const { data, refetch } = api.conversation.getMessages.useQuery({
    projectId: id,
  });
  const messageMutation = api.conversation.sendMessage.useMutation({
    onSuccess: () => {
      setMessageTitle("");
      void refetch();
    },
  });
  const handleSend = (e) => {
    e.preventDefault();
    messageMutation.mutate({
      projectId: id,
      message: messageTitle,
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);
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
  // console.log(data, "messages", currentUser);

  return (
    <View className="pt-10 h-full w-full">
      <TopSection name="Conversation" />
      <ScrollView
        className=" mb-24"
        ref={(ref) => {
          this.scrollView = ref;
        }}
        onContentSizeChange={() =>
          this.scrollView.scrollToEnd({ animated: true })
        }
      >
        {currentUser &&
          data?.map((message) => (
            <>
              {currentUser?.id === message.userId ? (
                <View className="p-2" key={message.id}>
                  {/* <Text className="text-right">{message.user.name}</Text> */}
                  <Text className="min-w-32 ml-auto rounded-full bg-[#004aad] px-3 py-2 text-right text-[16px] text-white">
                    {message.text}
                  </Text>
                </View>
              ) : (
                <View className="p-2" key={message.id}>
                  <Text className="text-left  font-semibold pb-1">
                    {message.user.name}
                  </Text>
                  <View className="flex flex-row items-center gap-1">
                    <Image
                      className="h-7 w-7 rounded-full"
                      source={{
                        uri: `${message.user.image}`,
                      }}
                    />
                    <Text className="min-w-32 mr-auto rounded-full border border-gray-500 px-3 py-2 text-center text-[16px]  ">
                      {message.text}
                    </Text>
                  </View>
                </View>
              )}
            </>
          ))}
      </ScrollView>
      <View className="px-2 absolute bottom-0 ">
        <View className="p-2 border-2 border-[#A49C9C]  rounded-xl ">
          <View className="flex flex-row  items-center justify-between ">
            <TextInput
              onChangeText={(text) => setMessageTitle(text)}
              placeholder="Messages..."
              className="w-[90%] text-lg"
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

export default Conversation;
