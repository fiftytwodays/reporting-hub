"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Checkbox,
  Tooltip,
} from "antd"; // Importing necessary Ant Design components
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import icons from Ant Design
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@root/amplify_outputs.json";
import type { Schema } from "@root/amplify/data/resource";

Amplify.configure(outputs);

export default function UserList() {
  interface User {
    Attributes?: Array<{ Name: string; Value: string }>;
    FirstName: string;
    GivenName: string;
    Email: string;
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

  // Define an interface for the Group structure
  interface Group {
    CreationDate: string;
    GroupName: string;
    LastModifiedDate: string;
    Precedence: number;
    RoleArn: string;
    UserPoolId: string;
  }
  const [roles, setRoles] = useState<Group[]>([]);
  async function listRoles() {
    try {
      // Call the mutation to get all the groups
      const response = await client.mutations.listGroups({});

      if (response.data && typeof response.data === "string") {
        const parsedData = JSON.parse(response.data);
        console.log("groups: ", parsedData);

        // Extract the groups from the parsed data
        const groupList: Group[] = parsedData.Groups;

        // Sort the group list by precedence (lowest first)
        const sortedGroupList = groupList.sort(
          (a, b) => a.Precedence - b.Precedence
        );

        // Set the sorted roles to state
        setRoles(sortedGroupList);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  const [projects, setProjects] = useState<Array<Schema["Project"]["type"]>>(
    []
  );
  function listProjects() {
    client.models.Project.observeQuery().subscribe({
      next: (data) => setProjects([...data.items]),
    });
  }

  const [clusters, setClusters] = useState<Array<Schema["Cluster"]["type"]>>(
    []
  );
  function listClusters() {
    client.models.Cluster.observeQuery().subscribe({
      next: (data) => setClusters([...data.items]),
    });
  }

  const [regions, setRegions] = useState<Array<Schema["Region"]["type"]>>([]);
  function listRegions() {
    client.models.Region.observeQuery().subscribe({
      next: (data) => setRegions([...data.items]),
    });
  }

  // Fetch and list users
  async function listUsers() {
    try {
      const response = await client.mutations.listUsers({});
      if (response.data && typeof response.data === "string") {
        const parsedData = JSON.parse(response.data);
        console.log("parsedData: ", parsedData);
        const userList: User[] = parsedData.Users;
        setUsers(userList);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    listUsers();
    listRoles();
    listProjects();
    listClusters();
    listRegions();
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
        <>
          <Tooltip title="View Details">
            <Button
              onClick={() => handleViewUserDetails(user)}
              icon={<EyeOutlined />} // Add the "View" icon
              type="link"
            />
          </Tooltip>
          {/* Edit Icon */}
          <Tooltip title="Edit User">
            <Button
              onClick={() => handleEditUser(user)}
              icon={<EditOutlined />}
              type="link"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(user)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} type="link" />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const userData = users.map((user, index) => ({
    Attributes: user.Attributes,
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

  const handleEditUser = async (user: User) => {
    try {
      console.log("edit user", user);
      const input = {
        userName: user.Email, // Assuming email is the username
      };
      // const input = {
      //   userName: user.Username,
      // };
      console.log("Delete user input: ", input);
      const response = await client.mutations.deleteUser(input);
      console.log("Delete user response: ", response);
      message.success("User deleted successfully");
      listUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Error deleting user: " + error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      console.log("delete user", user);
      const input = {
        userName: user.Email, // Assuming email is the username
      };
      // const input = {
      //   userName: user.Username,
      // };
      console.log("Delete user input: ", input);
      const response = await client.mutations.deleteUser(input);
      console.log("Delete user response: ", response);
      message.success("User deleted successfully");
      listUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Error deleting user: " + error);
    }
  };

  const handleCreateUser = async (values: any) => {
    try {
      // Create user with initial details
      const input = {
        ...values,
        userName: values.email, // Set email as the username
      };
      console.log("Create user input", input);
      const response = await client.mutations.createUser(input);
      console.log("Create user response: ", response);

      // Check if password should be set as permanent
      if (values.isPermanent) {
        const setPasswordInput = {
          userName: values.email, // Assuming email is the username
          password: values.password,
          permanent: true,
        };
        await client.mutations.setUserPassword(setPasswordInput);
        console.log("Password set as permanent");
      }

      if (values.roles && values.roles.length > 0) {
        for (const role of values.roles) {
          const addUserToGroupInput = {
            userName: values.email,
            groupName: role, // Assuming 'role' is the group name
          };
          await client.mutations.addUserToGroup(addUserToGroupInput);
          console.log(`User added to group: ${role}`);
        }
      }

      message.success("User created and assigned to roles successfully");
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
          initialValues={{
            roles: roles.length > 0 ? [roles[0].GroupName] : [], // Set default role
          }}
        >
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
            label="Roles"
            name="roles"
            rules={[{ required: true, message: "Please input the role!" }]}
          >
            <Select
              mode="multiple"
              options={roles.map((role) => ({
                value: role.GroupName,
                label: role.GroupName,
              }))}
            />
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
          <Form.Item name="isPermanent" valuePropName="checked">
            <Checkbox>Set Password as Permanent</Checkbox>
          </Form.Item>

          <Form.Item label="Projects" name="projects">
            <Select
              mode="multiple"
              options={projects.map((project) => ({
                value: project.id,
                label: project.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Clusters" name="clusters">
            <Select
              mode="multiple"
              options={clusters.map((cluster) => ({
                value: cluster.id,
                label: cluster.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Regions" name="regions">
            <Select
              mode="multiple"
              options={regions.map((region) => ({
                value: region.id,
                label: region.name,
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
              <strong>First Name:</strong> {viewUser.FirstName}
            </p>
            <p>
              <strong>Given Name:</strong> {viewUser.GivenName}
            </p>
            <p>
              <strong>Email:</strong> {viewUser.Email}
            </p>
            <p>
              <strong>Enabled:</strong> {viewUser.Enabled ? "Yes" : "No"}
            </p>
            <p>
              <strong>User Status:</strong> {viewUser.UserStatus}
            </p>
            <p>
              <strong>Projects:</strong>{" "}
              {getAttributeValue(viewUser.Attributes, "custom:projects")}
            </p>
            <p>
              <strong>Clusters:</strong>{" "}
              {getAttributeValue(viewUser.Attributes, "custom:clusters")}
            </p>
            <p>
              <strong>Regions:</strong>{" "}
              {getAttributeValue(viewUser.Attributes, "custom:regions")}
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
