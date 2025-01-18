import { Form, Input, Select, Checkbox, Skeleton } from "antd";

import { useClusterList } from "@/entities/cluster";
import { useProjectList } from "@/entities/project";
import { useRegionList } from "@/entities/region";
import { useRoleList } from "@/entities/role";

import type { FormInstance } from "antd";
import type { Cluster } from "@/entities/cluster/config/types";
import type { Project } from "@/entities/project/config/types";
import type { Region } from "@/entities/region/config/types";
import type { UserGroup } from "@/entities/user/config/types";

interface CreateUserFormProps {
  form: FormInstance;
  onCreateUser: (values: any) => void;
}

const CreateUserForm = ({ form, onCreateUser }: CreateUserFormProps) => {
  const { clusterList, isClusterListLoading }: any = useClusterList();
  const { projectList, isProjectListLoading }: any = useProjectList();
  const { regionList, isRegionListLoading }: any = useRegionList();
  const { roleList, isRoleListLoading } = useRoleList({});

  const sortedRoleList = roleList.sort(
    (a: any, b: any) => a.Precedence - b.Precedence
  );

  return (
    <Skeleton
      active
      loading={
        isClusterListLoading ||
        isProjectListLoading ||
        isRegionListLoading ||
        isRoleListLoading
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onCreateUser}
        initialValues={{
          roles: sortedRoleList.length > 0 ? [sortedRoleList[0].GroupName] : [],
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
            options={roleList?.map((role: UserGroup) => ({
              value: role.GroupName,
              label: role.GroupName,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Given name"
          name="givenName"
          rules={[{ required: true, message: "Please input the given name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Family name"
          name="familyName"
          rules={[{ required: true, message: "Please input the family name!" }]}
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
    </Skeleton>
  );
};

export default CreateUserForm;
