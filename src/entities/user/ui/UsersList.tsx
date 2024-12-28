import { useState } from "react";
import { message } from "antd";

import { EntityList } from "@/shared/ui/entity-list";

import { columns } from "../config/columns";
import type { User } from "../config/types";
import UserView from "./UserView";
import { useUserListColumns } from "../lib/use-user-list-columns";
import UserEdit from "./UserEdit";
import useUserDelete from "../api/delete-user";
import useUserDisable from "../api/disable-user";
import useUserEnable from "../api/enable-user";
import UserResetPassword from "./UserResetPassword";

interface UserListProps {
  data: User[];
  isLoading: boolean;
}

export default function UsersList({ data, isLoading }: UserListProps) {
  const [isUserViewOpen, setIsUserViewOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [isUserResetPasswordOpen, setIsUserResetPasswordOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const { onDeleteUser } = useUserDelete(messageApi);
  const { onDisableUser } = useUserDisable(messageApi);
  const { onEnableUser } = useUserEnable(messageApi);

  const { userListColumns, selectedRecord } = useUserListColumns(
    columns,
    setIsUserViewOpen,
    setIsUserEditOpen,
    setIsUserResetPasswordOpen,
    onDeleteUser,
    onDisableUser,
    onEnableUser
  );

  return (
    <>
      {contextHolder}
      <UserView
        userData={selectedRecord}
        isLoading={false}
        isModalOpen={isUserViewOpen}
        onModalCancel={() => {
          setIsUserViewOpen(false);
        }}
        onModalOk={() => {
          setIsUserViewOpen(false);
        }}
      />
      <UserEdit
        key={selectedRecord?.Username}
        userData={selectedRecord}
        isLoading={false}
        isModalOpen={isUserEditOpen}
        onModalCancel={() => {
          setIsUserEditOpen(false);
        }}
        onModalOk={() => {
          setIsUserEditOpen(false);
        }}
      />

      <UserResetPassword
        userData={selectedRecord}
        isModalOpen={isUserResetPasswordOpen}
        onModalOk={() => {
          setIsUserResetPasswordOpen(false);
        }}
        onModalCancel={() => {
          setIsUserResetPasswordOpen(false);
        }}
      />

      <EntityList
        rowKey="Username"
        key="users-list"
        columns={userListColumns}
        data={data}
        isLoading={isLoading}
        showToolbar={false}
      />
    </>
  );
}
