"use client";

import { useState, useEffect } from "react";
import { Table } from "antd"; // Using Ant Design components
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);

export default function GroupList() {
  // Define an interface for the Group structure
  interface Group {
    CreationDate: string;
    GroupName: string;
    LastModifiedDate: string;
    Precedence: number;
    RoleArn: string;
    UserPoolId: string;
  }

  // Set the state type explicitly as Group[]
  const [groups, setGroups] = useState<Group[]>([]);

  const client = generateClient<Schema>();

  // Fetch and list groups using Amplify generated client
  async function listGroups() {
    try {
      // Call the mutation to get all the groups
      const response = await client.mutations.listGroups({});

      if (response.data && typeof response.data === "string") {
        const parsedData = JSON.parse(response.data);

        // Extract the groups from the parsed data
        const groupList: Group[] = parsedData.Groups;

        // Set the group data in state
        setGroups(groupList);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  useEffect(() => {
    listGroups();
  }, []);

  const columns = [
    {
      title: "Group Name",
      dataIndex: "GroupName", // The group name from the fetched data
      key: "GroupName",
    },
    {
      title: "Precedence",
      dataIndex: "Precedence", // Display the precedence of the group
      key: "Precedence",
    },
  ];

  // Format groups data for the table
  const groupData = groups.map((group, index) => ({
    key: index,
    GroupName: group.GroupName, // The group name
    Precedence: group.Precedence, // The precedence
  }));

  return (
    <div>
      <h1>User Groups</h1>
      <Table dataSource={groupData} columns={columns} />
    </div>
  );
}
