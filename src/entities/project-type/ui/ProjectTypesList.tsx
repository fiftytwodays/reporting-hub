import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { ProjectType } from "../config/types";

interface ProjectTypesListProps {
  data: ProjectType[];
  isLoading: boolean;
  handleEdit: (projectType: ProjectType) => void;
  handleDelete: (projectType: ProjectType) => void;
}

export default function ProjectTypesList({ data, isLoading, handleDelete, handleEdit }: ProjectTypesListProps) {
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
