import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import { Group } from "../config/types";

interface RolesListProps {
  data: Group[];
  isLoading: boolean;
}

export default function RolesList({ data, isLoading }: RolesListProps) {
  return (
    <EntityList
      rowKey="name"
      columns={columns}
      data={data}
      isLoading={isLoading}
    />
  );
}
