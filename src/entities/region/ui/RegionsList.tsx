import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { Region } from "../config/types";

interface RegionsListProps {
  data: Region[];
  isLoading: boolean;
  handleEdit: (region: Region) => void;
  handleDelete: (region: Region) => void;
}

export default function RegionsList({ data, isLoading, handleDelete, handleEdit }: RegionsListProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      mapColumn={(columns) => generateColumns(columns, handleDelete, handleEdit)}
      data={data}
      isLoading={isLoading}

    />
  );
}
