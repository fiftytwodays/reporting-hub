import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { Organization } from "../config/types";

interface OrganizationListProps {
  data: Organization[];
  isLoading: boolean;
  handleEdit: (region: Organization) => void;
}

export default function OrganizationsList({
  data,
  isLoading,
  handleEdit,
}: OrganizationListProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      mapColumn={(columns) => generateColumns(columns, handleEdit)}
      data={data}
      isLoading={isLoading}
    />
  );
}
