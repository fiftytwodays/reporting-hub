import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { Cluster } from "../config/types";

interface ClusterListProps {
  data: Cluster[];
  isLoading: boolean;
  handleEdit: (project: Cluster) => void;
  handleDelete: (project: Cluster) => void;
}

export default function ClustersList({ data, isLoading, handleDelete, handleEdit }: ClusterListProps) {
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