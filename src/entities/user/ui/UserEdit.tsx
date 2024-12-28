import { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { generateClient } from "aws-amplify/data";
import { mutate } from "swr";

import useClusterList from "@/entities/cluster/api/cluster-list";
import useProjectList from "@/entities/project/api/project-list-new";
import useRegionList from "@/entities/region/api/region-list-new";
import { parseStringToArray } from "@/shared/lib";

import useUserGroupList from "../api/user-group-list";

import type { Schema } from "@root/amplify/data/resource";
import type { User, UserGroup } from "../config/types";
import type { Cluster } from "@/entities/cluster/config/types";
import type { Project } from "@/entities/project/config/types";
import type { Region } from "@/entities/region/config/types";
import useRoleList from "@/entities/role/api/role-list";

interface UserEditProps {
  userData: User | undefined;
  isLoading?: boolean;
  isModalOpen: boolean;
  onModalOk: () => void;
  onModalCancel: () => void;
}

export default function UserEdit({
  userData,
  isLoading,
  isModalOpen,
  onModalOk,
  onModalCancel,
}: UserEditProps) {
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

  const { userGroupList: userRoleList, isUserGroupListLoading } =
    useUserGroupList({
      userName: userData?.Email,
    });

  const handleOk = () => {
    console.log("trigger");
    form.submit();
    onModalCancel();
  };

  const handleFinish = async (values: any) => {
    console.log("Form values: ", values);

    // Prepare input for updating user attributes
    const input = {
      ...values,
      userName: values.email, // Set email as the username
      projects: values?.projects?.length > 0 ? values?.projects : undefined,
      clusters: values?.clusters?.length > 0 ? values?.clusters : undefined,
      regions: values?.regions?.length > 0 ? values?.regions : undefined,
    };

    console.log("Update user input", input);

    try {
      // Update user attributes
      messageApi.info("Updating user attributes...");

      await client.mutations.updateUserAttributes(input);

      // Manage roles
      const currentRoles = values.roles || [];
      const previousRoles = userRoleList || [];

      // Find roles to add and remove
      const rolesToAdd = currentRoles.filter(
        (role: string) => !previousRoles.includes(role)
      );
      const rolesToRemove = previousRoles.filter(
        (role: string) => !currentRoles.includes(role)
      );

      // Remove roles
      for (const role of rolesToRemove) {
        try {
          const removeUserFromGroupInput = {
            userName: values.email,
            groupName: role,
          };
          console.log("Removing group: ", removeUserFromGroupInput);
          await client.mutations.removeUserFromGroup(removeUserFromGroupInput);
        } catch (error) {
          console.error(
            `Failed to remove user from group for role: ${role}`,
            error
          );
        }
      }

      // Add roles
      for (const role of rolesToAdd) {
        try {
          const addUserToGroupInput = {
            userName: values.email,
            groupName: role,
          };
          console.log("Adding group: ", addUserToGroupInput);
          await client.mutations.addUserToGroup(addUserToGroupInput);
        } catch (error) {
          console.error(`Failed to add user to group for role: ${role}`, error);
        }
      }

      messageApi.success("User updated successfully!");
    } catch (error) {
      console.error("Failed to update user attributes or roles: ", error);
    }
    mutate(["/api/users"]);
  };

  useEffect(() => {
    if (userRoleList && form) {
      form.setFieldsValue({
        roles: userRoleList.map((role: UserGroup) => {
          return role.GroupName;
        }),
      });
    }
  }, [userRoleList]);

  return (
    <>
      {contextHolder}

      <Modal
        title="Edit user"
        loading={
          isClusterListLoading ||
          isProjectListLoading ||
          isRegionListLoading ||
          isRoleListLoading ||
          isLoading
        }
        open={isModalOpen}
        okText="Save"
        onCancel={onModalCancel}
        onOk={handleOk}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            email: userData?.Email,
            givenName: userData?.GivenName,
            familyName: userData?.FamilyName,
            isPermanent: userData?.Enabled,
            projects: parseStringToArray(userData?.Projects),
            clusters: parseStringToArray(userData?.Clusters),
            regions: parseStringToArray(userData?.Regions),

            roles: userRoleList.map((role: UserGroup) => {
              return role.GroupName;
            }),
          }}
          onFinish={(values) => handleFinish(values)}
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
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Roles"
            name="roles"
            rules={[{ required: true, message: "Please input the role!" }]}
          >
            <Select
              mode="multiple"
              options={roleList?.map((role: UserGroup) => ({
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

          <Form.Item label="Projects" name="projects">
            <Select
              mode="multiple"
              options={projectList?.map((project: Project) => ({
                key: project.id,
                value: project.id,
                label: project.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Clusters" name="clusters">
            <Select
              mode="multiple"
              options={clusterList?.map((cluster: Cluster) => ({
                key: cluster.id,
                value: cluster.id,
                label: cluster.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Regions" name="regions">
            <Select
              mode="multiple"
              options={regionList?.map((region: Region) => ({
                key: region.id,
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
