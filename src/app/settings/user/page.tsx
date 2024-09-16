"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd"; // Importing necessary Ant Design components
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@root/amplify_outputs.json";
import type { Schema } from "@root/amplify/data/resource";

Amplify.configure(outputs);

export default function UserList() {
  interface User {
    Attributes: Array<{ Name: string; Value: string }>;
    Enabled: boolean;
    UserCreateDate: string;
    UserLastModifiedDate: string;
    UserStatus: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [viewUser, setViewUser] = useState<User | null>(null); // State for viewing user details
  const [form] = Form.useForm(); // Ant Design form instance

  const client = generateClient<Schema>();

  const dummyProjects = ["Project1", "Project2", "Project3"];
  const dummyClusters = ["Cluster1", "Cluster2", "Cluster3"];
  const dummyRegions = ["Region1", "Region2", "Region3"];

  // Fetch and list users
  async function listUsers() {
    try {
      const response = await client.mutations.listUsers({});
      if (response.data && typeof response.data === "string") {
        const parsedData = JSON.parse(response.data);
        const userList: User[] = parsedData.Users;
        setUsers(userList);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    listUsers();
  }, []);

  // Helper function to get the attribute value from user's attributes array
  const getAttributeValue = (
    attributes: Array<{ Name: string; Value: string }> | null | undefined, // Handle null or undefined
    attributeName: string
  ) => {
    if (!attributes) {
      return ""; // Return empty string if attributes is null or undefined
    }
    const attribute = attributes.find((attr) => attr.Name === attributeName);
    return attribute ? attribute.Value : "";
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "FirstName",
      key: "FirstName",
    },
    {
      title: "Given Name",
      dataIndex: "GivenName",
      key: "GivenName",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Enabled",
      dataIndex: "Enabled",
      key: "Enabled",
      render: (enabled: boolean) => (enabled ? "Yes" : "No"),
    },
    {
      title: "User Status",
      dataIndex: "UserStatus",
      key: "UserStatus",
    },
    {
      title: "Last Modified",
      dataIndex: "UserLastModifiedDate",
      key: "UserLastModifiedDate",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Created",
      dataIndex: "UserCreateDate",
      key: "UserCreateDate",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "Action",
      render: (text: any, user: User) => (
        <Button onClick={() => handleViewUserDetails(user)}>
          View Details
        </Button>
      ),
    },
  ];

  const userData = users.map((user, index) => ({
    key: index,
    FirstName: getAttributeValue(user.Attributes, "given_name"),
    GivenName: getAttributeValue(user.Attributes, "family_name"),
    Email: getAttributeValue(user.Attributes, "email"),
    Enabled: user.Enabled,
    UserCreateDate: user.UserCreateDate,
    UserLastModifiedDate: user.UserLastModifiedDate,
    UserStatus: user.UserStatus,
  }));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleViewUserDetails = (user: User) => {
    setViewUser(user); // Set the selected user for the view details modal
  };

  const handleCreateUser = async (values: any) => {
    try {
      // Pass the email as the username to the createUser mutation
      const input = {
        ...values,
        userName: values.email, // Set email as the username
      };
      const response = await client.mutations.createUser(input);
      console.log("Create user response: ", response);
      message.success("User created successfully");
      setIsModalVisible(false);
      form.resetFields();
      listUsers(); // Refresh user list after creation
    } catch (error) {
      message.error("Error creating user: " + error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <Button type="primary" onClick={showModal}>
        Create User
      </Button>
      <Table dataSource={userData} columns={columns} />

      {/* Modal for creating a user */}
      <Modal
        title="Create User"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Footer will be part of the form
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Given Name"
            name="givenName"
            rules={[
              { required: true, message: "Please input the given name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Family Name"
            name="familyName"
            rules={[
              { required: true, message: "Please input the family name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input the password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label="Projects" name="projects">
            <Select
              mode="multiple"
              options={dummyProjects.map((project) => ({
                value: project,
                label: project,
              }))}
            />
          </Form.Item>

          <Form.Item label="Clusters" name="clusters">
            <Select
              mode="multiple"
              options={dummyClusters.map((cluster) => ({
                value: cluster,
                label: cluster,
              }))}
            />
          </Form.Item>

          <Form.Item label="Regions" name="regions">
            <Select
              mode="multiple"
              options={dummyRegions.map((region) => ({
                value: region,
                label: region,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button style={{ marginLeft: "10px" }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for viewing user details */}
      <Modal
        title="User Details"
        visible={!!viewUser} // Open modal if viewUser is set
        onCancel={() => setViewUser(null)} // Close modal by setting viewUser to null
        footer={null}
      >
        {viewUser && (
          <div>
            <p>
              <strong>First Name:</strong>{" "}
              {getAttributeValue(viewUser.Attributes, "given_name")}
            </p>
            <p>
              <strong>Given Name:</strong>{" "}
              {getAttributeValue(viewUser.Attributes, "family_name")}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {getAttributeValue(viewUser.Attributes, "email")}
            </p>
            <p>
              <strong>Enabled:</strong> {viewUser.Enabled ? "Yes" : "No"}
            </p>
            <p>
              <strong>User Status:</strong> {viewUser.UserStatus}
            </p>
            <p>
              <strong>Projects:</strong> {dummyProjects.join(", ")}
            </p>
            <p>
              <strong>Clusters:</strong> {dummyClusters.join(", ")}
            </p>
            <p>
              <strong>Regions:</strong> {dummyRegions.join(", ")}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(viewUser.UserCreateDate).toLocaleString()}
            </p>
            <p>
              <strong>Last Modified:</strong>{" "}
              {new Date(viewUser.UserLastModifiedDate).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
