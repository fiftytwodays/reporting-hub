import { Modal, Descriptions, Tag, Button } from "antd";
import type { DescriptionsProps } from "antd";

import useClusterList from "@/entities/cluster/api/cluster-list";
import useProjectList from "@/entities/project/api/project-list-new";
import useRegionList from "@/entities/region/api/region-list-new";
import { formatDate, parseStringToArray } from "@/shared/lib";

import useUserGroupList from "../api/user-group-list";

import type { User, UserGroup } from "../config/types";
import type { Cluster } from "@/entities/cluster/config/types";
import type { Project } from "@/entities/project/config/types";
import type { Region } from "@/entities/region/config/types";

interface UserViewProps {
  userData: User | undefined;
  isLoading?: boolean;
  isModalOpen: boolean;
  onModalOk: () => void;
  onModalCancel: () => void;
}

export default function UserView({
  userData,
  isLoading,
  isModalOpen,
  onModalOk,
  onModalCancel,
}: UserViewProps) {
  const clusterListKeys = parseStringToArray(userData?.Clusters);
  const projectListKeys = parseStringToArray(userData?.Projects);
  const regionListKeys = parseStringToArray(userData?.Regions);

  const { clusterList, isClusterListLoading }: any = useClusterList({
    condition: clusterListKeys.length > 0,
    filter: {
      or: clusterListKeys.map((id) => ({ id: { eq: id } })),
    },
  });

  const { projectList, isProjectListLoading }: any = useProjectList({
    condition: projectListKeys.length > 0,
    filter: {
      or: projectListKeys.map((id) => ({ id: { eq: id } })),
    },
  });

  const { regionList, isRegionListLoading }: any = useRegionList({
    condition: regionListKeys.length > 0,
    filter: {
      or: regionListKeys.map((id) => ({ id: { eq: id } })),
    },
  });

  const { userGroupList } = useUserGroupList({ userName: userData?.Email });

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Email",
      children: userData?.Email,
    },
    {
      key: "2",
      label: "Given name",
      children: userData?.GivenName,
    },
    {
      key: "3",
      label: "Family name",
      children: userData?.FamilyName,
    },
    {
      key: "4",
      label: "Roles",
      children: userGroupList.map((group: UserGroup) => (
        <Tag key={group?.GroupName}>{group?.GroupName}</Tag>
      )),
    },
    {
      key: "5",
      label: "Enabled",
      children: userData?.Enabled ? "Yes" : "No",
    },
    {
      key: "6",
      label: "User status",
      children: userData?.UserStatus,
    },
    {
      key: "7",
      label: "Email verified",
      children: userData?.EmailVerified ? "Yes" : "No",
    },
    {
      key: "8",
      label: "Projects",
      children: projectList?.map((project: Project) => (
        <Tag key={project?.name}>{project?.name}</Tag>
      )),
    },
    {
      key: "9",
      label: "Clusters",
      children: clusterList?.map((cluster: Cluster) => (
        <Tag key={cluster?.name}>{cluster?.name}</Tag>
      )),
    },
    {
      key: "10",
      label: "Regions",
      children: regionList?.map((region: Region) => (
        <Tag key={region?.name}>{region?.name}</Tag>
      )),
    },
    {
      key: "11",
      label: "User created on",
      children: formatDate(userData?.UserCreateDate),
    },
    {
      key: "12",
      label: "Last modified on",
      children: formatDate(userData?.UserLastModifiedDate),
    },
  ];

  return (
    <Modal
      loading={
        isLoading ||
        isClusterListLoading ||
        isProjectListLoading ||
        isRegionListLoading
      }
      open={isModalOpen}
      footer={[
        <Button key="ok" type="primary" onClick={onModalOk}>
          OK
        </Button>,
      ]}
      onCancel={onModalCancel}
    >
      <Descriptions
        size="small"
        bordered
        title="User Info"
        items={items}
        column={1}
      />
    </Modal>
  );
}
