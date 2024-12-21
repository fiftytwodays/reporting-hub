import { useState } from "react";
import { Button } from "antd";

import { EntityList } from "@/shared/ui/entity-list";

import { columns } from "../config/columns";
import type { User } from "../config/types";
import UserView from "./UserView";
import { useUserListColumns } from "../lib/use-user-list-columns";

interface UserListProps {
  data: User[];
  isLoading: boolean;
}

export default function UsersList({ data, isLoading }: UserListProps) {
  const [isUserViewOpen, setIsUserViewOpen] = useState(false);
  const { userListColumns, selectedRecord } = useUserListColumns(
    columns,
    setIsUserViewOpen
  );

  return (
    <>
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

      <EntityList
        rowKey="Username"
        key="users-list"
        columns={userListColumns}
        data={data}
        isLoading={isLoading}
        showToolbar
        toolbarExtensions={[<Button>Add user</Button>]}
      />
    </>
  );
}
