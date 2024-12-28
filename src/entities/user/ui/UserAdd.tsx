import { useState } from "react";
import { Modal, Form, Input, Select, Checkbox, message, Button } from "antd";
import { generateClient } from "aws-amplify/data";
import { mutate } from "swr";

import useClusterList from "@/entities/cluster/api/cluster-list";
import useProjectList from "@/entities/project/api/project-list-new";
import useRegionList from "@/entities/region/api/region-list-new";

import type { Schema } from "@root/amplify/data/resource";
import type { UserGroup } from "../config/types";
import type { Cluster } from "@/entities/cluster/config/types";
import type { Project } from "@/entities/project/config/types";
import type { Region } from "@/entities/region/config/types";
import useRoleList from "@/entities/role/api/role-list";

interface UserAddProps {
  isLoading?: boolean;
}

export default function UserAdd({ isLoading }: UserAddProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onModalOk = () => {
    setIsModalOpen(false);
  };

  const onModalCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();
  const client = generateClient<Schema>();

  const [messageApi, contextHolder] = message.useMessage();

  const { clusterList, isClusterListLoading }: any = useClusterList({
    condition: true,
  });

  const { projectList, isProjectListLoading }: any = useProjectList({
    condition: true,
  });

  const { regionList, isRegionListLoading }: any = useRegionList({
    condition: true,
  });

  const { roleList, isRoleListLoading } = useRoleList({});

  const handleOk = () => {
    form.submit();
    onModalOk();
  };

  const sortedRoleList = roleList.sort(
    (a: any, b: any) => a.Precedence - b.Precedence
  );

  const handleFinish = async (values: any) => {
    const input = {
      ...values,
      userName: values.email, // Set email as the username
      projects: values?.projects?.length > 0 ? values?.projects : undefined,
      clusters: values?.clusters?.length > 0 ? values?.clusters : undefined,
      regions: values?.regions?.length > 0 ? values?.regions : undefined,
    };

    console.log("Form values create: ");

    try {
      // Create user with initial details
      messageApi.info("Creating user...");
      const response = await client.mutations.createUser(input);

      // Check if password should be set as permanent
      if (values.isPermanent) {
        const setPasswordInput = {
          userName: values.email, // Assuming email is the username
          password: values.password,
          permanent: true,
        };
        await client.mutations.setUserPassword(setPasswordInput);
      }

      if (values.roles && values.roles.length > 0) {
        for (const role of values.roles) {
          const addUserToGroupInput = {
            userName: values.email,
            groupName: role, // Assuming 'role' is the group name
          };
          await client.mutations.addUserToGroup(addUserToGroupInput);
        }
      }

      messageApi.success("User created successfully!");

      form.resetFields();
      // listUsers(); // Refresh user list after creation
    } catch (error) {
      console.log("Error creating user: ", error);
      messageApi.error("Error creating user. Please try again.");
    }
    mutate(["/api/users"]);
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Add user
      </Button>
      <Modal
        title="Add User"
        key={roleList.length}
        // loading={isRoleListLoading}
        open={isModalOpen}
        okText="Save"
        onCancel={onModalCancel}
        onOk={handleOk}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            roles:
              sortedRoleList.length > 0 ? [sortedRoleList[0].GroupName] : [],
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
              options={sortedRoleList?.map((role: UserGroup) => ({
                value: role.GroupName,
                label: role.GroupName,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Given name"
            name="givenName"
            rules={[
              { required: true, message: "Please input the given name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Family name"
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
            <Checkbox>Set password as permanent</Checkbox>
          </Form.Item>

          <Form.Item label="Projects" name="projects">
            <Select
              mode="multiple"
              options={projectList?.map((project: Project) => ({
                value: project.id,
                label: project.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Clusters" name="clusters">
            <Select
              mode="multiple"
              options={clusterList?.map((cluster: Cluster) => ({
                value: cluster.id,
                label: cluster.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Regions" name="regions">
            <Select
              mode="multiple"
              options={regionList?.map((region: Region) => ({
                value: region.id,
                label: region.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
