"use client";

import { useState, useEffect } from "react";
import { Table } from "antd"; // Using Ant Design components
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@root/amplify_outputs.json";
import type { Schema } from "../../../../amplify/data/resource";

Amplify.configure(outputs);

export default function UserList() {
  // Define an interface for the User structure
  interface User {
    Username: string;
    Attributes: Array<{ Name: string; Value: string }>;
    Enabled: boolean;
    UserCreateDate: string;
    UserLastModifiedDate: string;
    UserStatus: string;
  }

  // Set the state type explicitly as User[]
  const [users, setUsers] = useState<User[]>([]);

  const client = generateClient<Schema>();

  // Helper function to get the email attribute from the user's attributes array
  const getAttributeValue = (
    attributes: Array<{ Name: string; Value: string }>,
    attributeName: string
  ) => {
    const attribute = attributes.find((attr) => attr.Name === attributeName);
    return attribute ? attribute.Value : "";
  };

  // Helper function to format the date to the desired readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // Display in 12-hour format with AM/PM
    });
  };

  // Fetch and list users using Amplify generated client
  async function listUsers() {
    try {
      // Call the mutation to get all the users
      const response = await client.mutations.listUsers({});
      console.log("Response: ", response);
      console.log("Response: ", response.data);

      if (response.data && typeof response.data === "string") {
        const parsedData = JSON.parse(response.data);

        // Extract the users from the parsed data
        const userList: User[] = parsedData.Users;

        // Set the user data in state
        setUsers(userList);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    listUsers();
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "Username", // The username from the fetched data
      key: "Username",
    },
    {
      title: "Email",
      dataIndex: "Email", // Custom email column
      key: "Email",
    },
    {
      title: "Enabled",
      dataIndex: "Enabled", // Whether the user is enabled
      key: "Enabled",
      render: (enabled: boolean) => (enabled ? "Yes" : "No"), // Format the boolean
    },
    {
      title: "Created",
      dataIndex: "UserCreateDate", // The user creation date
      key: "UserCreateDate",
      render: (date: string) => formatDate(date), // Format the date
    },
    {
      title: "Last Modified",
      dataIndex: "UserLastModifiedDate", // The last modified date
      key: "UserLastModifiedDate",
      render: (date: string) => formatDate(date), // Format the date
    },
    {
      title: "User Status",
      dataIndex: "UserStatus", // Display the user status
      key: "UserStatus",
    },
  ];

  // Format users data for the table, including the email attribute and dates
  const userData = users.map((user, index) => ({
    key: index,
    Username: user.Username, // The username
    Email: getAttributeValue(user.Attributes, "email"), // Extract email from attributes
    Enabled: user.Enabled, // Whether the user is enabled
    UserCreateDate: user.UserCreateDate, // The user creation date
    UserLastModifiedDate: user.UserLastModifiedDate, // The last modified date
    UserStatus: user.UserStatus, // The user status
  }));

  return (
    <div>
      <h1>Users</h1>
      <Table dataSource={userData} columns={columns} />
    </div>
  );
}
