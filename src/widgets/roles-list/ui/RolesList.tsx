import { Cluster } from "@/entities/cluster/config/types";
import useRolesList from "@/entities/roles/api/roles-list";
import { message } from "antd";
import { useState } from "react";
import { RolesList as _RolesList } from "@/entities/roles";

export default function ClustersList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });

  const { rolesList, isRolesListLoading } =
    useRolesList({
      condition: true,
    });

  return (
    <>
      {contextHolder}
      <_RolesList
        data={rolesList}
        isLoading={isRolesListLoading}
      />
    </>
  );
}
