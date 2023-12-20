import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { api } from "../../utils/api";
import BottomSheet, { useBottomSheet } from "@gorhom/bottom-sheet";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const TaskSummary = ({ id }) => {
  const { data, refetch } = api.tasks.getTasksMobile.useQuery({
    projectId: id,
  });
  const [sectionTitle, setSectionTitle] = useState("");
  const [task, setTask] = useState({
    title: "",
    sectionId: "",
  });
  const taskSectionMutation = api.tasks.createSection.useMutation({
    onSuccess() {
      setSectionTitle("");
      void refetch();
    },
  });
  const taskSectionDelete = api.tasks.deleteSection.useMutation({
    onSuccess() {
      setTask({ title: "", sectionId: "" });
      void refetch();
    },
  });
  const taskTitleMutation = api.tasks.create.useMutation({
    onSuccess() {
      setTask({ title: "", sectionId: "" });
      void refetch();
    },
  });
  const taskTitleDelete = api.tasks.delete.useMutation({
    onSuccess() {
      setTask({ title: "", sectionId: "" });
      void refetch();
    },
  });

  const handleAddSection = (e) => {
    e.preventDefault();
    console.log(sectionTitle);
    taskSectionMutation.mutate({
      projectId: id,
      title: sectionTitle,
    });
  };
  const handleDeleteSection = (sectionId) => {
    console.log("ok");
    taskSectionDelete.mutate({
      projectId: id,
      id: sectionId,
    });
  };
  const handleAddTask = (e) => {
    e.preventDefault();
    taskTitleMutation.mutate({
      projectId: id,
      taskSectionId: task.sectionId,
      title: task.title,
    });
  };
  const handleDeleteTask = (taskId) => {
    console.log("ok");
    taskTitleDelete.mutate({
      projectId: id,
      id: taskId,
    });
  };
  const [sheetIndex, setSheetIndex] = useState(0);
  const [taskIndex, setTaskIndex] = useState(0);

  console.log(data);
  const bottomSheetRef = useRef(null);
  const bottomTaskRef = useRef(null);

  const snapPoints = ["1%", "30%"];
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const handleTaskChanges = useCallback((index) => {
    console.log("handleTaskChanges", index);
  }, []);

  return (
    <>
      <ScrollView className="px-2 pt-2">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-3xl  font-extrabold">Tasks</Text>
          <TouchableOpacity className="bg-[#004aad] p-2 rounded-md">
            <Text
              className="text-xl text-white font-bold"
              onPress={() =>
                setSheetIndex((prevSheetIndex) =>
                  prevSheetIndex === 0 ? 1 : 0
                )
              }
            >
              Add Section
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {data?.map((taskSection) => (
            <View className="">
              <View className=" my-5  rounded-md bg-gray-400">
                <View className="border-b-4 px-2 border-white bg-[#004aad] rounded-md py-2  flex flex-row items-center justify-between">
                  <Text className="text-2xl font-medium text-white">
                    {taskSection?.title?.charAt(0)?.toUpperCase() +
                      taskSection?.title?.slice(1)}
                  </Text>
                  <TouchableOpacity
                    className="bg-red-600 rounded-xl p-1"
                    onPress={() => handleDeleteSection(taskSection.id)}
                  >
                    <AntDesign name="delete" size={22} color="white" />
                  </TouchableOpacity>
                </View>
                {taskSection?.Tasks?.map((task) => (
                  <View className="flex flex-row justify-between pt-2 px-2">
                    <Text className="text-lg font-medium text-white">
                      <View className="pr-1 flex">
                        <Octicons name="dot-fill" size={10} color="white" />
                      </View>
                      {task?.title}
                    </Text>
                    <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
                      <Feather name="delete" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                <View className="flex items-center">
                  <TouchableOpacity
                    className="py-2 flex flex-row bg-white rounded-lg w-2/5  justify-center items-center m-2"
                    onPress={() => {
                      setTaskIndex((prevTaskIndex) =>
                        prevTaskIndex === 0 ? 1 : 0
                      );
                      setTask({ ...task, sectionId: taskSection?.id });
                    }}
                  >
                    <Ionicons name="ios-add-circle" size={20} color="black" />
                    <Text className="text-[#004aad] font-semibold">
                      Add task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndex}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
      >
        <View className="p-4">
          <Text className="text-base  font-medium">Task Section Title</Text>
          <TextInput
            className="w-full h-12 p-2  text-base rounded-lg font-medium mb-4 border-2 border-[#c2bebe]"
            placeholder="Section Title"
            placeholderTextColor="#c2bebe"
            value={sectionTitle}
            onChangeText={(e) => setSectionTitle(e)}
          />
          <TouchableOpacity
            onPress={handleAddSection}
            className="bg-[#004aad] py-3 px-16 rounded-lg mt-4"
          >
            <Text className="font-bold text-xl text-white text-center">
              ADD SECTION
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      <BottomSheet
        ref={bottomTaskRef}
        index={taskIndex}
        onChange={handleTaskChanges}
        snapPoints={snapPoints}
      >
        <View className="p-4">
          <Text className="text-base  font-medium">Task Title</Text>
          <TextInput
            className="w-full h-12 p-2  text-base rounded-lg font-medium mb-4 border-2 border-[#c2bebe]"
            placeholder="Task Title"
            placeholderTextColor="#c2bebe"
            value={task.title}
            onChangeText={(e) => setTask({ ...task, title: e })}
          />
          <TouchableOpacity
            onPress={handleAddTask}
            className="bg-[#004aad] py-3 px-16 rounded-lg mt-4"
          >
            <Text className="font-bold text-xl text-white text-center">
              ADD
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
};

export default TaskSummary;
