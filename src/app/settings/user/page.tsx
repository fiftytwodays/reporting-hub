"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Checkbox,
  Tooltip,
  Tag,
} from "antd"; // Importing necessary Ant Design components
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckOutlined,
  LockOutlined,
} from "@ant-design/icons"; // Import icons from Ant Design
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@root/amplify_outputs.json";
import type { Schema } from "@root/amplify/data/resource";

Amplify.configure(outputs);

export default function UserList() {
  interface User {
    Attributes?: Array<{ Name: string; Value: string }>;
    Roles?: Array<string>;
    GivenName: string;
    FamilyName: string;
    Email: string;
    Enabled: boolean;
    UserCreateDate: string;
    UserLastModifiedDate: string;
    UserStatus: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null); // State for viewing user details
  const [form] = Form.useForm(); // Ant Design form instance
  const [resetPasswordForm] = Form.useForm();

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editUserData, setEditUserData] = useState<User>();
  const [resetPasswordUserData, setResetPasswordUserData] = useState<User>();

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

  // async function fetchUsersByRoles() {
  //   const roleUserMap: Record<string, User[]> = {};

  //   // Use Promise.all to handle asynchronous calls
  //   await Promise.all(
  //     roles.map(async (role) => {
  //       const listUsersInGroupInput = {
  //         groupName: role.GroupName,
  //       };
  //       const response = await client.mutations.listUsersInGroup(
  //         listUsersInGroupInput
  //       );
  //       console.log("listusersingroup resp: ", response);
  //       // Assign to the map with role as the key
  //       // roleUserMap[role.GroupName] = users;
  //     })
  //   );

  //   return roleUserMap;
  // }

  // Fetch and list users
  async function listUsers() {
    try {
      const response = await client.mutations.listUsers({});

      // const roleUserMap = await fetchUsersByRoles();

      if (response.data && typeof response.data === "string") {
        const parsedData = JSON.parse(response.data);

        // Transform stringified arrays into actual arrays for specific attributes
        parsedData.Users.forEach((user: any) => {
          if (user.Attributes) {
            user.Attributes.forEach((attribute: any) => {
              if (
                [
                  "custom:projects",
                  "custom:clusters",
                  "custom:regions",
                ].includes(attribute.Name)
              ) {
                try {
                  // Sanitize and parse the value
                  const sanitizedValue = attribute.Value.replace(/'/g, '"'); // Replace single quotes with double quotes
                  const arrayValue = sanitizedValue
                    .replace(/[\[\]]/g, "") // Remove brackets
                    .split(",") // Split by commas
                    .map((item: any) => item.trim()); // Trim whitespace

                  attribute.Value = arrayValue; // Assign the parsed array
                } catch (e) {
                  console.error(
                    `Failed to parse attribute ${attribute.Name}:`,
                    e
                  );
                }
              }
            });
          }
        });

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

  const columns = [
    {
      title: "Given Name",
      dataIndex: "GivenName",
      key: "GivenName",
    },
    {
      title: "Family Name",
      dataIndex: "FamilyName",
      key: "FamilyName",
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
          {/* View Details */}
          <Tooltip title="View Details">
            <Button
              onClick={() => handleViewUserDetails(user)}
              icon={<EyeOutlined />} // Add the "View" icon
              type="link"
            />
          </Tooltip>

          {/* Edit User */}
          <Tooltip title="Edit User">
            <Button
              onClick={() => handleEditUser(user)}
              icon={<EditOutlined />}
              type="link"
            />
          </Tooltip>

          {/* Reset Password */}
          <Tooltip title="Reset Password">
            <Button
              onClick={() => handleResetPasswordBtnClick(user)}
              icon={<LockOutlined />}
              type="link"
            />
          </Tooltip>

          <Tooltip title={user.Enabled ? "Disable User" : "Enable User"}>
            <Popconfirm
              title={`Are you sure you want to ${
                user.Enabled ? "disable" : "enable"
              } this user?`}
              onConfirm={() =>
                user.Enabled ? handleDisableUser(user) : handleEnableUser(user)
              }
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={user.Enabled ? <StopOutlined /> : <CheckOutlined />}
                type="link"
              />
            </Popconfirm>
          </Tooltip>

          {/* Delete User */}
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
    GivenName: getAttributeValue(user.Attributes, "given_name"),
    FamilyName: getAttributeValue(user.Attributes, "family_name"),
    Email: getAttributeValue(user.Attributes, "email"),
    Enabled: user.Enabled,
    UserCreateDate: user.UserCreateDate,
    UserLastModifiedDate: user.UserLastModifiedDate,
    UserStatus: user.UserStatus,
  }));

  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleViewUserDetails = async (user: User) => {
    if (!user.Roles) {
      await listGroupsForUser(user);
    }
    setViewUser(user); // Set the selected user for the view details modal
  };

  async function listGroupsForUser(user: User) {
    try {
      const response = await client.mutations.listGroupsForUser({
        userName: user.Email,
      });

      if (response.data && typeof response.data === "string") {
        const parsedData = JSON.parse(response.data);
        user.Roles =
          parsedData?.Groups?.map((group: Group) => group.GroupName) || [];
        console.log("user roles: ", user.Roles);
      }
    } catch (error) {
      console.error("Error fetching groups for user:", user.Email);
    }
  }

  const handleEditUser = async (user: User) => {
    try {
      setMode("edit");
      if (!user.Roles) {
        await listGroupsForUser(user);
      }
      setEditUserData(user);
      setIsEditModalVisible(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Error deleting user: " + error);
    }
  };

  const handleEnableUser = async (user: User) => {
    console.log("Enable user:", user);
    try {
      const input = {
        userName: user.Email, // Assuming email is the username
      };
      const response = await client.mutations.enableUser(input);
      console.log("Enable user response: ", response);
      message.success("User enabled successfully");
      listUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error enabling user:", error);
      message.error("Error enabling user: " + error);
    }
  };

  const handleDisableUser = async (user: User) => {
    console.log("Disable user:", user);
    try {
      const input = {
        userName: user.Email, // Assuming email is the username
      };
      const response = await client.mutations.disableUser(input);
      console.log("Disable user response: ", response);
      message.success("User disabled successfully");
      listUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error disabling user:", error);
      message.error("Error disabling user: " + error);
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      console.log("values.isPermanent: ", values.isPermanent);
      if (resetPasswordUserData) {
        const setPasswordInput = {
          userName: resetPasswordUserData.Email, // Assuming email is the username
          password: values.password,
          permanent: values.isPermanent ? true : false,
        };
        // Check if password should be set as permanent
        await client.mutations.setUserPassword(setPasswordInput);
        message.success("Password reset completed successfully");
      } else {
        message.error("Error while resetting password: Email is null");
      }
      setResetPasswordUserData(undefined);
      setIsResetPasswordModalVisible(false);
      resetPasswordForm.resetFields();
      listUsers(); // Refresh user list after creation
    } catch (error) {
      message.error("Error while resetting password: " + error);
    }
  };

  const handleResetPasswordCancel = () => {
    resetPasswordForm.resetFields();
    setIsResetPasswordModalVisible(false);
  };

  const handleResetPasswordBtnClick = (user: User) => {
    resetPasswordForm.resetFields();
    setResetPasswordUserData(user);
    setIsResetPasswordModalVisible(true);
  };

  const handleDeleteUser = async (user: User) => {
    try {
      const input = {
        userName: user.Email, // Assuming email is the username
      };
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

  function getEntityNames(
    ids: string[], // Array of ids
    state: any
  ): JSX.Element[] {
    if (!Array.isArray(ids)) {
      console.error("Invalid ids:", ids);
      return [];
    }
    if (!Array.isArray(state)) {
      console.error("Invalid state:", state);
      return [];
    }
    return ids
      .map((id) => {
        const entity = state.find((item: any) => item.id === id);
        if (entity) {
          return <Tag key={id}>{entity.name}</Tag>; // Return a Tag for each found entity
        }
        return <></>; // If not found, return null
      })
      .filter(Boolean); // Remove any null values (in case some ids weren't found)
  }

  return (
    <div>
      <h1>Users</h1>

      <Button
        type="primary"
        onClick={() => {
          form.resetFields();

          setMode("create");
          setEditUserData(undefined);
          setIsModalVisible(true);
        }}
      >
        Create User
      </Button>
      <Divider style={{ margin: "5px 0", borderColor: "transparent" }} />
      <Table dataSource={userData} columns={columns} />

      {/* Modal for creating a user */}
      <Modal
        title="Create User"
        open={isModalVisible}
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
        open={!!viewUser} // Open modal if viewUser is set
        onCancel={() => setViewUser(null)} // Close modal by setting viewUser to null
        footer={null}
      >
        {viewUser && (
          <div>
            <p>
              <strong>Email:</strong> {viewUser.Email}
            </p>
            <p>
              <strong>Given Name:</strong> {viewUser.GivenName}
            </p>
            <p>
              <strong>Family Name:</strong> {viewUser.FamilyName}
            </p>
            <p>
              <strong>Roles:</strong> {convertArrayToTags(viewUser.Roles)}
            </p>
            <p>
              <strong>Enabled:</strong> {viewUser.Enabled ? "Yes" : "No"}
            </p>
            <p>
              <strong>User Status:</strong> {viewUser.UserStatus}
            </p>
            <p>
              <strong>Projects:</strong>{" "}
              {getEntityNames(
                getAttributeValue(viewUser.Attributes, "custom:projects"),
                projects
              )}
            </p>
            <p>
              <strong>Clusters:</strong>{" "}
              {getEntityNames(
                getAttributeValue(viewUser.Attributes, "custom:clusters"),
                clusters
              )}
            </p>
            <p>
              <strong>Regions:</strong>{" "}
              {getEntityNames(
                getAttributeValue(viewUser.Attributes, "custom:regions"),
                regions
              )}
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

      {/* Modal for resetting a password */}
      <Modal
        title={`Reset Password of ${resetPasswordUserData?.Email}`}
        open={isResetPasswordModalVisible}
        onCancel={handleResetPasswordCancel}
        onClose={handleResetPasswordCancel}
        footer={null} // Footer will be part of the form
      >
        <Form
          form={resetPasswordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
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

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Reset Password
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={handleResetPasswordCancel}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <UserModal
        key={editUserData?.Email}
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
        }}
        onSubmit={() => {}}
        mode={mode}
        initialValues={editUserData}
        roles={roles}
        projects={projects}
        clusters={clusters}
        regions={regions}
        client={client}
      />
    </div>
  );
}

// The "Create" and "Edit" modals should use a single form component in the future, and it will be placed in a separate file.

type UserModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  mode: "create" | "edit";
  initialValues?: Record<string, any>;
  roles: Array<{ GroupName: string }>;
  projects: Array<{ id: string; name: string }>;
  clusters: Array<{ id: string; name: string }>;
  regions: Array<{ id: string; name: string }>;
  client: any;
};

const UserModal: React.FC<UserModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  mode,
  initialValues = {},
  roles,
  projects,
  clusters,
  regions,
  client,
}) => {
  const [form] = Form.useForm();

  const title = mode === "create" ? "Create User" : "Edit User";

  const handleFinish = async (values: any, initialValues: any) => {
    // onSubmit(values);
    try {
      // Update user with initial details
      const input = {
        ...values,
        userName: values.email, // Set email as the username
        projects: checkEmptyArrayAndReturnUndefined(values.projects),
        clusters: checkEmptyArrayAndReturnUndefined(values.clusters),
        regions: checkEmptyArrayAndReturnUndefined(values.regions),
      };

      console.log("Update user input", input);
      const response = await client.mutations.updateUserAttributes(input);
      console.log("Update user response: ", response);

      // if (values.roles && values.roles.length > 0) {
      //   for (const role of values.roles) {
      //     const addUserToGroupInput = {
      //       userName: values.email,
      //       groupName: role, // Assuming 'role' is the group name
      //     };
      //     await client.mutations.addUserToGroup(addUserToGroupInput);
      //     console.log(`User added to group: ${role}`);
      //   }
      // }
      // Extract the roles from the values and initialValues
      const currentRoles = values.roles || [];
      const previousRoles = initialValues.Roles || [];

      // Find roles that have been added (present in currentRoles but not in previousRoles)
      const rolesToAdd = currentRoles.filter(
        (role: string) => !previousRoles.includes(role)
      );

      // Find roles that have been removed (present in previousRoles but not in currentRoles)
      const rolesToRemove = previousRoles.filter(
        (role: string) => !currentRoles.includes(role)
      );

      // Call the removeUserFromGroup mutation for each role removed
      for (const role of rolesToRemove) {
        try {
          const removeUserFromGroupInput = {
            userName: values.email,
            groupName: role,
          };
          console.log("removing group: ", removeUserFromGroupInput);
          await client.mutations.removeUserFromGroup(removeUserFromGroupInput);
        } catch (error) {
          console.error(
            `Failed to remove user from group for role: ${role}`,
            error
          );
        }
      }

      // Call the addUserToGroup mutation for each role added
      for (const role of rolesToAdd) {
        try {
          const addUserToGroupInput = {
            userName: values.email,
            groupName: role,
          };
          console.log("adding group: ", addUserToGroupInput);
          await client.mutations.addUserToGroup(addUserToGroupInput);
        } catch (error) {
          console.error(`Failed to add user to group for role: ${role}`, error);
        }
      }

      message.success("User updated successfully");
      form.resetFields();
    } catch (error) {
      message.error("Error creating user: " + error);
    }
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          email: initialValues?.Email,
          givenName: initialValues?.GivenName,
          familyName: initialValues?.FamilyName,
          isPermanent: initialValues?.Enabled,
          projects: getAttributeValue(
            initialValues.Attributes,
            "custom:projects"
          ),
          clusters: getAttributeValue(
            initialValues.Attributes,
            "custom:clusters"
          ),
          regions: getAttributeValue(
            initialValues.Attributes,
            "custom:regions"
          ),

          roles: initialValues.Roles,
        }}
        onFinish={(values) => handleFinish(values, initialValues)}
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
          <Input disabled={mode === "edit"} />
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
          rules={[{ required: true, message: "Please input the given name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Family Name"
          name="familyName"
          rules={[{ required: true, message: "Please input the family name!" }]}
        >
          <Input />
        </Form.Item>

        {mode === "create" && (
          <>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input the password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name="isPermanent" valuePropName="checked">
              <Checkbox>Set Password as Permanent</Checkbox>
            </Form.Item>
          </>
        )}

        <Form.Item label="Projects" name="projects">
          <Select
            mode="multiple"
            options={projects.map((project) => ({
              key: project.id,
              value: project.id,
              label: project.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="Clusters" name="clusters">
          <Select
            mode="multiple"
            options={clusters.map((cluster) => ({
              key: cluster.id,
              value: cluster.id,
              label: cluster.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="Regions" name="regions">
          <Select
            mode="multiple"
            options={regions.map((region) => ({
              key: region.id,
              value: region.id,
              label: region.name,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button style={{ marginLeft: "10px" }} onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

function convertArrayToTags(arr: string[] | undefined) {
  if (arr) {
    return arr
      .map((elm) => {
        if (elm) {
          return <Tag key={elm}>{elm}</Tag>; // Return a Tag for each found entity
        }
        return <></>; // If not found, return null
      })
      .filter(Boolean);
  }
}

// Helper function to get the attribute value from user's attributes array
const getAttributeValue = (
  attributes:
    | Array<{ Name: string; Value: string | string[] }>
    | null
    | undefined,
  attributeName: string
): any => {
  if (!attributes) {
    return undefined;
  }
  const attribute = attributes.find((attr) => attr.Name === attributeName);

  if (attribute) {
    // Check if Value is a string or string[]
    if (Array.isArray(attribute.Value)) {
      return attribute.Value.length > 0 ? attribute.Value : undefined; // Return the array if it's a string[]
    }
    return attribute.Value; // Return the string if it's a string
  }

  return undefined;
};

// Helper function to check if array length is zero and if zero return undefined
const checkEmptyArrayAndReturnUndefined = (
  arr: Array<string | string[]> | null | undefined
): any => {
  if (!arr) {
    return undefined;
  }

  return Array.isArray(arr) && arr.length == 0 ? undefined : arr;
};
