import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import TopSection from "../../../Components/Dashboard/TopSection";
import Section from "../../../Components/Invoice/Section";
import { MaterialIcons } from "@expo/vector-icons";
import { api } from "../../../utils/api";
import { useSearchParams } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const Invoice = () => {
  dayjs.extend(relativeTime);
  const { id } = useSearchParams();

  const [unpaid, setUnpaid] = useState([]);
  const [paid, setPaid] = useState([]);

  const { data:summary } = api.invoice.getSummary.useQuery({
    projectId:id,
  });
  const { data } = api.invoice.getProject.useQuery(
    {
      projectId: id,
    },
    {
      onSuccess: (data) => {
        const tempPaid = [];
        const tempUnpaid = [];
        data.map((invoice) => {
          if (invoice.status === "PENDING") {
            tempUnpaid.push(invoice);
          } else {
            tempPaid.push(invoice);
          }
        });
        setPaid(tempPaid);
        setUnpaid(tempUnpaid);
      },
    }
  );
  return (
    <View className="pt-10 h-full w-full">
      <TopSection name="Invoice" />

      <View className="p-3">
        {/* <View className="pb-5"> */}
        {/* <Text className="text-[#A49C9C] text-2xl font-semibold">Drafts</Text> */}

        {/* {paid?.map((invoice) => (
            <Section
              key={invoice.id}
              CName={invoice.title}
              Amount="230"
              Day="5"
              Type="Draft"
            />
          ))} */}
        {/* </View> */}
        <View className="pb-5">
          <View className="flex flex-row justify-between">
            <Text className="text-[#A49C9C] text-2xl font-semibold">
              Unpaid
            </Text>
            {unpaid?.map((e) => (
              <Text className="text-[#A49C9C] text-2xl font-semibold ">
                ${summary?.totalUnpaid}
              </Text>
            ))}
          </View>
          {unpaid?.map((invoice) => (
            <Section
              key={invoice.id}
              CName={invoice.title}
              Amount={invoice.amount}
              Day={dayjs(invoice.dueDate).fromNow()}
              Type="Draft"
            />
          ))}
        </View>
        <View className="pb-5">
          <View className="flex flex-row justify-between pb-2">
            <Text className="text-[#A49C9C] text-2xl font-semibold">Paid</Text>
            <Text className="text-[#A49C9C] text-2xl font-semibold ">
            ${summary?.totalPaid}
            </Text>
          </View>
          {paid?.map((invoice) => (
            <Section
              key={invoice.id}
              CName={invoice.title}
              Amount={invoice.amount}
              Day={dayjs(invoice.dueDate).fromNow()}
              Type="Draft"
            />
          ))}
          {/* <TouchableOpacity className="mb-6 border-2 rounded-lg border-[#a49c9c] p-2 justify-between flex flex-row items-center">
            <Text className="text-lg  font-medium text-[#a49c9c]">
              View Paid Invoices
            </Text>
            <MaterialIcons name="navigate-next" size={32} color="black" />
          </TouchableOpacity> */}
        </View>
        {/* <TouchableOpacity className="flex flex-row justify-center bg-[#004aad] py-3 rounded-xl mx-4">
          <Text className="text-xl text-white">Create Invoice</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Invoice;
