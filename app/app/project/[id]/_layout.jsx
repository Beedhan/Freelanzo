import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import DashboardIcon from "../../../assets/DashboardIcon";
import ConvoIcon from "../../../assets/ConvoIcon";
import TasksIcon from "../../../assets/TasksIcon";
import FileIcon from "../../../assets/FileIcon";
import NotesIcon from "../../../assets/NotesIcon";
import ProfileIcon from "../../../assets/ProfileIcon";

const Dashboard = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingLeft: 30,
            padding: 12,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props}>
                <DashboardIcon />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="Conversation"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props}>
                <ConvoIcon />
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="Invoice"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props}>
                <TasksIcon />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="Files"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props}>
                <FileIcon />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="InternalNotes"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props}>
                <NotesIcon />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="Clients"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props}>
                <ProfileIcon />
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default Dashboard;
