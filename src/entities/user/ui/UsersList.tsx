import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import type { User } from "../config/types";

interface UserListProps {
  data: User[];
  isLoading: boolean;
}

export default function UsersList({ data, isLoading }: UserListProps) {
  return (
    <EntityList
      rowKey="Username"
      key="users-list"
      columns={columns}
      data={data}
      isLoading={isLoading}
    />
  );
}
