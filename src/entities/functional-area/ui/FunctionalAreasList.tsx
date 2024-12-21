import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { FunctionalArea } from "../config/types";

interface FunctionalAreasListProps {
  data: FunctionalArea[];
  isLoading: boolean;
  handleEdit: (functionalArea: FunctionalArea) => void;
  handleDelete: (functionalArea: FunctionalArea) => void;
}

export default function FunctionalAreasList({ data, isLoading, handleDelete, handleEdit }: FunctionalAreasListProps) {
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
